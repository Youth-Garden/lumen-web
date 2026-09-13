export interface VocabularyExample {
  id: string;
  sentence?: Record<string, string>;
  sentenceEn: string;
  translationVi: string;
}

export interface VocabularyDefinition {
  id: string;
  partOfSpeech: string;
  definition?: Record<string, string>;
  definitionEn: string;
  translationVi: string;
  examples: VocabularyExample[];
}

export interface VocabularyWord {
  id: string;
  term: string;
  topic?: string;
  topicVi?: string;
  topicImageUrl?: string;
  phonetic?: string;
  phoneticUs?: string;
  phoneticUk?: string;
  audioUrl?: string;
  audioUsUrl?: string;
  audioUkUrl?: string;
  cefrLevel?: string;
  imageUrl?: string;
  level?: number;
  learningStep?: number;
  masteryScore?: number;
  isWilted?: boolean;
  flashcardId?: string;
  wordId?: string;
  definitions: VocabularyDefinition[];
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  category?: string;
  flashcardCount: number;
  learnedCount?: number;
  dueCount?: number;
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

export enum PronunciationAccent {
  US = 'us',
  UK = 'uk',
}
