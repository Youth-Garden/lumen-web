import {
  VocabularyWord,
  Folder,
  VocabularyOverview,
  MemoryStageLevel,
  FrequentlyMissedWordItem,
} from './vocabulary.types';

export const wordMapper = (
  raw?: Record<string, unknown> | null,
): VocabularyWord => {
  return {
    id: typeof raw?.id === 'string' ? raw.id : '',
    term: typeof raw?.term === 'string' ? raw.term : '',
    topic: typeof raw?.topic === 'string' ? raw.topic : undefined,
    topicVi: typeof raw?.topicVi === 'string' ? raw.topicVi : undefined,
    topicImageUrl:
      typeof raw?.topicImageUrl === 'string' ? raw.topicImageUrl : undefined,
    phonetic: typeof raw?.phonetic === 'string' ? raw.phonetic : undefined,
    phoneticUs:
      typeof raw?.phoneticUs === 'string' ? raw.phoneticUs : undefined,
    phoneticUk:
      typeof raw?.phoneticUk === 'string' ? raw.phoneticUk : undefined,
    audioUrl: typeof raw?.audioUrl === 'string' ? raw.audioUrl : undefined,
    audioUsUrl:
      typeof raw?.audioUsUrl === 'string' ? raw.audioUsUrl : undefined,
    audioUkUrl:
      typeof raw?.audioUkUrl === 'string' ? raw.audioUkUrl : undefined,
    cefrLevel: typeof raw?.cefrLevel === 'string' ? raw.cefrLevel : undefined,
    imageUrl: typeof raw?.imageUrl === 'string' ? raw.imageUrl : undefined,
    level: typeof raw?.level === 'number' ? raw.level : 0,
    learningStep:
      typeof raw?.learningStep === 'number' ? raw.learningStep : 0,
    masteryScore:
      typeof raw?.masteryScore === 'number' ? raw.masteryScore : 0,
    isWilted: Boolean(raw?.isWilted),
    flashcardId:
      typeof raw?.flashcardId === 'string'
        ? raw.flashcardId
        : typeof raw?.id === 'string'
          ? raw.id
          : undefined,
    wordId: typeof raw?.wordId === 'string' ? raw.wordId : undefined,
    definitions: Array.isArray(raw?.definitions)
      ? raw.definitions.map((definition: Record<string, unknown>) => ({
          id: typeof definition?.id === 'string' ? definition.id : '',
          partOfSpeech:
            typeof definition?.partOfSpeech === 'string'
              ? definition.partOfSpeech
              : '',
          definitionEn:
            typeof definition?.definitionEn === 'string'
              ? definition.definitionEn
              : '',
          translationVi:
            typeof definition?.translationVi === 'string'
              ? definition.translationVi
              : '',
          examples: Array.isArray(definition?.examples)
            ? definition.examples.map((example: Record<string, unknown>) => ({
                id: typeof example?.id === 'string' ? example.id : '',
                sentenceEn:
                  typeof example?.sentenceEn === 'string'
                    ? example.sentenceEn
                    : '',
                translationVi:
                  typeof example?.translationVi === 'string'
                    ? example.translationVi
                    : '',
              }))
            : [],
        }))
      : [],
  };
};

export const folderMapper = (
  folder?: Record<string, unknown> | null,
): Folder => ({
  id: typeof folder?.id === 'string' ? folder.id : '',
  name: typeof folder?.name === 'string' ? folder.name : '',
  description:
    typeof folder?.description === 'string' ? folder.description : undefined,
  category: typeof folder?.category === 'string' ? folder.category : undefined,
  flashcardCount:
    typeof folder?.flashcardCount === 'number' ? folder.flashcardCount : 0,
  learnedCount:
    typeof folder?.learnedCount === 'number' ? folder.learnedCount : 0,
  dueCount: typeof folder?.dueCount === 'number' ? folder.dueCount : 0,
  flashcards: Array.isArray(folder?.flashcards)
    ? folder.flashcards.map((flashcard: Record<string, unknown>) =>
        wordMapper(flashcard),
      )
    : undefined,
});

export const folderListMapper = (raw?: unknown): Folder[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => folderMapper(item as Record<string, unknown>));
};

export const vocabularyOverviewMapper = (
  raw?: Record<string, unknown> | null,
): VocabularyOverview => {
  const memoryLevels: MemoryStageLevel[] = Array.isArray(raw?.memoryLevels)
    ? raw.memoryLevels.map((item: Record<string, unknown>) => ({
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
    ? raw.frequentlyMissedWords.map((item: Record<string, unknown>) => ({
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
    dueCount: Number(raw?.dueCount || 0),
    memoryLevels,
    frequentlyMissedWords,
  };
};
