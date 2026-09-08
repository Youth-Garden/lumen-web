'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  StudyExerciseType,
  StudyFeedbackState,
  StudyQueueItem,
  type MissedWordStat,
} from '@/features/study/types/study.types';
import {
  createNextExerciseForWord,
  getCardPrimaryDefinition,
} from '@/features/study/utils/quiz-generator';
import {
  calculateProgressPercent,
  createInitialStudyQueue,
  determineFlashcardQuality,
  filterPoolCards,
  insertNextExerciseInQueue,
  sortMissedWords,
} from '@/features/study/utils/study-session.utils';
import { useReviewFlashcard } from './use-study';
import { useStudyAudio } from './use-study-audio';
import { useStudySettings } from './use-study-settings';
import { useStudyShortcuts } from './use-study-shortcuts';
import { FlashcardRating, type CardWithProgress } from '@/services/study';
import { type VocabularyWord } from '@/services/vocabulary';

export interface UseStudySessionProps {
  cards: VocabularyWord[];
  selectedTopic?: string;
  isOpen: boolean;
  onClose: () => void;
}

export function useStudySession({
  cards,
  selectedTopic,
  isOpen,
  onClose,
}: UseStudySessionProps) {
  const t = useTranslations('Vocabulary.Study');
  const tFolders = useTranslations('Vocabulary.Folders');
  const { settings, currentQuotaConfig } = useStudySettings();
  const reviewMutation = useReviewFlashcard();

  const storageKey = useMemo(
    () =>
      'lumen_study_session_' +
      (selectedTopic ? encodeURIComponent(selectedTopic) : 'general'),
    [selectedTopic],
  );

  const poolCards = useMemo(
    () =>
      filterPoolCards(
        cards,
        selectedTopic,
        settings.wordsPerSession || currentQuotaConfig.targetCount || 20,
        tFolders('generalTopic'),
      ),
    [
      cards,
      selectedTopic,
      settings.wordsPerSession,
      currentQuotaConfig.targetCount,
      tFolders,
    ],
  );

  const [activeQueue, setActiveQueue] = useState<StudyQueueItem[]>([]);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [feedback, setFeedback] = useState<StudyFeedbackState | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null,
  );
  const [missedWordsMap, setMissedWordsMap] = useState<
    Record<string, MissedWordStat>
  >({});
  const canFlipRef = useRef(true);

  const currentItem = activeQueue[0] || null;
  const currentCard = currentItem?.card || null;
  const isFinished = poolCards.length > 0 && activeQueue.length === 0;
  const progressPercent = calculateProgressPercent(
    masteredIds.length,
    poolCards.length,
  );

  const initializeSession = useCallback(() => {
    setActiveQueue(createInitialStudyQueue(poolCards));
    setMasteredIds([]);
    setIsFlipped(false);
    setFeedback(null);
    setSelectedOptionIndex(null);
  }, [poolCards]);

  useEffect(() => {
    if (!isOpen || poolCards.length === 0) return;
    initializeSession();
  }, [poolCards, isOpen, initializeSession]);

  useEffect(() => {
    canFlipRef.current = false;
    const timer = setTimeout(() => {
      canFlipRef.current = true;
    }, 200);
    return () => clearTimeout(timer);
  }, [currentItem?.id]);

  const currentCardMastery = useMemo(() => {
    if (!currentCard) return 0;
    return (currentCard as CardWithProgress).level ?? 0;
  }, [currentCard]);

  const currentCardLearningStep = useMemo(() => {
    if (!currentCard) return 0;
    return (currentCard as CardWithProgress).learningStep ?? 0;
  }, [currentCard]);

  const recordMissedWord = useCallback((card: VocabularyWord) => {
    setMissedWordsMap((prev) => ({
      ...prev,
      [card.id]: {
        card,
        errorCount: (prev[card.id]?.errorCount || 0) + 1,
      },
    }));
  }, []);

  const handleFlip = useCallback(() => {
    if (!canFlipRef.current) return;
    setIsFlipped((prev) => !prev);
  }, []);

  const handleAdvanceFromFlashcard = useCallback(
    (rating: FlashcardRating) => {
      if (!currentCard) return;

      try {
        reviewMutation.mutate({
          flashcardId: currentCard.id,
          quality: determineFlashcardQuality(rating),
        });
      } catch {}

      setIsFlipped(false);

      const nextExercise = createNextExerciseForWord(
        currentCard,
        poolCards,
        StudyExerciseType.FLASHCARD,
        false,
      );
      setActiveQueue((prev) => insertNextExerciseInQueue(prev, nextExercise));
    },
    [currentCard, poolCards, reviewMutation],
  );

  const handleMastered = useCallback(() => {
    handleAdvanceFromFlashcard(FlashcardRating.FAST_TRACK_KNOWN);
  }, [handleAdvanceFromFlashcard]);

  const handleReview = useCallback(() => {
    handleAdvanceFromFlashcard(FlashcardRating.FAST_TRACK_TEMP);
  }, [handleAdvanceFromFlashcard]);

  const handleDontKnow = useCallback(() => {
    if (!currentCard) return;
    recordMissedWord(currentCard);
    handleAdvanceFromFlashcard(FlashcardRating.WRONG);
  }, [currentCard, recordMissedWord, handleAdvanceFromFlashcard]);

  const handleVerifyAnswer = useCallback(
    (isCorrect: boolean, userAnswer?: string) => {
      if (!currentCard || !currentItem) return;
      const { meaning, partOfSpeech } = getCardPrimaryDefinition(currentCard);

      setFeedback({
        isOpen: true,
        isCorrect,
        card: currentCard,
        userAnswer,
        correctAnswer: currentCard.term,
        meaning,
        partOfSpeech,
        imageUrl: currentCard.imageUrl,
      });

      if (isCorrect) {
        try {
          reviewMutation.mutate({
            flashcardId: currentCard.id,
            quality: FlashcardRating.CORRECT,
          });
        } catch {}
        setMasteredIds((prev) =>
          prev.includes(currentCard.id) ? prev : [...prev, currentCard.id],
        );
      } else {
        recordMissedWord(currentCard);
        try {
          reviewMutation.mutate({
            flashcardId: currentCard.id,
            quality: FlashcardRating.WRONG,
          });
        } catch {}
      }
    },
    [currentCard, currentItem, reviewMutation, recordMissedWord],
  );

  const handleSelectChoiceOption = useCallback(
    (optionIndex: number) => {
      if (!currentItem?.options) return;
      const option = currentItem.options[optionIndex];
      if (!option) return;
      setSelectedOptionIndex(optionIndex);
      handleVerifyAnswer(option.isCorrect, option.label);
    },
    [currentItem, handleVerifyAnswer],
  );

  const handleSubmitTyping = useCallback(
    (input: string) => {
      if (!currentCard) return;
      const isCorrect =
        input.trim().toLowerCase() === currentCard.term.trim().toLowerCase();
      handleVerifyAnswer(isCorrect, input.trim());
    },
    [currentCard, handleVerifyAnswer],
  );

  const handleContinueFeedback = useCallback(() => {
    if (!feedback || !currentCard || !currentItem) return;
    const wasCorrect = feedback.isCorrect;
    setFeedback(null);
    setSelectedOptionIndex(null);

    const remaining = activeQueue.slice(1);
    if (wasCorrect) {
      setActiveQueue(remaining);
    } else {
      const retry = createNextExerciseForWord(
        currentCard,
        poolCards,
        currentItem.exerciseType,
        true,
      );
      setActiveQueue([...remaining, retry]);
    }
  }, [feedback, currentCard, currentItem, activeQueue, poolCards]);

  const handleRestart = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
    initializeSession();
    setMissedWordsMap({});
  }, [storageKey, initializeSession]);

  const handleSaveProgress = useCallback(() => {
    if (!isOpen || poolCards.length === 0) return;
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          activeQueueIds: activeQueue.map((item) => item.card.id),
          masteredIds,
          missedWordsMap,
          updatedAt: Date.now(),
        }),
      );
      toast.success(t('saveProgressSuccess'));
    } catch (err) {
      console.error('Failed to save study progress:', err);
      toast.error(t('saveProgressError'));
    }
  }, [
    isOpen,
    poolCards.length,
    activeQueue,
    masteredIds,
    missedWordsMap,
    storageKey,
    t,
  ]);

  const {
    activePhonetic,
    isPlaying,
    playingAccent,
    handlePlayUsAudio,
    handlePlayUkAudio,
    handlePlayAudio,
  } = useStudyAudio({
    currentCard,
    exerciseType: currentItem?.exerciseType,
    autoPlayAudio: settings.autoPlayAudio,
    accent: settings.accent,
    isOpen,
    isFinished,
  });

  useStudyShortcuts({
    isOpen,
    isFinished,
    isFlipped,
    canFlipRef,
    isFeedbackOpen: Boolean(feedback?.isOpen),
    exerciseType: currentItem?.exerciseType || StudyExerciseType.FLASHCARD,
    onFlip: handleFlip,
    onMastered: handleMastered,
    onReview: handleReview,
    onDontKnow: handleDontKnow,
    onSelectChoice: handleSelectChoiceOption,
    onContinueFeedback: handleContinueFeedback,
    onPlayUsAudio: handlePlayUsAudio,
    onPlayUkAudio: handlePlayUkAudio,
    onClose,
  });

  return {
    activeQueue,
    poolCards,
    masteredIds,
    currentItem,
    currentCard,
    quotaRangeText: currentQuotaConfig.rangeText,
    isFlipped,
    isFinished,
    feedback,
    selectedOptionIndex,
    progressPercent,
    activePhonetic,
    currentCardMastery,
    currentCardLearningStep,
    canFlipRef,
    isSubmitting: reviewMutation.isPending,
    playingAccent,
    isPlaying,
    missedWordsList: useMemo(
      () => sortMissedWords(missedWordsMap),
      [missedWordsMap],
    ),
    settings,
    handleFlip,
    handleMastered,
    handleReview,
    handleDontKnow,
    handleSelectChoiceOption,
    handleSubmitTyping,
    handleContinueFeedback,
    handleRestart,
    handleSaveProgress,
    handlePlayUsAudio,
    handlePlayUkAudio,
    handlePlayAudio,
    handleVerifyAnswer,
  };
}
