'use client';

import { useEffect, type RefObject } from 'react';
import { StudyExerciseType } from '../components/study/study.types';

export interface UseStudyShortcutsProps {
  isOpen: boolean;
  isFinished: boolean;
  isFlipped: boolean;
  isFeedbackOpen: boolean;
  exerciseType: StudyExerciseType;
  canFlipRef: RefObject<boolean | null>;
  onFlip: () => void;
  onMastered: () => void;
  onReview: () => void;
  onDontKnow: () => void;
  onSelectChoice?: (index: number) => void;
  onContinueFeedback?: () => void;
  onPlayUsAudio: () => void;
  onPlayUkAudio: () => void;
  onClose: () => void;
}

export function useStudyShortcuts({
  isOpen,
  isFinished,
  isFlipped,
  isFeedbackOpen,
  exerciseType,
  canFlipRef,
  onFlip,
  onMastered,
  onReview,
  onDontKnow,
  onSelectChoice,
  onContinueFeedback,
  onPlayUsAudio,
  onPlayUkAudio,
  onClose,
}: UseStudyShortcutsProps) {
  useEffect(() => {
    if (!isOpen || isFinished) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // 1. If Feedback Drawer is open, Space or Enter continues
      if (isFeedbackOpen) {
        if (event.code === 'Space' || event.key === 'Enter') {
          event.preventDefault();
          onContinueFeedback?.();
        }
        return;
      }

      // 2. Ignore if typing in text fields or content editable
      const target = event.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      ) {
        return;
      }

      // 3. Ignore if any modal/dialog is currently open (e.g. settings dialog)
      const hasAnyDialogOpen = Boolean(
        document.querySelector('[role="dialog"]') ||
        document.querySelector('[aria-modal="true"]')
      );
      if (hasAnyDialogOpen) {
        return;
      }

      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      // Audio shortcuts anytime
      if (event.key.toLowerCase() === 'u') {
        event.preventDefault();
        onPlayUsAudio();
        return;
      }
      if (event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onPlayUkAudio();
        return;
      }

      // 4. Exercise-specific shortcuts
      if (exerciseType === StudyExerciseType.FLASHCARD) {
        if (!isFlipped) {
          // Front side: Space or Enter to flip
          if (event.code === 'Space' || event.key === 'Enter') {
            if (!canFlipRef.current || event.repeat) return;
            event.preventDefault();
            onFlip();
          }
        } else {
          // Back side:
          if (event.code === 'Space') {
            event.preventDefault();
            onFlip();
          } else if (event.key === '1') {
            event.preventDefault();
            onMastered();
          } else if (event.key === '3') {
            event.preventDefault();
            onReview();
          } else if (event.key === 'Enter') {
            event.preventDefault();
            onDontKnow();
          }
        }
      } else if (
        exerciseType === StudyExerciseType.CHOICE_TERM ||
        exerciseType === StudyExerciseType.CHOICE_MEANING
      ) {
        if (event.key === '1') {
          event.preventDefault();
          onSelectChoice?.(0);
        } else if (event.key === '2') {
          event.preventDefault();
          onSelectChoice?.(1);
        } else if (event.key === '3') {
          event.preventDefault();
          onSelectChoice?.(2);
        } else if (event.key === '4') {
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
    canFlipRef,
    onFlip,
    onMastered,
    onReview,
    onDontKnow,
    onSelectChoice,
    onContinueFeedback,
    onPlayUsAudio,
    onPlayUkAudio,
    onClose,
  ]);
}
