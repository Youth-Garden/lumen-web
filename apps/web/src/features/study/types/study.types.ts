import type { VocabularyWord } from '@/services/vocabulary';

export enum StudyExerciseType {
  FLASHCARD = 'FLASHCARD',
  CHOICE_TERM = 'CHOICE_TERM',
  CHOICE_MEANING = 'CHOICE_MEANING',
  TYPING = 'TYPING',
}

export interface ChoiceOption {
  id: string;
  label: string;
  subLabel?: string;
  isCorrect: boolean;
}

export interface StudyQueueItem {
  id: string;
  card: VocabularyWord;
  exerciseType: StudyExerciseType;
  meaningPrompt?: string;
  partOfSpeechPrompt?: string;
  options?: ChoiceOption[];
  isReviewingFailed?: boolean;
}

export interface StudyFeedbackState {
  isOpen: boolean;
  isCorrect: boolean;
  card: VocabularyWord;
  userAnswer?: string;
  correctAnswer: string;
  meaning: string;
  partOfSpeech?: string;
  imageUrl?: string;
}

export interface MissedWordStat {
  card: VocabularyWord;
  errorCount: number;
}
