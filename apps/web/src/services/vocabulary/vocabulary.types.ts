import type { I18nString } from '@/shared/types';
import type { Paging } from '@lumen/shared-api';

export enum WordRelationType {
  SYNONYM = 'SYNONYM',
  ANTONYM = 'ANTONYM',
  RELATED = 'RELATED',
}

export interface WordRelation {
  id: string;
  sourceWordId: string;
  definitionId?: string | null;
  targetWordId?: string | null;
  targetTerm: string;
  relationType: WordRelationType;
  displayOrder: number;
}

export interface VocabularyExample {
  id: string;
  sentence: I18nString;
}

export interface VocabularyDefinition {
  id: string;
  partOfSpeech: string;
  definition: I18nString;
  examples: VocabularyExample[];
  relations?: WordRelation[];
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
  errorRate?: number;
  definitions: VocabularyDefinition[];
  relations?: WordRelation[];
}

export interface Folder {
  id: string;
  name: I18nString;
  description?: I18nString | null;
  category?: I18nString | null;
  imageUrl?: string | null;
  isSystem: boolean;
  wordCount: number;
  learnedCount: number;
  dueCount: number;
}

export interface FolderTopic {
  id: string;
  folderId?: string;
  folderName?: I18nString;
  name: I18nString;
  topic: I18nString;
  imageUrl?: string | null;
  topicImageUrl: string | null;
  orderIndex?: number;
  count: number;
  learnedCount: number;
  dueCount: number;
}

export type FolderWordsPage = Paging<VocabularyWord>;

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

export interface VocabularyOverview {
  totalLearnedWords: number;
  dueCount?: number;
  memoryLevels: MemoryStageLevel[];
  frequentlyMissedWords: VocabularyWord[];
}
