import type { I18nString } from '@/shared/types';

export interface VocabularyExample {
  id: string;
  sentence: I18nString;
}

export interface VocabularyDefinition {
  id: string;
  partOfSpeech: string;
  definition: I18nString;
  examples: VocabularyExample[];
}

export interface VocabularyWord {
  id: string;
  term: string;
  topic?: I18nString;
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
  name: I18nString;
  description?: I18nString | null;
  category?: I18nString | null;
  imageUrl?: string | null;
  isSystem: boolean;
  flashcardCount: number;
  learnedCount: number;
  dueCount: number;
}

export interface FolderTopic {
  topic: I18nString;
  topicImageUrl: string | null;
  count: number;
  learnedCount: number;
  dueCount: number;
}

export interface FolderFlashcardsPage {
  data: VocabularyWord[];
  total: number;
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

export interface MemoryStageLevel {
  level: number;
  count: number;
}

export interface FrequentlyMissedWordItem {
  flashcardId: string;
  wordId: string;
  term: string;
  partOfSpeech: string;
  definition: I18nString;
  phonetic?: string;
  audioUrl?: string;
  audioUsUrl?: string;
  imageUrl?: string;
  errorRate: number;
  masteryScore: number;
  isWilted: boolean;
}

export interface VocabularyOverview {
  totalLearnedWords: number;
  dueCount?: number;
  memoryLevels: MemoryStageLevel[];
  frequentlyMissedWords: FrequentlyMissedWordItem[];
}
