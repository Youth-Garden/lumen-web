import type { RefObject } from 'react';
import type {
  StudyFeedbackState,
  StudyQueueItem,
  StudySessionMode,
  MissedWordStat,
} from '@/features/study/types/study.types';
import type { StudySettings } from './use-study-settings';
import type { FlashcardRating } from '@/services/study';
import type { PronunciationAccent, VocabularyWord } from '@/services/vocabulary';

export interface UseStudySessionProps {
  cards: VocabularyWord[];
  selectedTopic?: string;
  isReviewMode?: boolean;
  mode?: StudySessionMode;
  isOpen: boolean;
  onClose: () => void;
}

export interface UseStudySessionReturn {
  mode: StudySessionMode;
  activeQueue: StudyQueueItem[];
  poolCards: VocabularyWord[];
  masteredIds: string[];
  currentItem: StudyQueueItem | null;
  currentCard: VocabularyWord | null;
  quotaRangeText: string;
  isFlipped: boolean;
  isFinished: boolean;
  feedback: StudyFeedbackState | null;
  selectedOptionIndex: number | null;
  progressPercent: number;
  activePhonetic: string;
  currentCardMastery: number;
  currentCardLearningStep: number;
  canFlipRef: RefObject<boolean>;
  isSubmitting: boolean;
  playingAccent: PronunciationAccent | null;
  isPlaying: boolean;
  missedWordsList: MissedWordStat[];
  settings: StudySettings;
  handleFlip: () => void;
  handleMastered: () => void;
  handleReview: () => void;
  handleDontKnow: () => void;
  handleFlashcardAgain: () => void;
  handleFlashcardKnown: () => void;
  handleSelectChoiceOption: (optionIndex: number) => void;
  handleSubmitTyping: (input: string) => void;
  handleContinueFeedback: () => void;
  handleRestart: () => void;
  handleSaveProgress: () => void;
  handlePlayUsAudio: () => void;
  handlePlayUkAudio: () => void;
  handlePlayAudio: () => void;
  handleVerifyAnswer: (isCorrect: boolean, userAnswer?: string) => void;
}
