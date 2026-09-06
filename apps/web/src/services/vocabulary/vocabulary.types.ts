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
  due?: string;
  nextReviewDate?: string;
  easeFactor?: number;
  repetitions?: number;
}

export enum FlashcardRating {
  AGAIN = 1,
  HARD = 2,
  GOOD = 3,
  EASY = 4,
}

export enum PronunciationAccent {
  US = 'us',
  UK = 'uk',
}

export interface ReviewFlashcardPayload {
  flashcardId: string;
  quality: FlashcardRating;
}
