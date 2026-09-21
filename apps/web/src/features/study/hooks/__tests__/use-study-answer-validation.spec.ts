import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useStudyAnswerValidation } from '../use-study-answer-validation';
import {
  StudyExerciseType,
  type StudyQueueItem,
} from '@/features/study/types/study.types';
import type { VocabularyWord } from '@/services/vocabulary';

vi.mock('@lumen/uikit/portal', () => ({
  usePortalWithoutBackdrop: () => [vi.fn(), vi.fn()],
}));

const mockCard: VocabularyWord = {
  id: 'card-1',
  term: 'Innovation',
  definitions: [
    {
      id: 'def-1',
      partOfSpeech: 'noun',
      definitionEn: 'Innovation',
      translationVi: 'Sự đổi mới',
      examples: [],
    },
  ],
  level: 0,
  learningStep: 0,
  masteryScore: 0,
};

const mockItem: StudyQueueItem = {
  id: 'item-1',
  card: mockCard,
  exerciseType: StudyExerciseType.CHOICE_TERM,
  stepIndex: 1,
  totalSteps: 3,
  options: [
    { id: 'card-1', label: 'Innovation', isCorrect: true },
    { id: 'card-2', label: 'Stagnation', isCorrect: false },
  ],
};

describe('useStudyAnswerValidation', () => {
  const defaultProps = {
    currentCard: mockCard,
    currentItem: mockItem,
    activeQueue: [mockItem],
    poolCards: [mockCard],
    cards: [mockCard],
    globalCards: [mockCard],
    wordProgressMap: {},
    soundEffectsEnabled: false,
    setActiveQueue: vi.fn(),
    setWordProgressMap: vi.fn(),
    setMasteredIds: vi.fn(),
    setEarnedPoints: vi.fn(),
    recordMissedWord: vi.fn(),
    recordReviewPending: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should verify correct choice option and record pending review', () => {
    const { result } = renderHook(() => useStudyAnswerValidation(defaultProps));

    act(() => {
      result.current.handleSelectChoiceOption(0);
    });

    expect(result.current.feedback?.isCorrect).toBe(true);
    expect(defaultProps.recordReviewPending).toHaveBeenCalledWith('card-1', {
      isCorrect: true,
    });
    expect(defaultProps.recordMissedWord).not.toHaveBeenCalled();
  });

  it('should verify incorrect choice option and record missed word', () => {
    const { result } = renderHook(() => useStudyAnswerValidation(defaultProps));

    act(() => {
      result.current.handleSelectChoiceOption(1);
    });

    expect(result.current.feedback?.isCorrect).toBe(false);
    expect(defaultProps.recordReviewPending).toHaveBeenCalledWith('card-1', {
      isCorrect: false,
    });
    expect(defaultProps.recordMissedWord).toHaveBeenCalledWith(mockCard);
  });

  it('should match typing input case-insensitively', () => {
    const { result } = renderHook(() => useStudyAnswerValidation(defaultProps));

    act(() => {
      result.current.handleSubmitTyping('  innovation  ');
    });

    expect(result.current.feedback?.isCorrect).toBe(true);
  });
});
