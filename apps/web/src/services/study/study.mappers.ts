import { DueFlashcard } from './study.types';

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
  nextReviewAt: item?.nextReviewAt || undefined,
});

export const dueFlashcardsMapper = (raw?: any): DueFlashcard[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => dueFlashcardMapper(item));
};
