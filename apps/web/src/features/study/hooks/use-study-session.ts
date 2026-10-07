'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useQueue, useToggle } from '@lumen/hooks';
import {
  StudyExerciseType,
  StudyQueueItem,
  type MissedWordStat,
} from '@/features/study/types/study.types';
import {
  calculateCumulativeProgressPercent,
  calculateTargetSessionPoints,
  clearStudyProgressFromStorage,
  createInitialStudyQueue,
  getCurrentCardLearningStep,
  getCurrentCardMastery,
  recordMissedWordItem,
  saveStudyProgressToStorage,
  sortMissedWords,
} from '@/features/study/utils/study-session.utils';
import { type VocabularyWord } from '@/services/vocabulary';
import { useVocabularyWords } from '@/features/vocabulary/hooks';
import { useStudyAnswerValidation } from './use-study-answer-validation';
import { useStudyAudio } from './use-study-audio';
import { useStudyFlashcardActions } from './use-study-flashcard-actions';
import { useStudyPool } from './use-study-pool';
import { useStudyReviews } from './use-study-reviews';
import type {
  UseStudySessionProps,
  UseStudySessionReturn,
} from './use-study-session.types';
import { useStudySessionQuota } from './use-study-session-quota';
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
  const { settings } = useStudySettings();
  const sessionQuota = useStudySessionQuota(isOpen);
  const { resolvedMode, storageKey, poolCards } = useStudyPool({
    cards,
    selectedTopic,
    mode,
    isReviewMode,
    sessionQuota,
  });

  const { data: globalWordsRes } = useVocabularyWords(
    { limit: 100 },
    { enabled: isOpen },
  );
  const globalCards = useMemo(
    () => globalWordsRes?.items || [],
    [globalWordsRes],
  );

  const studyQueue = useQueue<StudyQueueItem>([]);
  const activeQueue = studyQueue.queue;
  const setActiveQueue = studyQueue.set;
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [isFlipped, toggleFlipped, setIsFlipped] = useToggle(false);
  const [missedWordsMap, setMissedWordsMap] = useState<
    Record<string, MissedWordStat>
  >({});
  const [wordProgressMap, setWordProgressMap] = useState<
    Record<string, { level: number; learningStep: number }>
  >({});
  const [earnedPoints, setEarnedPoints] = useState(0);
  const canFlipRef = useRef(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const isInitializedRef = useRef(false);

  const currentItem = studyQueue.first || null;
  const currentCard = currentItem?.card || null;
  const isFinished =
    isInitialized && poolCards.length > 0 && studyQueue.size === 0;

  const {
    recordReviewPending,
    flushPendingReviews,
    clearPendingReviews,
    isSubmitting,
  } = useStudyReviews(isFinished);

  const targetPoints = useMemo(
    () => calculateTargetSessionPoints(poolCards, resolvedMode),
    [poolCards, resolvedMode],
  );
  const progressPercent = useMemo(
    () =>
      isInitialized
        ? calculateCumulativeProgressPercent(
            earnedPoints,
            targetPoints,
            isFinished,
          )
        : 0,
    [isInitialized, earnedPoints, targetPoints, isFinished],
  );

  const initializeSession = useCallback(() => {
    setActiveQueue(
      createInitialStudyQueue(poolCards, resolvedMode, cards, globalCards),
    );
    setMasteredIds([]);
    setIsFlipped(false);
    setWordProgressMap({});
    setEarnedPoints(0);
    setIsInitialized(true);
  }, [poolCards, resolvedMode, cards, globalCards]);

  useEffect(() => {
    if (isOpen && poolCards.length > 0 && !isInitializedRef.current) {
      isInitializedRef.current = true;
      initializeSession();
    }
    if (!isOpen) {
      isInitializedRef.current = false;
      setIsInitialized(false);
    }
  }, [isOpen, poolCards, initializeSession]);

  useEffect(() => {
    if (!currentItem?.id) return;
    canFlipRef.current = false;
    const timer = setTimeout(() => {
      canFlipRef.current = true;
    }, 200);
    return () => clearTimeout(timer);
  }, [currentItem?.id]);

  const currentCardMastery = getCurrentCardMastery(
    currentCard,
    wordProgressMap,
  );
  const currentCardLearningStep = getCurrentCardLearningStep(
    currentCard,
    wordProgressMap,
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
      }, 400);
    },
    [setActiveQueue, setIsFlipped],
  );

  const handleFlip = useCallback(() => {
    if (canFlipRef.current) toggleFlipped();
  }, [toggleFlipped]);

  const flashcardActions = useStudyFlashcardActions({
    currentCard,
    canFlipRef,
    currentCardMastery,
    currentCardLearningStep,
    poolCards,
    activeQueue,
    cards,
    globalCards,
    recordReviewPending,
    transitionQueueWithDelay,
    setMasteredIds,
    setWordProgressMap,
    setEarnedPoints,
    recordMissedWord,
  });

  const answerValidation = useStudyAnswerValidation({
    currentCard,
    currentItem,
    activeQueue,
    poolCards,
    cards,
    globalCards,
    wordProgressMap,
    soundEffectsEnabled: settings.soundEffectsEnabled,
    setActiveQueue,
    setWordProgressMap,
    setMasteredIds,
    setEarnedPoints,
    recordMissedWord,
    recordReviewPending,
  });

  const handleRestart = useCallback(() => {
    clearStudyProgressFromStorage(storageKey);
    clearPendingReviews();
    answerValidation.resetAnswerState();
    initializeSession();
    setMissedWordsMap({});
    setWordProgressMap({});
    setEarnedPoints(0);
  }, [
    storageKey,
    clearPendingReviews,
    answerValidation.resetAnswerState,
    initializeSession,
  ]);

  const handleSaveProgress = useCallback(() => {
    flushPendingReviews();
    if (isOpen && poolCards.length > 0) {
      saveStudyProgressToStorage(
        storageKey,
        activeQueue,
        masteredIds,
        missedWordsMap,
        earnedPoints,
      );
    }
  }, [
    flushPendingReviews,
    isOpen,
    poolCards.length,
    activeQueue,
    masteredIds,
    missedWordsMap,
    earnedPoints,
    storageKey,
  ]);

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
    isFeedbackOpen: Boolean(answerValidation.feedback?.isOpen),
    exerciseType: currentItem?.exerciseType || StudyExerciseType.FLASHCARD,
    mode: resolvedMode,
    onFlip: handleFlip,
    flashcardActions,
    answerValidation,
    audioState,
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
    isFlipped,
    isFinished,
    feedback: answerValidation.feedback,
    selectedOptionIndex: answerValidation.selectedOptionIndex,
    progressPercent,
    activePhonetic: audioState.activePhonetic,
    currentCardMastery,
    currentCardLearningStep,
    canFlipRef,
    isSubmitting,
    playingAccent: audioState.playingAccent,
    isPlaying: audioState.isPlaying,
    missedWordsList,
    settings,
    handleFlip,
    handleMastered: flashcardActions.handleMastered,
    handleReview: flashcardActions.handleReview,
    handleDontKnow: flashcardActions.handleDontKnow,
    handleFlashcardAgain: flashcardActions.handleFlashcardAgain,
    handleFlashcardKnown: flashcardActions.handleFlashcardKnown,
    handleSelectChoiceOption: answerValidation.handleSelectChoiceOption,
    handleSubmitTyping: answerValidation.handleSubmitTyping,
    handleContinueFeedback: answerValidation.handleContinueFeedback,
    handleRestart,
    handleSaveProgress,
    handlePlayUsAudio: audioState.handlePlayUsAudio,
    handlePlayUkAudio: audioState.handlePlayUkAudio,
    handlePlayAudio: audioState.handlePlayAudio,
    handleVerifyAnswer: answerValidation.handleVerifyAnswer,
    dismissFeedback: answerValidation.dismissFeedback,
  };
}
