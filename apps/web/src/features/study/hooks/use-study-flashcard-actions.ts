'use client';

import { useCallback, type RefObject, type Dispatch, type SetStateAction } from 'react';
import { FlashcardRating, type CardWithProgress } from '@/services/study';
import type { VocabularyWord } from '@/services/vocabulary';
import type { StudyQueueItem } from '@/features/study/types/study.types';
import {
  processAdvanceFromFlashcard,
  processFlashcardReviewStep,
  updateCardProgressMap,
  updateMasteredWordIds,
} from '@/features/study/utils/study-session.utils';

export interface UseStudyFlashcardActionsProps {
  currentCard: VocabularyWord | null;
  canFlipRef: RefObject<boolean>;
  currentCardMastery: number;
  currentCardLearningStep: number;
  poolCards: VocabularyWord[];
  activeQueue: StudyQueueItem[];
  cards: VocabularyWord[];
  globalCards: VocabularyWord[];
  recordReviewPending: (
    flashcardId: string,
    data: {
      isCorrect: boolean;
      isFastTrackKnown?: boolean;
      isFastTrackTempMemory?: boolean;
    },
  ) => void;
  transitionQueueWithDelay: (nextQueue: StudyQueueItem[]) => void;
  setMasteredIds: Dispatch<SetStateAction<string[]>>;
  setWordProgressMap: Dispatch<
    SetStateAction<Record<string, { level: number; learningStep: number }>>
  >;
  setEarnedPoints: Dispatch<SetStateAction<number>>;
  recordMissedWord: (card: VocabularyWord) => void;
}

export function useStudyFlashcardActions({
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
}: UseStudyFlashcardActionsProps) {
  const handleAdvanceFromFlashcard = useCallback(
    (rating: FlashcardRating) => {
      if (!currentCard || !canFlipRef.current) return;
      const cardId = currentCard.id;
      const res = processAdvanceFromFlashcard(
        rating,
        currentCardMastery,
        currentCardLearningStep,
        currentCard,
        poolCards,
        activeQueue,
        cards,
        globalCards,
      );

      if (res.isMastered) {
        setMasteredIds((prev) => updateMasteredWordIds(prev, cardId));
      }
      setWordProgressMap((prev) =>
        updateCardProgressMap(prev, cardId, res.newLevel, res.newLearningStep),
      );
      setEarnedPoints((prev) => prev + res.earnedPointsDelta);
      recordReviewPending(
        (currentCard as CardWithProgress).flashcardId || cardId,
        {
          isCorrect: rating !== FlashcardRating.WRONG,
          isFastTrackKnown: rating === FlashcardRating.FAST_TRACK_KNOWN,
          isFastTrackTempMemory: rating === FlashcardRating.FAST_TRACK_TEMP,
        },
      );
      transitionQueueWithDelay(res.nextQueue);
    },
    [
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
    ],
  );

  const handleFlashcardReviewAction = useCallback(
    (isKnown: boolean) => {
      if (!currentCard || !canFlipRef.current) return;
      const cardId = currentCard.id;
      const res = processFlashcardReviewStep(
        currentCard,
        isKnown,
        currentCardMastery,
        currentCardLearningStep,
        activeQueue,
      );

      setWordProgressMap((prev) =>
        updateCardProgressMap(prev, cardId, res.newLevel, res.newLearningStep),
      );
      setEarnedPoints((prev) => prev + res.earnedPointsDelta);
      if (res.isMastered) {
        setMasteredIds((prev) => updateMasteredWordIds(prev, cardId));
      } else {
        recordMissedWord(currentCard);
      }

      recordReviewPending(
        (currentCard as CardWithProgress).flashcardId || cardId,
        {
          isCorrect: isKnown,
        },
      );
      transitionQueueWithDelay(res.nextQueue);
    },
    [
      currentCard,
      canFlipRef,
      currentCardMastery,
      currentCardLearningStep,
      activeQueue,
      recordReviewPending,
      recordMissedWord,
      transitionQueueWithDelay,
      setMasteredIds,
      setWordProgressMap,
      setEarnedPoints,
    ],
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

  const handleFlashcardAgain = useCallback(
    () => handleFlashcardReviewAction(false),
    [handleFlashcardReviewAction],
  );
  const handleFlashcardKnown = useCallback(
    () => handleFlashcardReviewAction(true),
    [handleFlashcardReviewAction],
  );

  return {
    handleAdvanceFromFlashcard,
    handleFlashcardReviewAction,
    handleMastered,
    handleReview,
    handleDontKnow,
    handleFlashcardAgain,
    handleFlashcardKnown,
  };
}
