export interface VocabularyExample {
  id: string;
  sentenceEn: string;
  translationVi: string;
}

export interface VocabularyDefinition {
  id: string;
  partOfSpeech: string;
  definitionEn: string;
  translationVi: string;
  examples: VocabularyExample[];
}

export interface VocabularyWord {
  id: string;
  term: string;
  phonetic?: string;
  audioUrl?: string;
  cefrLevel?: string;
  definitions: VocabularyDefinition[];
}

export interface WordListResponse {
  items: VocabularyWord[];
  meta: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  flashcardCount: number;
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
