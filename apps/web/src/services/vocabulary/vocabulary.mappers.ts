import {
  VocabularyWord,
  Folder,
  VocabularyOverview,
  MemoryStageLevel,
  FrequentlyMissedWordItem,
} from './vocabulary.types';

export const wordMapper = (raw?: any): VocabularyWord => {
  return {
    id: raw?.id || '',
    term: raw?.term || '',
    topic: raw?.topic || undefined,
    topicVi: raw?.topicVi || undefined,
    topicImageUrl: raw?.topicImageUrl || undefined,
    phonetic: raw?.phonetic || undefined,
    phoneticUs: raw?.phoneticUs || undefined,
    phoneticUk: raw?.phoneticUk || undefined,
    audioUrl: raw?.audioUrl || undefined,
    audioUsUrl: raw?.audioUsUrl || undefined,
    audioUkUrl: raw?.audioUkUrl || undefined,
    cefrLevel: raw?.cefrLevel || undefined,
    imageUrl: raw?.imageUrl || undefined,
    level: raw?.level ?? 0,
    learningStep: raw?.learningStep ?? 0,
    masteryScore: raw?.masteryScore ?? 0,
    isWilted: raw?.isWilted ?? false,
    flashcardId: raw?.flashcardId || raw?.id || undefined,
    wordId: raw?.wordId || undefined,
    definitions: (raw?.definitions || []).map((definition: any) => ({
      id: definition?.id || '',
      partOfSpeech: definition?.partOfSpeech || '',
      definitionEn: definition?.definitionEn || '',
      translationVi: definition?.translationVi || '',
      examples: (definition?.examples || []).map((example: any) => ({
        id: example?.id || '',
        sentenceEn: example?.sentenceEn || '',
        translationVi: example?.translationVi || '',
      })),
    })),
  };
};

export const folderMapper = (folder?: any): Folder => ({
  id: folder?.id || '',
  name: folder?.name || '',
  description: folder?.description || undefined,
  category: folder?.category || undefined,
  flashcardCount: folder?.flashcardCount ?? 0,
  learnedCount: folder?.learnedCount ?? 0,
  dueCount: folder?.dueCount ?? 0,
  flashcards: Array.isArray(folder?.flashcards)
    ? folder.flashcards.map((flashcard: any) => wordMapper(flashcard))
    : undefined,
});

export const folderListMapper = (raw?: any): Folder[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => folderMapper(item));
};

export const vocabularyOverviewMapper = (raw?: any): VocabularyOverview => {
  const memoryLevels: MemoryStageLevel[] = Array.isArray(raw?.memoryLevels)
    ? raw.memoryLevels.map((item: any) => ({
        level: Number(item?.level || 0),
        count: Number(item?.count || 0),
      }))
    : [
        { level: 1, count: 0 },
        { level: 2, count: 0 },
        { level: 3, count: 0 },
        { level: 4, count: 0 },
        { level: 5, count: 0 },
      ];

  const frequentlyMissedWords: FrequentlyMissedWordItem[] = Array.isArray(
    raw?.frequentlyMissedWords,
  )
    ? raw.frequentlyMissedWords.map((item: any) => ({
        flashcardId: String(item?.flashcardId || ''),
        wordId: String(item?.wordId || ''),
        term: String(item?.term || ''),
        partOfSpeech: String(item?.partOfSpeech || ''),
        definition: String(item?.definition || ''),
        phonetic: item?.phonetic ? String(item.phonetic) : undefined,
        audioUrl: item?.audioUrl ? String(item.audioUrl) : undefined,
        audioUsUrl: item?.audioUsUrl ? String(item.audioUsUrl) : undefined,
        imageUrl: item?.imageUrl ? String(item.imageUrl) : undefined,
        errorRate: Number(item?.errorRate || 0),
        masteryScore: Number(item?.masteryScore || 0),
        isWilted: Boolean(item?.isWilted),
      }))
    : [];

  return {
    totalLearnedWords: Number(raw?.totalLearnedWords || 0),
    memoryLevels,
    frequentlyMissedWords,
  };
};
