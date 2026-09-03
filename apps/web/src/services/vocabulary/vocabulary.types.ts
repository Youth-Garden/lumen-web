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
  audioUrl?: string;
  cefrLevel?: string;
  imageUrl?: string | null;
  definitions?: VocabularyDefinition[];
}

export interface FlashcardSummary {
  id: string;
  wordId: string;
  term: string;
  phonetic?: string | null;
  audioUrl?: string | null;
  cefrLevel?: string | null;
  imageUrl?: string | null;
  definitions?: VocabularyDefinition[];
}

export interface Deck {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  flashcardCount: number;
}

export interface DeckDetail {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  flashcards: FlashcardSummary[];
}

export interface CreateDeckPayload {
  name: string;
  description?: string;
}

export interface CreateFlashcardPayload {
  deckId: string;
  wordId: string;
}

export interface DueFlashcard {
  flashcardId: string;
  wordId: string;
  term: string;
  deckId: string;
  deckName: string;
  nextReviewDate: string;
  easeFactor: number;
  repetitions: number;
}

export enum FlashcardRating {
  AGAIN = 1,
  HARD = 2,
  GOOD = 3,
  EASY = 4,
}

export interface ReviewFlashcardPayload {
  flashcardId: string;
  quality: FlashcardRating;
}
