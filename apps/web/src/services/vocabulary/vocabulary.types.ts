export interface VocabularyExample {
  id: string;
  sentence?: Record<string, string>;
  sentenceEn?: string;
  translationVi?: string;
}

export interface VocabularyDefinition {
  id: string;
  partOfSpeech: string;
  definition?: Record<string, string>;
  definitionEn?: string;
  translationVi?: string;
  examples?: VocabularyExample[];
}

export interface VocabularyWord {
  id: string;
  term: string;
  topic?: string | null;
  topicVi?: string | null;
  topicImageUrl?: string | null;
  phonetic?: string;
  phoneticUs?: string | null;
  phoneticUk?: string | null;
  audioUrl?: string;
  audioUsUrl?: string | null;
  audioUkUrl?: string | null;
  cefrLevel?: string;
  imageUrl?: string | null;
  definitions?: VocabularyDefinition[];
}

export interface Folder {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  flashcardCount?: number;
  flashcards?: VocabularyWord[];
}

export interface CreateFolderPayload {
  name: string;
  description?: string;
}

export interface CreateFlashcardPayload {
  folderId: string;
  wordId: string;
}

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
  nextReviewAt?: string | null;
}

export interface CardWithProgress extends VocabularyWord {
  flashcardId?: string;
  masteryScore?: number;
  level?: number;
  isWilted?: boolean;
  learningStep?: number;
  reviewCountAtCurrentLevel?: number;
  intervalDays?: number;
  nextReviewAt?: string | null;
}

export enum FlashcardRating {
  WRONG = 'WRONG',
  CORRECT = 'CORRECT',
  FAST_TRACK_TEMP = 'FAST_TRACK_TEMP',
  FAST_TRACK_KNOWN = 'FAST_TRACK_KNOWN',
}

export enum PronunciationAccent {
  US = 'us',
  UK = 'uk',
}

export interface ReviewFlashcardPayload {
  flashcardId: string;
  quality: FlashcardRating;
}
