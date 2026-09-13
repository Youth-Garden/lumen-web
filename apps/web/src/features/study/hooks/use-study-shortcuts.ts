'use client';

import { useEffect, type RefObject } from 'react';
import { StudyExerciseType, StudySessionMode } from '@/features/study/types/study.types';
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
  onMastered: () => void;
  onReview: () => void;
  onDontKnow: () => void;
  onFlashcardAgain?: () => void;
  onFlashcardKnown?: () => void;
  onSelectChoice?: (index: number) => void;
  onContinueFeedback?: () => void;
  onPlayUsAudio: () => void;
  onPlayUkAudio: () => void;
  onReplayAudio: () => void;
  onClose: () => void;
}

export function useStudyShortcuts({
  isOpen,
  isFinished,
  isFlipped,
  isFeedbackOpen,
  exerciseType,
  mode,
  canFlipRef,
  onFlip,
  onMastered,
  onReview,
  onDontKnow,
  onFlashcardAgain,
  onFlashcardKnown,
  onSelectChoice,
  onContinueFeedback,
  onPlayUsAudio,
  onPlayUkAudio,
  onReplayAudio,
  onClose,
}: UseStudyShortcutsProps) {
  useEffect(() => {
    if (!isOpen || isFinished) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl alone replays audio regardless of feedback state
      if (event.key === StudyGlobalShortcutKey.REPLAY_AUDIO && !event.repeat) {
        const target = event.target as HTMLElement | null;
        if (
          !(target instanceof HTMLInputElement) &&
          !(target instanceof HTMLTextAreaElement) &&
          !target?.isContentEditable
        ) {
          event.preventDefault();
          onReplayAudio();
          return;
        }
      }

      if (isFeedbackOpen) {
        if (
          event.code === FlashcardShortcutKey.SPACE ||
          event.key === FlashcardShortcutKey.ENTER
        ) {
          event.preventDefault();
          onContinueFeedback?.();
        }
        return;
      }

      const target = event.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      ) {
        return;
      }

      const hasAnyDialogOpen = Boolean(
        document.querySelector('[role="dialog"]') ||
        document.querySelector('[aria-modal="true"]'),
      );
      if (hasAnyDialogOpen) {
        return;
      }

      if (event.key === StudyGlobalShortcutKey.CLOSE) {
        event.preventDefault();
        onClose();
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isOpen,
    isFinished,
    isFlipped,
    isFeedbackOpen,
    exerciseType,
    mode,
    canFlipRef,
    onFlip,
    onMastered,
    onReview,
    onDontKnow,
    onFlashcardAgain,
    onFlashcardKnown,
    onSelectChoice,
    onContinueFeedback,
    onPlayUsAudio,
    onPlayUkAudio,
    onReplayAudio,
    onClose,
  ]);
}
