import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useStudyShortcuts } from '../use-study-shortcuts';
import {
  StudyExerciseType,
  StudySessionMode,
} from '@/features/study/types/study.types';
import {
  FlashcardShortcutKey,
  ChoiceShortcutKey,
  StudyGlobalShortcutKey,
} from '../../constants';

describe('useStudyShortcuts', () => {
  const defaultProps = {
    isOpen: true,
    isFinished: false,
    isFlipped: false,
    isFeedbackOpen: false,
    exerciseType: StudyExerciseType.FLASHCARD,
    mode: StudySessionMode.LEARN_NEW,
    canFlipRef: { current: true },
    onFlip: vi.fn(),
    onMastered: vi.fn(),
    onReview: vi.fn(),
    onDontKnow: vi.fn(),
    onFlashcardAgain: vi.fn(),
    onFlashcardKnown: vi.fn(),
    onSelectChoice: vi.fn(),
    onContinueFeedback: vi.fn(),
    onPlayUsAudio: vi.fn(),
    onPlayUkAudio: vi.fn(),
    onReplayAudio: vi.fn(),
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should trigger onFlip when Space is pressed on unflipped flashcard', () => {
    renderHook(() => useStudyShortcuts(defaultProps));

    window.dispatchEvent(
      new KeyboardEvent('keydown', { code: FlashcardShortcutKey.SPACE }),
    );

    expect(defaultProps.onFlip).toHaveBeenCalledTimes(1);
  });

  it('should trigger rating callbacks when flipped in LEARN_NEW mode', () => {
    const props = { ...defaultProps, isFlipped: true };
    renderHook(() => useStudyShortcuts(props));

    // Press '1' for Mastered
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: FlashcardShortcutKey.MASTERED }),
    );
    expect(defaultProps.onMastered).toHaveBeenCalledTimes(1);

    // Press '2' for Review
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: FlashcardShortcutKey.REVIEW }),
    );
    expect(defaultProps.onReview).toHaveBeenCalledTimes(1);

    // Press Enter for Don't know
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: FlashcardShortcutKey.ENTER }),
    );
    expect(defaultProps.onDontKnow).toHaveBeenCalledTimes(1);
  });

  it('should trigger choice selection when number keys 1-4 are pressed in CHOICE_TERM mode', () => {
    const props = {
      ...defaultProps,
      exerciseType: StudyExerciseType.CHOICE_TERM,
    };
    renderHook(() => useStudyShortcuts(props));

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: ChoiceShortcutKey.CHOICE_1 }),
    );
    expect(defaultProps.onSelectChoice).toHaveBeenCalledWith(0);

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: ChoiceShortcutKey.CHOICE_3 }),
    );
    expect(defaultProps.onSelectChoice).toHaveBeenCalledWith(2);
  });

  it('should trigger audio playback shortcuts', () => {
    renderHook(() => useStudyShortcuts(defaultProps));

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: StudyGlobalShortcutKey.AUDIO_US }),
    );
    expect(defaultProps.onPlayUsAudio).toHaveBeenCalledTimes(1);

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: StudyGlobalShortcutKey.AUDIO_UK }),
    );
    expect(defaultProps.onPlayUkAudio).toHaveBeenCalledTimes(1);
  });

  it('should trigger onContinueFeedback when Space is pressed while feedback drawer is open', () => {
    const props = { ...defaultProps, isFeedbackOpen: true };
    renderHook(() => useStudyShortcuts(props));

    window.dispatchEvent(
      new KeyboardEvent('keydown', { code: FlashcardShortcutKey.SPACE }),
    );
    expect(defaultProps.onContinueFeedback).toHaveBeenCalledTimes(1);
  });

  it('should trigger onClose when Escape is pressed and no dialog is open', () => {
    renderHook(() => useStudyShortcuts(defaultProps));

    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: StudyGlobalShortcutKey.CLOSE }),
    );
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});
