'use client';

import {
  FlashcardRating,
  PronunciationAccent,
  type CardWithProgress,
  type VocabularyWord,
} from '@/services/vocabulary/vocabulary.types';
import { usePronunciation } from '@/shared/hooks';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  createNextExerciseForWord,
  getCardPrimaryDefinition,
} from '@/features/study/utils/quiz-generator';
import {
  StudyExerciseType,
  StudyFeedbackState,
  StudyQueueItem,
} from '@/features/study/types/study.types';
import type {
  MissedWordStat,
  UseStudySessionProps,
} from '@/features/study/hooks/use-study-session.types';
import { useStudySettings } from '@/features/study/hooks/use-study-settings';
import { useStudyShortcuts } from '@/features/study/hooks/use-study-shortcuts';
import { useReviewFlashcard } from '@/features/vocabulary/hooks/use-vocabulary';

export type { MissedWordStat, UseStudySessionProps };

export function useStudySession({
  cards,
  selectedTopic,
  isOpen,
  onClose,
}: UseStudySessionProps) {
  const t = useTranslations('Vocabulary.Study');
  const tFolders = useTranslations('Vocabulary.Folders');
  const { settings, currentQuotaConfig } = useStudySettings();
  const { playPronunciation, isPlaying, playingAccent } = usePronunciation();
  const reviewMutation = useReviewFlashcard();

  const storageKey = useMemo(
    () =>
      'lumen_study_session_' +
      (selectedTopic ? encodeURIComponent(selectedTopic) : 'general'),
    [selectedTopic],
  );

  // 1. Filter pool by topic and quota
  const poolCards = useMemo(() => {
    let list = cards;
    if (selectedTopic) {
      list = cards.filter((card) => {
        const top = card.topic?.trim() || tFolders('generalTopic');
        return top === selectedTopic;
      });
    }

    const count =
      settings.wordsPerSession || currentQuotaConfig.targetCount || 20;
    return list.slice(0, count);
  }, [
    cards,
    selectedTopic,
    settings.wordsPerSession,
    currentQuotaConfig.targetCount,
    tFolders,
  ]);

  // 2. State
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

  // 3. Initialize or restore session
  useEffect(() => {
    if (!isOpen || poolCards.length === 0) return;

    // Build initial queue:
    // Brand new words (reps=0) start with FLASHCARD
    // Known/review words start directly with an interactive exercise
    const initialQueue: StudyQueueItem[] = poolCards.map((card) => {
      const cardWithProg = card as CardWithProgress;
      const isBrandNew = (cardWithProg.level ?? 0) === 0;

      if (isBrandNew) {
        return {
          id: 'flashcard_' + card.id + '_' + Date.now(),
          card,
          exerciseType: StudyExerciseType.FLASHCARD,
        };
      }

      return createNextExerciseForWord(card, poolCards, undefined, false);
    });

    setActiveQueue(initialQueue);
    setMasteredIds([]);
    setIsFlipped(false);
    setFeedback(null);
    setSelectedOptionIndex(null);
    setMissedWordsMap({});
  }, [poolCards, isOpen]);

  // Current Item
  const currentItem = activeQueue[0] || null;
  const currentCard = currentItem?.card || null;

  // Auto-flip debouncing protection for flashcards
  useEffect(() => {
    canFlipRef.current = false;
    const timer = setTimeout(() => {
      canFlipRef.current = true;
    }, 200);
    return () => clearTimeout(timer);
  }, [currentItem?.id]);

  // Status flags
  const isFinished = poolCards.length > 0 && activeQueue.length === 0;
  const progressPercent =
    poolCards.length > 0 ? (masteredIds.length / poolCards.length) * 100 : 0;

  // Active phonetic
  const activePhonetic = useMemo(() => {
    if (!currentCard) return '';
    if (settings.accent === PronunciationAccent.UK && currentCard.phoneticUk) {
      return currentCard.phoneticUk;
    }
    return currentCard.phoneticUs || currentCard.phonetic || '';
  }, [currentCard, settings.accent]);

  /**
   * Mastery level to display for the CURRENT card (0-5).
   * Maps directly to card.level from the database.
   */
  const currentCardMastery = useMemo(() => {
    if (!currentCard) return 0;
    const cardWithProg = currentCard as CardWithProgress;
    return cardWithProg.level ?? 0;
  }, [currentCard]);

  const currentCardLearningStep = useMemo(() => {
    if (!currentCard) return 0;
    const cardWithProg = currentCard as CardWithProgress;
    // Mock local progress during study session if it's missed/correct
    const missed = missedWordsMap[currentCard.id]?.errorCount || 0;
    // We don't have local correct tracking, so we just use the DB learning step
    return cardWithProg.learningStep ?? 0;
  }, [currentCard, missedWordsMap]);

  // Audio Handlers
  const handlePlayUsAudio = useCallback(() => {
    if (!currentCard) return;
    playPronunciation({
      term: currentCard.term,
      audioUrl: currentCard.audioUrl || undefined,
      audioUsUrl: currentCard.audioUsUrl || undefined,
      accent: PronunciationAccent.US,
    });
  }, [currentCard, playPronunciation]);

  const handlePlayUkAudio = useCallback(() => {
    if (!currentCard) return;
    playPronunciation({
      term: currentCard.term,
      audioUkUrl: currentCard.audioUkUrl || undefined,
      accent: PronunciationAccent.UK,
    });
  }, [currentCard, playPronunciation]);

  const handlePlayAudio = useCallback(() => {
    if (settings.accent === 'uk') handlePlayUkAudio();
    else handlePlayUsAudio();
  }, [settings.accent, handlePlayUkAudio, handlePlayUsAudio]);

  // Auto-play audio when flashcard or listening exercise opens
  useEffect(() => {
    if (!isOpen || isFinished || !currentCard || !settings.autoPlayAudio)
      return;
    if (
      currentItem?.exerciseType === StudyExerciseType.FLASHCARD ||
      currentItem?.exerciseType === StudyExerciseType.CHOICE_MEANING
    ) {
      const timer = setTimeout(() => {
        handlePlayAudio();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [
    currentItem?.id,
    currentItem?.exerciseType,
    currentCard,
    isOpen,
    isFinished,
    settings.autoPlayAudio,
    handlePlayAudio,
  ]);

  const handleFlip = useCallback(() => {
    if (!canFlipRef.current) return;
    setIsFlipped((prev) => !prev);
  }, []);

  const recordMissedWord = useCallback((card: VocabularyWord) => {
    setMissedWordsMap((prev) => {
      const existing = prev[card.id];
      return {
        ...prev,
        [card.id]: {
          card,
          errorCount: (existing?.errorCount || 0) + 1,
        },
      };
    });
  }, []);

  // --- Flashcard Actions ---
  // When Flashcard is finished, advance word into interactive exercise queue!
  const handleAdvanceFromFlashcard = useCallback(
    (rating: FlashcardRating) => {
      if (!currentCard) return;

      try {
        const isCorrect = rating !== FlashcardRating.WRONG;
        const isFastTrackKnown = rating === FlashcardRating.FAST_TRACK_KNOWN;
        const isFastTrackTempMemory =
          rating === FlashcardRating.FAST_TRACK_TEMP;

        let quality = FlashcardRating.CORRECT;
        if (!isCorrect) quality = FlashcardRating.WRONG;
        else if (isFastTrackKnown) quality = FlashcardRating.FAST_TRACK_KNOWN;
        else if (isFastTrackTempMemory) quality = FlashcardRating.FAST_TRACK_TEMP;

        reviewMutation.mutate({
          flashcardId: currentCard.id,
          quality,
        });
      } catch {}

      setIsFlipped(false);

      // Create the next interactive exercise for this card
      const nextExercise = createNextExerciseForWord(
        currentCard,
        poolCards,
        StudyExerciseType.FLASHCARD,
        false,
      );

      const remaining = activeQueue.slice(1);
      // Put nextExercise into activeQueue:
      // If user clicked "Đã thuộc" or "Nhớ tạm", place it 2-3 items ahead or at the end
      if (remaining.length > 2) {
        const insertIdx = Math.min(remaining.length, 3);
        const updated = [
          ...remaining.slice(0, insertIdx),
          nextExercise,
          ...remaining.slice(insertIdx),
        ];
        setActiveQueue(updated);
      } else {
        setActiveQueue([...remaining, nextExercise]);
      }
    },
    [currentCard, activeQueue, poolCards, reviewMutation],
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

  // --- Interactive Exercise Actions ---
  // Verify answer and trigger Feedback Drawer
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
        imageUrl: currentCard.imageUrl || null,
      });

      if (isCorrect) {
        try {
          reviewMutation.mutate({
            flashcardId: currentCard.id,
            quality: FlashcardRating.CORRECT,
          });
        } catch {}

        setMasteredIds((prev) => {
          if (prev.includes(currentCard.id)) return prev;
          return [...prev, currentCard.id];
        });
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

  // Multiple choice selection (0-3)
  const handleSelectChoiceOption = useCallback(
    (optionIndex: number) => {
      if (!currentItem || !currentItem.options) return;
      const option = currentItem.options[optionIndex];
      if (!option) return;

      setSelectedOptionIndex(optionIndex);
      handleVerifyAnswer(option.isCorrect, option.label);
    },
    [currentItem, handleVerifyAnswer],
  );

  // Typing submit
  const handleSubmitTyping = useCallback(
    (input: string) => {
      if (!currentCard) return;
      const normalizedInput = input.trim().toLowerCase();
      const normalizedTarget = currentCard.term.trim().toLowerCase();
      const isCorrect = normalizedInput === normalizedTarget;

      handleVerifyAnswer(isCorrect, input.trim());
    },
    [currentCard, handleVerifyAnswer],
  );

  // Continue from Feedback Drawer (Press Space or Click)
  const handleContinueFeedback = useCallback(() => {
    if (!feedback || !currentCard || !currentItem) return;

    const wasCorrect = feedback.isCorrect;
    setFeedback(null);
    setSelectedOptionIndex(null);

    const remaining = activeQueue.slice(1);

    if (wasCorrect) {
      // If correct and this wasn't a retry, check if we need 1 more reinforcement or complete
      setActiveQueue(remaining);
    } else {
      // If incorrect, generate a new exercise for this card and push to the END of queue!
      const retryExercise = createNextExerciseForWord(
        currentCard,
        poolCards,
        currentItem.exerciseType,
        true, // isReviewingFailed = true
      );
      setActiveQueue([...remaining, retryExercise]);
    }
  }, [feedback, currentCard, currentItem, activeQueue, poolCards]);

  const handleRestart = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}

    const freshQueue: StudyQueueItem[] = poolCards.map((card) => {
      const cardWithProg = card as CardWithProgress;
      const isBrandNew = (cardWithProg.level ?? 0) === 0;
      if (isBrandNew) {
        return {
          id: 'flashcard_' + card.id + '_' + Date.now(),
          card,
          exerciseType: StudyExerciseType.FLASHCARD,
        };
      }
      return createNextExerciseForWord(card, poolCards, undefined, false);
    });

    setActiveQueue(freshQueue);
    setMasteredIds([]);
    setIsFlipped(false);
    setFeedback(null);
    setSelectedOptionIndex(null);
    setMissedWordsMap({});
  }, [poolCards, storageKey]);

  const handleSaveProgress = useCallback(() => {
    if (!isOpen || poolCards.length === 0) return;
    try {
      const payload = {
        activeQueueIds: activeQueue.map((item) => item.card.id),
        masteredIds,
        missedWordsMap,
        updatedAt: Date.now(),
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
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

  const missedWordsList: MissedWordStat[] = useMemo(() => {
    return Object.values(missedWordsMap).sort(
      (firstStat, secondStat) => secondStat.errorCount - firstStat.errorCount,
    );
  }, [missedWordsMap]);

  // Global Keyboard Shortcuts
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
    missedWordsList,
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
  };
}
