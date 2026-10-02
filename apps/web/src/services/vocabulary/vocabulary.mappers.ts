import { pagingMapper, toI18nString } from '@/services/core';
import {
  VocabularyWord,
  Folder,
  FolderTopic,
  FolderWordsPage,
  VocabularyOverview,
  MemoryStageLevel,
  WordRelation,
  WordRelationType,
} from './vocabulary.types';

const RELATION_TYPES = new Set<string>(Object.values(WordRelationType));

export const wordRelationMapper = (raw: unknown): WordRelation | null => {
  if (typeof raw !== 'object' || raw === null) return null;
  const d = raw as Record<string, unknown>;
  if (typeof d.id !== 'string' || !d.id) return null;
  if (typeof d.targetTerm !== 'string' || !d.targetTerm.trim()) return null;
  if (typeof d.relationType !== 'string' || !RELATION_TYPES.has(d.relationType))
    return null;

  return {
    id: d.id,
    sourceWordId: String(d.sourceWordId || ''),
    definitionId: typeof d.definitionId === 'string' ? d.definitionId : null,
    targetWordId: typeof d.targetWordId === 'string' ? d.targetWordId : null,
    targetTerm: d.targetTerm.trim(),
    relationType: d.relationType as WordRelationType,
    displayOrder: typeof d.displayOrder === 'number' ? d.displayOrder : 0,
  };
};

export const wordRelationListMapper = (raw: unknown): WordRelation[] => {
  return Array.isArray(raw)
    ? raw.map(wordRelationMapper).filter((r): r is WordRelation => r !== null)
    : [];
};

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
        relations: wordRelationListMapper(def.relations),
      }))
    : [],
  relations: wordRelationListMapper(raw.relations),
});

export const folderMapper = (folder: any): Folder => ({
  id: folder?.id || '',
  name: toI18nString(folder?.name),
  description: folder?.description ? toI18nString(folder.description) : null,
  category: folder?.category ? toI18nString(folder.category) : null,
  imageUrl: folder?.imageUrl ?? null,
  isSystem: Boolean(folder?.isSystem),
  wordCount: folder?.wordCount ?? folder?.flashcardCount ?? 0,
  learnedCount: folder?.learnedCount || 0,
  dueCount: folder?.dueCount || 0,
});

export const folderListMapper = (raw: any): Folder[] => {
  if (Array.isArray(raw)) return raw.map(folderMapper);
  if (raw && typeof raw === 'object') return [folderMapper(raw)];
  return [];
};

export const folderTopicMapper = (raw: any): FolderTopic => {
  const parsedName = toI18nString(raw?.name || raw?.topic);
  const img = raw?.imageUrl || raw?.topicImageUrl || null;
  return {
    id: raw?.id || '',
    folderId: raw?.folderId,
    folderName: raw?.folderName ? toI18nString(raw.folderName) : undefined,
    name: parsedName,
    topic: parsedName,
    imageUrl: img,
    topicImageUrl: img,
    orderIndex: Number(raw?.orderIndex ?? 0),
    count: raw?.count || 0,
    learnedCount: raw?.learnedCount || 0,
    dueCount: raw?.dueCount || 0,
  };
};

export const folderTopicListMapper = (raw: any): FolderTopic[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map(folderTopicMapper);
};

export const folderWordsPageMapper = (raw: any): FolderWordsPage =>
  pagingMapper(raw, wordMapper);

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

  const frequentlyMissedWords: VocabularyWord[] = Array.isArray(
    raw.frequentlyMissedWords,
  )
    ? raw.frequentlyMissedWords.map((item: any): VocabularyWord => ({
        id: item.flashcardId || item.id || '',
        flashcardId: item.flashcardId || item.id || '',
        wordId: item.wordId || '',
        term: item.term || '',
        phonetic: item.phonetic,
        audioUrl: item.audioUrl,
        audioUsUrl: item.audioUsUrl,
        imageUrl: item.imageUrl,
        isWilted: Boolean(item.isWilted),
        masteryScore: item.masteryScore || 0,
        errorRate: item.errorRate ?? 0,
        definitions: [
          {
            id: `${item.wordId || item.flashcardId || 'def'}-0`,
            partOfSpeech: item.partOfSpeech || '',
            definition: toI18nString(item.definition),
            examples: [],
          },
        ],
      }))
    : [];

  return {
    totalLearnedWords: raw.totalLearnedWords || 0,
    dueCount: raw.dueCount || 0,
    memoryLevels,
    frequentlyMissedWords,
  };
};
