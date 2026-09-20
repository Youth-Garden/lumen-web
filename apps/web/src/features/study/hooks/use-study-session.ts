'use client';

import {
  StudyExerciseType,
  StudyQueueItem,
  StudySessionMode,
  type MissedWordStat,
} from '@/features/study/types/study.types';
import {
  calculateCumulativeProgressPercent,
  calculateTargetSessionPoints,
  createInitialStudyQueue,
  filterPoolCards,
  getCurrentCardLearningStep,
  getCurrentCardMastery,
  recordMissedWordItem,
  saveStudyProgressToStorage,
  sortMissedWords,
} from '@/features/study/utils/study-session.utils';
import { type VocabularyWord } from '@/services/vocabulary';
import { useQueue, useToggle } from '@lumen/hooks';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useVocabularyWords } from '@/features/vocabulary/hooks';
import { useStudyAnswerValidation } from './use-study-answer-validation';
import { useStudyAudio } from './use-study-audio';
import { useStudyFlashcardActions } from './use-study-flashcard-actions';
import { useStudyReviews } from './use-study-reviews';
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
  const tFolders = useTranslations('Vocabulary.Folders');
  const { settings, currentQuotaConfig } = useStudySettings();

  const resolvedMode = useMemo(() => {
    if (mode) return mode;
    return isReviewMode ? StudySessionMode.PRACTICE : StudySessionMode.LEARN_NEW;
  }, [mode, isReviewMode]);

  const storageKey = useMemo(
    () => `lumen_study_session_${selectedTopic ? encodeURIComponent(selectedTopic) : 'general'}`,
    [selectedTopic],
  );

  const poolCards = useMemo(
    () => filterPoolCards(cards, selectedTopic, settings.wordsPerSession || currentQuotaConfig.targetCount || 20, tFolders('generalTopic')),
    [cards, selectedTopic, settings.wordsPerSession, currentQuotaConfig.targetCount, tFolders],
  );

  const { data: globalWordsRes } = useVocabularyWords({ limit: 100 }, { enabled: isOpen });
  const globalCards = useMemo(() => globalWordsRes?.items || [], [globalWordsRes]);

  const studyQueue = useQueue<StudyQueueItem>([]);
  const activeQueue = studyQueue.queue;
  const setActiveQueue = studyQueue.set;
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [isFlipped, toggleFlipped, setIsFlipped] = useToggle(false);
  const [missedWordsMap, setMissedWordsMap] = useState<Record<string, MissedWordStat>>({});
  const [wordProgressMap, setWordProgressMap] = useState<Record<string, { level: number; learningStep: number }>>({});
  const [earnedPoints, setEarnedPoints] = useState(0);
  const canFlipRef = useRef(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const currentItem = studyQueue.first || null;
  const currentCard = currentItem?.card || null;
  const isFinished = isInitialized && poolCards.length > 0 && studyQueue.size === 0;

  const { recordReviewPending, flushPendingReviews, clearPendingReviews, isSubmitting } =
    useStudyReviews(isFinished);

  const targetPoints = useMemo(
    () => calculateTargetSessionPoints(poolCards, resolvedMode),
    [poolCards, resolvedMode],
  );
  const progressPercent = useMemo(
    () => (isInitialized ? calculateCumulativeProgressPercent(earnedPoints, targetPoints, isFinished) : 0),
    [isInitialized, earnedPoints, targetPoints, isFinished],
  );

  const isInitializedRef = useRef(false);

  const initializeSession = useCallback(() => {
    setActiveQueue(createInitialStudyQueue(poolCards, resolvedMode, cards, globalCards));
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
    setActiveQueue,
    setWordProgressMap,
    setMasteredIds,
    setEarnedPoints,
    recordMissedWord,
    recordReviewPending,
  });

  const handleRestart = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
    clearPendingReviews();
    answerValidation.resetAnswerState();
    initializeSession();
    setMissedWordsMap({});
    setWordProgressMap({});
    setEarnedPoints(0);
  }, [storageKey, clearPendingReviews, answerValidation.resetAnswerState, initializeSession]);

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
  }, [flushPendingReviews, isOpen, poolCards.length, activeQueue, masteredIds, missedWordsMap, earnedPoints, storageKey]);

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
    onMastered: flashcardActions.handleMastered,
    onReview: flashcardActions.handleReview,
    onDontKnow: flashcardActions.handleDontKnow,
    onFlashcardAgain: flashcardActions.handleFlashcardAgain,
    onFlashcardKnown: flashcardActions.handleFlashcardKnown,
    onSelectChoice: answerValidation.handleSelectChoiceOption,
    onContinueFeedback: answerValidation.handleContinueFeedback,
    onPlayUsAudio: audioState.handlePlayUsAudio,
    onPlayUkAudio: audioState.handlePlayUkAudio,
    onReplayAudio: audioState.handlePlayAudio,
    onClose,
  });

  const missedWordsList = useMemo(() => sortMissedWords(missedWordsMap), [missedWordsMap]);

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


