import type { I18nMap, I18nString, SupportedLocale } from '@/shared/types';

export type { I18nMap, I18nString, SupportedLocale };

export interface VocabularyExample {
  id: string;
  sentence?: I18nMap;
  sentenceEn: string;
  translationVi: string;
}

export interface VocabularyDefinition {
  id: string;
  partOfSpeech: string;
  definition?: I18nMap;
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
  name: I18nString;
  description?: I18nString | null;
  category?: I18nString | null;
  isSystem: boolean;
  flashcardCount: number;
  learnedCount: number;
  dueCount: number;
}

export interface FolderTopic {
  topic: string;
  topicVi: string | null;
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
  definition: string;
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
