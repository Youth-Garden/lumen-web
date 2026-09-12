'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  StudyExerciseType, StudyFeedbackState, StudyQueueItem, StudySessionMode,
  type MissedWordStat,
} from '@/features/study/types/study.types';
import {
  buildFeedbackState, calculateNextProgressOnAnswer, calculateProgressPercent,
  createInitialStudyQueue, determineFlashcardQuality, filterPoolCards,
  getCurrentCardLearningStep, getCurrentCardMastery, getNextQueueAfterFeedback,
  processAdvanceFromFlashcard, processFlashcardReviewStep,
  saveStudyProgressToStorage, sortMissedWords,
} from '@/features/study/utils/study-session.utils';
import { useReviewFlashcard } from './use-study';
import { useStudyAudio } from './use-study-audio';
import { useStudySettings } from './use-study-settings';
import { useStudyShortcuts } from './use-study-shortcuts';
import type { UseStudySessionProps, UseStudySessionReturn } from './use-study-session.types';
import { FlashcardRating, type CardWithProgress } from '@/services/study';
import { type VocabularyWord } from '@/services/vocabulary';

export function useStudySession({
  cards, selectedTopic, isReviewMode = false, mode, isOpen, onClose,
}: UseStudySessionProps): UseStudySessionReturn {
  const tFolders = useTranslations('Vocabulary.Folders');
  const { settings, currentQuotaConfig } = useStudySettings();
  const reviewMutation = useReviewFlashcard();

  const resolvedMode = useMemo(() => {
    if (mode) return mode;
    if (isReviewMode) return StudySessionMode.PRACTICE;
    return StudySessionMode.LEARN_NEW;
  }, [mode, isReviewMode]);

  const storageKey = useMemo(
    () => `lumen_study_session_${selectedTopic ? encodeURIComponent(selectedTopic) : 'general'}`,
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
    [cards, selectedTopic, settings.wordsPerSession, currentQuotaConfig.targetCount, tFolders],
  );

  const [activeQueue, setActiveQueue] = useState<StudyQueueItem[]>([]);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [feedback, setFeedback] = useState<StudyFeedbackState | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [missedWordsMap, setMissedWordsMap] = useState<Record<string, MissedWordStat>>({});
  const [wordProgressMap, setWordProgressMap] = useState<
    Record<string, { level: number; learningStep: number }>
  >({});
  const canFlipRef = useRef(true);

  const currentItem = activeQueue[0] || null;
  const currentCard = currentItem?.card || null;
  const isFinished = poolCards.length > 0 && activeQueue.length === 0;
  const progressPercent = calculateProgressPercent(masteredIds.length, poolCards.length);

  const initializeSession = useCallback(() => {
    setActiveQueue(createInitialStudyQueue(poolCards, resolvedMode));
    setMasteredIds([]);
    setIsFlipped(false);
    setFeedback(null);
    setSelectedOptionIndex(null);
    setWordProgressMap({});
  }, [poolCards, resolvedMode]);

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

  const currentCardMastery = useMemo(
    () => getCurrentCardMastery(currentCard, wordProgressMap),
    [currentCard, wordProgressMap],
  );

  const currentCardLearningStep = useMemo(
    () => getCurrentCardLearningStep(currentCard, wordProgressMap),
    [currentCard, wordProgressMap],
  );

  const recordMissedWord = useCallback((card: VocabularyWord) => {
    const key = card.term.trim().toLowerCase() || card.id;
    setMissedWordsMap((prev) => ({
      ...prev,
      [key]: { card, errorCount: (prev[key]?.errorCount || 0) + 1 },
    }));
  }, []);

  const handleFlip = useCallback(() => {
    if (!canFlipRef.current) return;
    setIsFlipped((prev) => !prev);
  }, []);

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
        );

      if (isMastered) setMasteredIds((prev) => (prev.includes(cardId) ? prev : [...prev, cardId]));
      setWordProgressMap((prev) => ({ ...prev, [cardId]: { level: newLevel, learningStep: newLearningStep } }));

      try {
        reviewMutation.mutate({
          flashcardId: (currentCard as CardWithProgress).flashcardId || cardId,
          quality: determineFlashcardQuality(rating),
        });
      } catch {}

      canFlipRef.current = false;
      setTimeout(() => {
        setIsFlipped(false);
        setActiveQueue(nextQueue);
        canFlipRef.current = true;
      }, 600);
    },
    [currentCard, currentCardMastery, currentCardLearningStep, poolCards, activeQueue, reviewMutation],
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

      setWordProgressMap((prev) => ({
        ...prev,
        [cardId]: { level: newLevel, learningStep: newLearningStep },
      }));

      try {
        reviewMutation.mutate({
          flashcardId: (currentCard as CardWithProgress).flashcardId || cardId,
          quality: isKnown ? FlashcardRating.CORRECT : FlashcardRating.WRONG,
        });
      } catch {}

      if (isMastered) {
        setMasteredIds((prev) =>
          prev.includes(cardId) ? prev : [...prev, cardId],
        );
      } else {
        recordMissedWord(currentCard);
      }

      canFlipRef.current = false;
      setTimeout(() => {
        setIsFlipped(false);
        setActiveQueue(nextQueue);
        canFlipRef.current = true;
      }, 600);
    },
    [
      currentCard,
      currentCardMastery,
      currentCardLearningStep,
      activeQueue,
      reviewMutation,
      recordMissedWord,
    ],
  );

  const handleFlashcardAgain = useCallback(() => handleFlashcardReviewAction(false), [handleFlashcardReviewAction]);
  const handleFlashcardKnown = useCallback(() => handleFlashcardReviewAction(true), [handleFlashcardReviewAction]);
  const handleMastered = useCallback(() => handleAdvanceFromFlashcard(FlashcardRating.FAST_TRACK_KNOWN), [handleAdvanceFromFlashcard]);
  const handleReview = useCallback(() => handleAdvanceFromFlashcard(FlashcardRating.FAST_TRACK_TEMP), [handleAdvanceFromFlashcard]);
  const handleDontKnow = useCallback(() => {
    if (!currentCard) return;
    recordMissedWord(currentCard);
    handleAdvanceFromFlashcard(FlashcardRating.WRONG);
  }, [currentCard, recordMissedWord, handleAdvanceFromFlashcard]);

  const handleVerifyAnswer = useCallback(
    (isCorrect: boolean, userAnswer?: string) => {
      if (!currentCard || !currentItem) return;
      setFeedback(buildFeedbackState(currentCard, isCorrect, userAnswer));

      const cardId = currentCard.id;
      const currentProg = wordProgressMap[cardId] || (currentCard as CardWithProgress);
      const nextProg = calculateNextProgressOnAnswer(
        isCorrect,
        currentProg.level ?? 0,
        currentProg.learningStep ?? 0,
      );

      setWordProgressMap((prev) => ({ ...prev, [cardId]: nextProg }));
      try {
        reviewMutation.mutate({
          flashcardId: (currentCard as CardWithProgress).flashcardId || currentCard.id,
          quality: isCorrect ? FlashcardRating.CORRECT : FlashcardRating.WRONG,
        });
      } catch {}

      if (isCorrect) setMasteredIds((prev) => (prev.includes(cardId) ? prev : [...prev, cardId]));
      else recordMissedWord(currentCard);
    },
    [currentCard, currentItem, wordProgressMap, reviewMutation, recordMissedWord],
  );

  const handleSelectChoiceOption = useCallback(
    (optionIndex: number) => {
      const option = currentItem?.options?.[optionIndex];
      if (!option) return;
      setSelectedOptionIndex(optionIndex);
      handleVerifyAnswer(option.isCorrect, option.label);
    },
    [currentItem, handleVerifyAnswer],
  );

  const handleSubmitTyping = useCallback(
    (input: string) => {
      if (!currentCard) return;
      const isCorrect = input.trim().toLowerCase() === currentCard.term.trim().toLowerCase();
      handleVerifyAnswer(isCorrect, input.trim());
    },
    [currentCard, handleVerifyAnswer],
  );

  const handleContinueFeedback = useCallback(() => {
    if (!feedback || !currentCard || !currentItem) return;
    const nextQueue = getNextQueueAfterFeedback(
      activeQueue,
      currentCard,
      currentItem.exerciseType,
      poolCards,
      feedback.isCorrect,
    );
    setFeedback(null);
    setSelectedOptionIndex(null);
    setActiveQueue(nextQueue);
  }, [feedback, currentCard, currentItem, activeQueue, poolCards]);

  const handleRestart = useCallback(() => {
    try { localStorage.removeItem(storageKey); } catch {}
    initializeSession();
    setMissedWordsMap({});
    setWordProgressMap({});
  }, [storageKey, initializeSession]);

  const handleSaveProgress = useCallback(() => {
    if (!isOpen || poolCards.length === 0) return;
    saveStudyProgressToStorage(storageKey, activeQueue, masteredIds, missedWordsMap);
  }, [isOpen, poolCards.length, activeQueue, masteredIds, missedWordsMap, storageKey]);

  const {
    activePhonetic, isPlaying, playingAccent,
    handlePlayUsAudio, handlePlayUkAudio, handlePlayAudio,
  } = useStudyAudio({
    currentCard, exerciseType: currentItem?.exerciseType,
    autoPlayAudio: settings.autoPlayAudio, accent: settings.accent,
    isOpen, isFinished,
  });

  useStudyShortcuts({
    isOpen, isFinished, isFlipped, canFlipRef,
    isFeedbackOpen: Boolean(feedback?.isOpen),
    exerciseType: currentItem?.exerciseType || StudyExerciseType.FLASHCARD,
    mode: resolvedMode,
    onFlip: handleFlip, onMastered: handleMastered, onReview: handleReview,
    onDontKnow: handleDontKnow,
    onFlashcardAgain: handleFlashcardAgain, onFlashcardKnown: handleFlashcardKnown,
    onSelectChoice: handleSelectChoiceOption,
    onContinueFeedback: handleContinueFeedback,
    onPlayUsAudio: handlePlayUsAudio, onPlayUkAudio: handlePlayUkAudio, onClose,
  });

  return {
    mode: resolvedMode,
    activeQueue, poolCards, masteredIds, currentItem, currentCard,
    quotaRangeText: currentQuotaConfig.rangeText,
    isFlipped, isFinished, feedback, selectedOptionIndex, progressPercent,
    activePhonetic, currentCardMastery, currentCardLearningStep, canFlipRef,
    isSubmitting: reviewMutation.isPending, playingAccent, isPlaying,
    missedWordsList: useMemo(() => sortMissedWords(missedWordsMap), [missedWordsMap]),
    settings,
    handleFlip, handleMastered, handleReview, handleDontKnow,
    handleFlashcardAgain, handleFlashcardKnown,
    handleSelectChoiceOption, handleSubmitTyping, handleContinueFeedback,
    handleRestart, handleSaveProgress,
    handlePlayUsAudio, handlePlayUkAudio, handlePlayAudio, handleVerifyAnswer,
  };
}
