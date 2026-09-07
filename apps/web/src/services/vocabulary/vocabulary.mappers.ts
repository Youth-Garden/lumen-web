import { VocabularyWord, Folder, DueFlashcard } from './vocabulary.types';

export const wordMapper = (raw?: any): VocabularyWord => {
  return {
    id: raw?.id || '',
    term: raw?.term || '',
    phonetic: raw?.phonetic,
    phoneticUs: raw?.phoneticUs,
    phoneticUk: raw?.phoneticUk,
    audioUrl: raw?.audioUrl,
    audioUsUrl: raw?.audioUsUrl,
    audioUkUrl: raw?.audioUkUrl,
    cefrLevel: raw?.cefrLevel,
    imageUrl: raw?.imageUrl || null,
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
  description: folder?.description,
  category: folder?.category || null,
  flashcardCount: folder?.flashcardCount ?? 0,
  flashcards: Array.isArray(folder?.flashcards)
    ? folder.flashcards.map((flashcard: any) => wordMapper(flashcard))
    : undefined,
});

export const folderListMapper = (raw?: any): Folder[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => folderMapper(item));
};

export const dueFlashcardMapper = (item?: any): DueFlashcard => ({
  flashcardId: item?.flashcardId || '',
  wordId: item?.wordId || '',
  term: item?.term || '',
  folderId: item?.folderId || '',
  folderName: item?.folderName || '',
  masteryScore: item?.masteryScore ?? 0,
  level: item?.level ?? 0,
  isWilted: item?.isWilted ?? false,
  learningStep: item?.learningStep ?? 0,
  reviewCountAtCurrentLevel: item?.reviewCountAtCurrentLevel ?? 0,
  intervalDays: item?.intervalDays ?? 0,
  nextReviewAt: item?.nextReviewAt || null,
});

export const dueFlashcardsMapper = (raw?: any): DueFlashcard[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => dueFlashcardMapper(item));
};
