'use client';

import {
  StudyFeedbackDrawer,
  type StudyFeedbackDrawerData,
} from '@/features/study/components/study-feedback-drawer';
import {
  StudyExerciseType,
  StudyFeedbackState,
  StudyQueueItem,
  StudySessionMode,
  type MissedWordStat,
} from '@/features/study/types/study.types';
import {
  buildFeedbackState,
  calculateNextProgressOnAnswer,
  calculateProgressPercent,
  createInitialStudyQueue,
  determineFlashcardQuality,
  filterPoolCards,
  getCurrentCardLearningStep,
  getCurrentCardMastery,
  getNextQueueAfterFeedback,
  processAdvanceFromFlashcard,
  processFlashcardReviewStep,
  recordMissedWordItem,
  saveStudyProgressToStorage,
  sortMissedWords,
  updateCardProgressMap,
  updateMasteredWordIds,
} from '@/features/study/utils/study-session.utils';
import { FlashcardRating, type CardWithProgress } from '@/services/study';
import { type VocabularyWord } from '@/services/vocabulary';
import { useQueue, useToggle } from '@lumen/hooks';
import { usePortalWithoutBackdrop } from '@lumen/uikit/portal';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useVocabularyWords } from '@/features/vocabulary/hooks';
import { useReviewFlashcard } from './use-study';
import { useStudyAudio } from './use-study-audio';
import type {
  UseStudySessionProps,
  UseStudySessionReturn,
} from './use-study-session.types';
import { useStudySettings } from './use-study-settings';
import { useStudyShortcuts } from './use-study-shortcuts';

