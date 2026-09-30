'use client';

import { type RefObject } from 'react';
import {
  StudyExerciseType,
  StudySessionMode,
} from '@/features/study/types/study.types';
import { useKeyPress } from '@lumen/hooks';
import { usePortalStore } from '@lumen/uikit/portal';
import {
  ChoiceShortcutKey,
  FlashcardReviewShortcutKey,
  FlashcardShortcutKey,
  StudyGlobalShortcutKey,
} from '../constants';

export interface UseStudyShortcutsProps {
  isOpen: boolean;
  isFinished: boolean;
  isFlipped: boolean;
  isFeedbackOpen: boolean;
  exerciseType: StudyExerciseType;
  mode?: StudySessionMode;
  canFlipRef: RefObject<boolean | null>;
  onFlip: () => void;
  flashcardActions?: {
    handleMastered: () => void;
    handleReview: () => void;
    handleDontKnow: () => void;
    handleFlashcardAgain?: () => void;
    handleFlashcardKnown?: () => void;
  };
  answerValidation?: {
    handleSelectChoiceOption?: (index: number) => void;
    handleContinueFeedback?: () => void;
  };
  audioState?: {
    handlePlayUsAudio: () => void;
    handlePlayUkAudio: () => void;
    handlePlayAudio: () => void;
  };
  onMastered?: () => void;
  onReview?: () => void;
  onDontKnow?: () => void;
  onFlashcardAgain?: () => void;
  onFlashcardKnown?: () => void;
  onSelectChoice?: (index: number) => void;
  onContinueFeedback?: () => void;
  onPlayUsAudio?: () => void;
  onPlayUkAudio?: () => void;
  onReplayAudio?: () => void;
  onClose: () => void;
}

export function useStudyShortcuts(props: UseStudyShortcutsProps) {
  const {
    isOpen,
    isFinished,
    isFlipped,
    isFeedbackOpen,
    exerciseType,
    mode,
    canFlipRef,
    onFlip,
    flashcardActions,
    answerValidation,
    audioState,
    onClose,
  } = props;

  const onMastered =
    flashcardActions?.handleMastered ?? props.onMastered ?? (() => {});
  const onReview =
    flashcardActions?.handleReview ?? props.onReview ?? (() => {});
  const onDontKnow =
    flashcardActions?.handleDontKnow ?? props.onDontKnow ?? (() => {});
  const onFlashcardAgain =
    flashcardActions?.handleFlashcardAgain ?? props.onFlashcardAgain;
  const onFlashcardKnown =
    flashcardActions?.handleFlashcardKnown ?? props.onFlashcardKnown;
  const onSelectChoice =
    answerValidation?.handleSelectChoiceOption ?? props.onSelectChoice;
  const onContinueFeedback =
    answerValidation?.handleContinueFeedback ?? props.onContinueFeedback;
  const onPlayUsAudio =
    audioState?.handlePlayUsAudio ?? props.onPlayUsAudio ?? (() => {});
  const onPlayUkAudio =
    audioState?.handlePlayUkAudio ?? props.onPlayUkAudio ?? (() => {});
  const onReplayAudio =
    audioState?.handlePlayAudio ?? props.onReplayAudio ?? (() => {});
  useKeyPress(
    () => true,
    (event: KeyboardEvent) => {
      const isAudioPermitted =
        isFeedbackOpen ||
        exerciseType === StudyExerciseType.FLASHCARD ||
        exerciseType === StudyExerciseType.CHOICE_MEANING;

      if (
        isAudioPermitted &&
        event.key === StudyGlobalShortcutKey.REPLAY_AUDIO &&
        !event.repeat
      ) {
        event.preventDefault();
        onReplayAudio();
        return;
      }

      if (isFeedbackOpen) {
        if (
          event.code === FlashcardShortcutKey.SPACE ||
          event.key === FlashcardShortcutKey.ENTER
        ) {
          event.preventDefault();
          onContinueFeedback?.();
          return;
        }
        if (event.key.toLowerCase() === StudyGlobalShortcutKey.AUDIO_US) {
          event.preventDefault();
          onPlayUsAudio();
          return;
        }
        if (event.key.toLowerCase() === StudyGlobalShortcutKey.AUDIO_UK) {
          event.preventDefault();
          onPlayUkAudio();
          return;
        }
        return;
      }

      // Check Portal Store directly: If any sub-dialog/modal is open on top of StudyView, yield control
      const openPortals = usePortalStore
        .getState()
        .portals.filter((p) => p.isOpen);
      if (openPortals.length > 1) {
        return;
      }

      if (event.key === StudyGlobalShortcutKey.CLOSE) {
        event.preventDefault();
        onClose();
        return;
      }

      if (
        isAudioPermitted &&
        event.key.toLowerCase() === StudyGlobalShortcutKey.AUDIO_US
      ) {
        event.preventDefault();
        onPlayUsAudio();
        return;
      }
      if (
        isAudioPermitted &&
        event.key.toLowerCase() === StudyGlobalShortcutKey.AUDIO_UK
      ) {
        event.preventDefault();
        onPlayUkAudio();
        return;
      }

      if (exerciseType === StudyExerciseType.FLASHCARD) {
        if (!isFlipped) {
          if (
            event.code === FlashcardShortcutKey.SPACE ||
            event.key === FlashcardShortcutKey.ENTER
          ) {
            if (!canFlipRef.current || event.repeat) return;
            event.preventDefault();
            onFlip();
          }
        } else {
          if (event.code === FlashcardShortcutKey.SPACE) {
            event.preventDefault();
            onFlip();
          } else if (mode === StudySessionMode.FLASHCARD) {
            if (event.key === FlashcardReviewShortcutKey.AGAIN) {
              event.preventDefault();
              onFlashcardAgain?.();
            } else if (event.key === FlashcardReviewShortcutKey.KNOWN) {
              event.preventDefault();
              onFlashcardKnown?.();
            }
          } else {
            if (event.key === FlashcardShortcutKey.MASTERED) {
              event.preventDefault();
              onMastered();
            } else if (event.key === FlashcardShortcutKey.REVIEW) {
              event.preventDefault();
              onReview();
            } else if (event.key === FlashcardShortcutKey.ENTER) {
              event.preventDefault();
              onDontKnow();
            }
          }
        }
      } else if (
        exerciseType === StudyExerciseType.CHOICE_TERM ||
        exerciseType === StudyExerciseType.CHOICE_MEANING
      ) {
        if (event.key === ChoiceShortcutKey.CHOICE_1) {
          event.preventDefault();
          onSelectChoice?.(0);
        } else if (event.key === ChoiceShortcutKey.CHOICE_2) {
          event.preventDefault();
          onSelectChoice?.(1);
        } else if (event.key === ChoiceShortcutKey.CHOICE_3) {
          event.preventDefault();
          onSelectChoice?.(2);
        } else if (event.key === ChoiceShortcutKey.CHOICE_4) {
          event.preventDefault();
          onSelectChoice?.(3);
        }
      }
    },
    {
      disabled: !isOpen || isFinished,
      ignoreInputElements: true,
    },
  );
}
