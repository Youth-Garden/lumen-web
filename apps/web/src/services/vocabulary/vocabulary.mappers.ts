import { toI18nString } from '@/services/core';
import {
  VocabularyWord,
  Folder,
  FolderTopic,
  FolderFlashcardsPage,
  VocabularyOverview,
  MemoryStageLevel,
  FrequentlyMissedWordItem,
} from './vocabulary.types';

export const wordMapper = (raw: any): VocabularyWord => ({
  id: raw.id || '',
  term: raw.term || '',
  topic: toI18nString(raw.topic),
  topicImageUrl: raw.topicImageUrl,
  phonetic: raw.phonetic,
  phoneticUs: raw.phoneticUs,
  phoneticUk: raw.phoneticUk,
  audioUrl: raw.audioUrl,
  audioUsUrl: raw.audioUsUrl,
  audioUkUrl: raw.audioUkUrl,
  cefrLevel: raw.cefrLevel,
  imageUrl: raw.imageUrl,
  level: raw.level || 0,
  learningStep: raw.learningStep || 0,
  masteryScore: raw.masteryScore || 0,
  isWilted: Boolean(raw.isWilted),
  flashcardId: raw.flashcardId || raw.id,
  wordId: raw.wordId,
  definitions: Array.isArray(raw.definitions)
    ? raw.definitions.map((def: any) => ({
        id: def.id || '',
        partOfSpeech: def.partOfSpeech || '',
        definition: toI18nString(def.definition),
        examples: Array.isArray(def.examples)
          ? def.examples.map((ex: any) => ({
              id: ex.id || '',
              sentence: toI18nString(ex.sentence),
            }))
          : [],
      }))
    : [],
});

export const folderMapper = (folder: any): Folder => ({
  id: folder.id || '',
  name: toI18nString(folder.name),
  description: folder.description ? toI18nString(folder.description) : null,
  category: folder.category ? toI18nString(folder.category) : null,
  imageUrl: folder.imageUrl ?? null,
  isSystem: Boolean(folder.isSystem),
  flashcardCount: folder.flashcardCount || 0,
  learnedCount: folder.learnedCount || 0,
  dueCount: folder.dueCount || 0,
});

export const folderListMapper = (raw: any): Folder[] => {
  if (Array.isArray(raw)) return raw.map(folderMapper);
  if (raw && typeof raw === 'object') return [folderMapper(raw)];
  return [];
};

export const folderTopicMapper = (raw: any): FolderTopic => ({
  topic: toI18nString(raw.topic),
  topicImageUrl: raw.topicImageUrl || null,
  count: raw.count || 0,
  learnedCount: raw.learnedCount || 0,
  dueCount: raw.dueCount || 0,
});

export const folderTopicListMapper = (raw: any): FolderTopic[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map(folderTopicMapper);
};

export const folderFlashcardsPageMapper = (raw: any): FolderFlashcardsPage => ({
  data: Array.isArray(raw.data) ? raw.data.map(wordMapper) : [],
  total: raw.total || 0,
});

export const vocabularyOverviewMapper = (raw: any): VocabularyOverview => {
  const memoryLevels: MemoryStageLevel[] = Array.isArray(raw.memoryLevels)
    ? raw.memoryLevels.map((item: any) => ({
        level: item.level || 0,
        count: item.count || 0,
      }))
    : [
        { level: 1, count: 0 },
        { level: 2, count: 0 },
        { level: 3, count: 0 },
        { level: 4, count: 0 },
        { level: 5, count: 0 },
      ];

  const frequentlyMissedWords: FrequentlyMissedWordItem[] = Array.isArray(
    raw.frequentlyMissedWords,
  )
    ? raw.frequentlyMissedWords.map((item: any) => ({
        flashcardId: item.flashcardId || '',
        wordId: item.wordId || '',
        term: item.term || '',
        partOfSpeech: item.partOfSpeech || '',
        definition: toI18nString(item.definition),
        phonetic: item.phonetic,
        audioUrl: item.audioUrl,
        audioUsUrl: item.audioUsUrl,
        imageUrl: item.imageUrl,
        errorRate: item.errorRate || 0,
        masteryScore: item.masteryScore || 0,
        isWilted: Boolean(item.isWilted),
      }))
    : [];

  return {
    totalLearnedWords: raw.totalLearnedWords || 0,
    dueCount: raw.dueCount || 0,
    memoryLevels,
    frequentlyMissedWords,
  };
};