export function useStudySession({
  cards,
  selectedTopic,
  isReviewMode = false,
  mode,
  isOpen,
  onClose,
}: UseStudySessionProps): UseStudySessionReturn {
  const [presentFeedback, dismissFeedback] =
    usePortalWithoutBackdrop<StudyFeedbackDrawerData>(StudyFeedbackDrawer, {
      key: 'study_feedback_drawer',
    });
  const handleContinueFeedbackRef = useRef<() => void>(() => {});
  const tFolders = useTranslations('Vocabulary.Folders');
  const { settings, currentQuotaConfig } = useStudySettings();
  const reviewMutation = useReviewFlashcard();

  const resolvedMode = useMemo(() => {
    if (mode) return mode;
    return isReviewMode
      ? StudySessionMode.PRACTICE
      : StudySessionMode.LEARN_NEW;
  }, [mode, isReviewMode]);

  const storageKey = useMemo(
    () =>
      `lumen_study_session_${selectedTopic ? encodeURIComponent(selectedTopic) : 'general'}`,
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

  const { data: globalWordsRes } = useVocabularyWords(
    { limit: 100 },
    { enabled: isOpen },
  );

  const globalCards = useMemo(
    () => (globalWordsRes as any)?.items || (globalWordsRes as any)?.data || [],
    [globalWordsRes],
  );

  const studyQueue = useQueue<StudyQueueItem>([]);
  const activeQueue = studyQueue.queue;
  const setActiveQueue = studyQueue.set;
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [isFlipped, toggleFlipped, setIsFlipped] = useToggle(false);
  const [feedback, setFeedback] = useState<StudyFeedbackState | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null,
  );
  const [missedWordsMap, setMissedWordsMap] = useState<
    Record<string, MissedWordStat>
  >({});
  const [wordProgressMap, setWordProgressMap] = useState<
    Record<string, { level: number; learningStep: number }>
  >({});
  const canFlipRef = useRef(true);

  const currentItem = studyQueue.first || null;
  const currentCard = currentItem?.card || null;
  const isFinished = poolCards.length > 0 && studyQueue.size === 0;
  const progressPercent = calculateProgressPercent(
    masteredIds.length,
    poolCards.length,
  );

  const initializeSession = useCallback(() => {
    setActiveQueue(
      createInitialStudyQueue(poolCards, resolvedMode, cards, globalCards),
    );
    setMasteredIds([]);
    setIsFlipped(false);
    setFeedback(null);
    setSelectedOptionIndex(null);
    setWordProgressMap({});
  }, [poolCards, resolvedMode, cards, globalCards]);

  useEffect(() => {
    if (isOpen && poolCards.length > 0) initializeSession();
  }, [poolCards, isOpen, initializeSession]);

  useEffect(() => {
    canFlipRef.current = false;
    const timer = setTimeout(() => {
      canFlipRef.current = true;
    }, 200);
    return () => clearTimeout(timer);
  }, [currentItem?.id]);

  const currentCardMastery = useMemo(
    () => getCurrentCardMastery(currentCard, wordProgressMap),
    [currentCard, wordProgressMap],
  );
  const currentCardLearningStep = useMemo(
    () => getCurrentCardLearningStep(currentCard, wordProgressMap),
    [currentCard, wordProgressMap],
  );

  const recordMissedWord = useCallback((card: VocabularyWord) => {
    setMissedWordsMap((prev) => recordMissedWordItem(prev, card));
  }, []);

  const transitionQueueWithDelay = useCallback(
    (nextQueue: StudyQueueItem[]) => {
      canFlipRef.current = false;
      setTimeout(() => {
        setIsFlipped(false);
        setActiveQueue(nextQueue);
        canFlipRef.current = true;
      }, 600);
    },
    [],
  );

  const handleFlip = useCallback(() => {
    if (canFlipRef.current) toggleFlipped();
  }, [toggleFlipped]);

  const mutateReviewQuietly = useCallback(
    (flashcardId: string, quality: FlashcardRating) => {
      try {
        reviewMutation.mutate({ flashcardId, quality });
      } catch {}
    },
    [reviewMutation],
  );

  const handleAdvanceFromFlashcard = useCallback(
    (rating: FlashcardRating) => {
      if (!currentCard || !canFlipRef.current) return;
      const cardId = currentCard.id;
      const { newLevel, newLearningStep, isMastered, nextQueue } =
        processAdvanceFromFlashcard(
          rating,
          currentCardMastery,
          currentCardLearningStep,
          currentCard,
          poolCards,
          activeQueue,
          cards,
          globalCards,
        );

      if (isMastered)
        setMasteredIds((prev) => updateMasteredWordIds(prev, cardId));
      setWordProgressMap((prev) =>
        updateCardProgressMap(prev, cardId, newLevel, newLearningStep),
      );
      mutateReviewQuietly(
        (currentCard as CardWithProgress).flashcardId || cardId,
        determineFlashcardQuality(rating),
      );
      transitionQueueWithDelay(nextQueue);
    },
    [
      currentCard,
      currentCardMastery,
      currentCardLearningStep,
      poolCards,
      activeQueue,
      cards,
      globalCards,
      mutateReviewQuietly,
      transitionQueueWithDelay,
    ],
  );

  const handleFlashcardReviewAction = useCallback(
    (isKnown: boolean) => {
      if (!currentCard || !canFlipRef.current) return;
      const cardId = currentCard.id;
      const { newLevel, newLearningStep, nextQueue, isMastered } =
        processFlashcardReviewStep(
          currentCard,
          isKnown,
          currentCardMastery,
          currentCardLearningStep,
          activeQueue,
        );

      setWordProgressMap((prev) =>
        updateCardProgressMap(prev, cardId, newLevel, newLearningStep),
      );
      if (isMastered)
        setMasteredIds((prev) => updateMasteredWordIds(prev, cardId));
      else recordMissedWord(currentCard);

      mutateReviewQuietly(
        (currentCard as CardWithProgress).flashcardId || cardId,
        isKnown ? FlashcardRating.CORRECT : FlashcardRating.WRONG,
      );
      transitionQueueWithDelay(nextQueue);
    },
    [
      currentCard,
      currentCardMastery,
      currentCardLearningStep,
      activeQueue,
      mutateReviewQuietly,
      recordMissedWord,
      transitionQueueWithDelay,
    ],
  );

  const handleVerifyAnswer = useCallback(
    (isCorrect: boolean, userAnswer?: string) => {
      if (!currentCard || !currentItem) return;
      const cardId = currentCard.id;
      const feedbackState = buildFeedbackState(
        currentCard,
        isCorrect,
        userAnswer,
      );
      setFeedback(feedbackState);
      presentFeedback({
        feedback: feedbackState,
        onContinue: () => handleContinueFeedbackRef.current(),
      });

      const currentProg =
        wordProgressMap[cardId] || (currentCard as CardWithProgress);
      const nextProg = calculateNextProgressOnAnswer(
        isCorrect,
        currentProg.level ?? 0,
        currentProg.learningStep ?? 0,
      );
      setWordProgressMap((prev) =>
        updateCardProgressMap(
          prev,
          cardId,
          nextProg.level,
          nextProg.learningStep,
        ),
      );

      if (isCorrect)
        setMasteredIds((prev) => updateMasteredWordIds(prev, cardId));
      else recordMissedWord(currentCard);

      mutateReviewQuietly(
        (currentCard as CardWithProgress).flashcardId || cardId,
        isCorrect ? FlashcardRating.CORRECT : FlashcardRating.WRONG,
      );
    },
    [
      currentCard,
      currentItem,
      wordProgressMap,
      mutateReviewQuietly,
      recordMissedWord,
      presentFeedback,
    ],
  );

  const handleSelectChoiceOption = useCallback(
    (optionIndex: number) => {
      const option = currentItem?.options?.[optionIndex];
      if (option) {
        setSelectedOptionIndex(optionIndex);
        handleVerifyAnswer(option.isCorrect, option.label);
      }
    },
    [currentItem, handleVerifyAnswer],
  );

  const handleSubmitTyping = useCallback(
    (input: string) => {
      if (currentCard) {
        const isCorrect =
          input.trim().toLowerCase() === currentCard.term.trim().toLowerCase();
        handleVerifyAnswer(isCorrect, input.trim());
      }
    },
    [currentCard, handleVerifyAnswer],
  );

  const handleContinueFeedback = useCallback(() => {
    dismissFeedback();
    if (feedback && currentCard && currentItem) {
      const nextQueue = getNextQueueAfterFeedback(
        activeQueue,
        currentCard,
        currentItem.exerciseType,
        poolCards,
        feedback.isCorrect,
        cards,
        globalCards,
      );
      setFeedback(null);
      setSelectedOptionIndex(null);
      setActiveQueue(nextQueue);
    }
  }, [
    feedback,
    currentCard,
    currentItem,
    activeQueue,
    poolCards,
    cards,
    globalCards,
    dismissFeedback,
  ]);

  handleContinueFeedbackRef.current = handleContinueFeedback;

  const handleRestart = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
    dismissFeedback();
    initializeSession();
    setMissedWordsMap({});
    setWordProgressMap({});
  }, [storageKey, initializeSession, dismissFeedback]);

  const handleSaveProgress = useCallback(() => {
    if (isOpen && poolCards.length > 0) {
      saveStudyProgressToStorage(
        storageKey,
        activeQueue,
        masteredIds,
        missedWordsMap,
      );
    }
  }, [
    isOpen,
    poolCards.length,
    activeQueue,
    masteredIds,
    missedWordsMap,
    storageKey,
  ]);

  const handleFlashcardAgain = useCallback(
    () => handleFlashcardReviewAction(false),
    [handleFlashcardReviewAction],
  );
  const handleFlashcardKnown = useCallback(
    () => handleFlashcardReviewAction(true),
    [handleFlashcardReviewAction],
  );
  const handleMastered = useCallback(
    () => handleAdvanceFromFlashcard(FlashcardRating.FAST_TRACK_KNOWN),
    [handleAdvanceFromFlashcard],
  );
  const handleReview = useCallback(
    () => handleAdvanceFromFlashcard(FlashcardRating.FAST_TRACK_TEMP),
    [handleAdvanceFromFlashcard],
  );
  const handleDontKnow = useCallback(() => {
    if (currentCard) {
      recordMissedWord(currentCard);
      handleAdvanceFromFlashcard(FlashcardRating.WRONG);
    }
  }, [currentCard, recordMissedWord, handleAdvanceFromFlashcard]);

  const audioState = useStudyAudio({
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
    mode: resolvedMode,
    onFlip: handleFlip,
    onMastered: handleMastered,
    onReview: handleReview,
    onDontKnow: handleDontKnow,
    onFlashcardAgain: handleFlashcardAgain,
    onFlashcardKnown: handleFlashcardKnown,
    onSelectChoice: handleSelectChoiceOption,
    onContinueFeedback: handleContinueFeedback,
    onPlayUsAudio: audioState.handlePlayUsAudio,
    onPlayUkAudio: audioState.handlePlayUkAudio,
    onReplayAudio: audioState.handlePlayAudio,
    onClose,
  });

  const missedWordsList = useMemo(
    () => sortMissedWords(missedWordsMap),
    [missedWordsMap],
  );

  return {
    mode: resolvedMode,
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
    activePhonetic: audioState.activePhonetic,
    currentCardMastery,
    currentCardLearningStep,
    canFlipRef,
    isSubmitting: reviewMutation.isPending,
    playingAccent: audioState.playingAccent,
    isPlaying: audioState.isPlaying,
    missedWordsList,
    settings,
    handleFlip,
    handleMastered,
    handleReview,
    handleDontKnow,
    handleFlashcardAgain,
    handleFlashcardKnown,
    handleSelectChoiceOption,
    handleSubmitTyping,
    handleContinueFeedback,
    handleRestart,
    handleSaveProgress,
    handlePlayUsAudio: audioState.handlePlayUsAudio,
    handlePlayUkAudio: audioState.handlePlayUkAudio,
    handlePlayAudio: audioState.handlePlayAudio,
    handleVerifyAnswer,
    dismissFeedback,
  };
}
