'use client';

import {
  useState,
  useCallback,
  useRef,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { usePortalWithoutBackdrop } from '@lumen/uikit/portal';
import {
  StudyFeedbackDrawer,
  type StudyFeedbackDrawerData,
} from '@/features/study/components/study-feedback-drawer';
import type {
  StudyFeedbackState,
  StudyQueueItem,
} from '@/features/study/types/study.types';
import {
  buildFeedbackState,
  calculateNextProgressOnAnswer,
  getNextQueueAfterFeedback,
  updateCardProgressMap,
  updateMasteredWordIds,
} from '@/features/study/utils/study-session.utils';
import { SoundEffectEnum } from '@/shared/types';
import { soundHelper } from '@/shared/utils';
import type { VocabularyWord } from '@/services/vocabulary';
import type { CardWithProgress } from '@/services/study';

export interface UseStudyAnswerValidationProps {
  currentCard: VocabularyWord | null;
  currentItem: StudyQueueItem | null;
  activeQueue: StudyQueueItem[];
  poolCards: VocabularyWord[];
  cards: VocabularyWord[];
  globalCards: VocabularyWord[];
  wordProgressMap: Record<string, { level: number; learningStep: number }>;
  soundEffectsEnabled?: boolean;
  setActiveQueue: (items: StudyQueueItem[]) => void;
  setWordProgressMap: Dispatch<
    SetStateAction<Record<string, { level: number; learningStep: number }>>
  >;
  setMasteredIds: Dispatch<SetStateAction<string[]>>;
  setEarnedPoints: Dispatch<SetStateAction<number>>;
  recordMissedWord: (card: VocabularyWord) => void;
  recordReviewPending: (
    flashcardId: string,
    data: { isCorrect: boolean },
  ) => void;
}

export function useStudyAnswerValidation({
  currentCard,
  currentItem,
  activeQueue,
  poolCards,
  cards,
  globalCards,
  wordProgressMap,
  soundEffectsEnabled = true,
  setActiveQueue,
  setWordProgressMap,
  setMasteredIds,
  setEarnedPoints,
  recordMissedWord,
  recordReviewPending,
}: UseStudyAnswerValidationProps) {
  const [presentFeedback, dismissFeedback] =
    usePortalWithoutBackdrop<StudyFeedbackDrawerData>(StudyFeedbackDrawer, {
      key: 'study_feedback_drawer',
    });
  const handleContinueFeedbackRef = useRef<() => void>(() => {});
  const [feedback, setFeedback] = useState<StudyFeedbackState | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(
    null,
  );

  const handleVerifyAnswer = useCallback(
    (isCorrect: boolean, userAnswer?: string) => {
      if (!currentCard || !currentItem) return;
      if (soundEffectsEnabled) {
        soundHelper.play(
          isCorrect
            ? SoundEffectEnum.STUDY_CORRECT
            : SoundEffectEnum.STUDY_INCORRECT,
        );
      }
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

      if (!isCorrect) recordMissedWord(currentCard);
      recordReviewPending(
        (currentCard as CardWithProgress).flashcardId || cardId,
        {
          isCorrect,
        },
      );
    },
    [
      currentCard,
      currentItem,
      wordProgressMap,
      recordReviewPending,
      recordMissedWord,
      presentFeedback,
      setWordProgressMap,
    ],
  );

  const handleSelectChoiceOption = useCallback(
    (optionIndex: number) => {
      if (feedback || selectedOptionIndex !== null) return;
      const option = currentItem?.options?.[optionIndex];
      if (option) {
        setSelectedOptionIndex(optionIndex);
        handleVerifyAnswer(option.isCorrect, option.label);
      }
    },
    [feedback, selectedOptionIndex, currentItem, handleVerifyAnswer],
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
      const res = getNextQueueAfterFeedback(
        activeQueue,
        currentCard,
        currentItem,
        poolCards,
        feedback.isCorrect,
        cards,
        globalCards,
      );
      setEarnedPoints((prev) => prev + res.earnedPointsDelta);
      if (res.isMastered) {
        setMasteredIds((prev) => updateMasteredWordIds(prev, currentCard.id));
      }
      setFeedback(null);
      setSelectedOptionIndex(null);
      setActiveQueue(res.nextQueue);
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
    setActiveQueue,
    setMasteredIds,
    setEarnedPoints,
  ]);

  handleContinueFeedbackRef.current = handleContinueFeedback;

  const resetAnswerState = useCallback(() => {
    dismissFeedback();
    setFeedback(null);
    setSelectedOptionIndex(null);
  }, [dismissFeedback]);

  return {
    feedback,
    selectedOptionIndex,
    handleVerifyAnswer,
    handleSelectChoiceOption,
    handleSubmitTyping,
    handleContinueFeedback,
    resetAnswerState,
    dismissFeedback,
  };
}
