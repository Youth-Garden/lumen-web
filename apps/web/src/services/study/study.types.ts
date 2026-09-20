import type { VocabularyWord } from '../vocabulary';

export interface DueFlashcard {
  flashcardId: string;
  wordId: string;
  term: string;
  folderId: string;
  folderName: string;
  masteryScore: number;
  level: number;
  isWilted: boolean;
  learningStep: number;
  reviewCountAtCurrentLevel: number;
  intervalDays: number;
  nextReviewAt?: string;
}

export interface CardWithProgress extends VocabularyWord {
  flashcardId?: string;
  masteryScore?: number;
  level?: number;
  isWilted?: boolean;
  learningStep?: number;
  reviewCountAtCurrentLevel?: number;
  intervalDays?: number;
  nextReviewAt?: string;
}

export enum FlashcardRating {
  WRONG = 'WRONG',
  CORRECT = 'CORRECT',
  FAST_TRACK_TEMP = 'FAST_TRACK_TEMP',
  FAST_TRACK_KNOWN = 'FAST_TRACK_KNOWN',
}

export interface ReviewFlashcardPayload {
  flashcardId: string;
  quality?: FlashcardRating;
  isCorrect?: boolean;
  isFastTrackKnown?: boolean;
  isFastTrackTempMemory?: boolean;
  isResetToUnlearned?: boolean;
}

export interface BatchReviewFlashcardsPayload {
  reviews: ReviewFlashcardPayload[];
}
