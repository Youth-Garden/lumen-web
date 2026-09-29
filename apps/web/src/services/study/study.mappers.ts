import { toI18nString } from '@/services/core';
import type { VocabularyWord } from '../vocabulary';
import type { DueWord } from './study.types';

export const dueWordMapper = (raw: any): DueWord => ({
  flashcardId: raw?.flashcardId ?? '',
  wordId: raw?.wordId ?? '',
  term: raw?.term ?? '',
  folderId: raw?.folderId ?? '',
  folderName: toI18nString(raw?.folderName),
  masteryScore: raw?.masteryScore ?? 0,
  level: raw?.level ?? 0,
  isWilted: Boolean(raw?.isWilted),
  learningStep: raw?.learningStep ?? 0,
  reviewCountAtCurrentLevel: raw?.reviewCountAtCurrentLevel ?? 0,
  intervalDays: raw?.intervalDays ?? 0,
  nextReviewAt: raw?.nextReviewAt ?? undefined,
  phonetic: raw?.phonetic,
  phoneticUs: raw?.phoneticUs,
  phoneticUk: raw?.phoneticUk,
  audioUrl: raw?.audioUrl,
  audioUsUrl: raw?.audioUsUrl,
  audioUkUrl: raw?.audioUkUrl,
  imageUrl: raw?.imageUrl,
  definitions: Array.isArray(raw?.definitions)
    ? raw.definitions.map((def: any) => ({
        id: def?.id ?? '',
        partOfSpeech: def?.partOfSpeech,
        definition: toI18nString(def?.definition),
        examples: [],
      }))
    : [],
});

export const dueWordsMapper = (raw: any): DueWord[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map(dueWordMapper);
};

export const dueWordToVocabularyWord = (card: DueWord): VocabularyWord => ({
  id: card.flashcardId,
  flashcardId: card.flashcardId,
  wordId: card.wordId,
  term: card.term,
  phonetic: card.phonetic,
  phoneticUs: card.phoneticUs,
  phoneticUk: card.phoneticUk,
  audioUrl: card.audioUrl,
  audioUsUrl: card.audioUsUrl,
  audioUkUrl: card.audioUkUrl,
  imageUrl: card.imageUrl,
  level: card.level,
  learningStep: card.learningStep,
  masteryScore: card.masteryScore,
  isWilted: card.isWilted,
  definitions: card.definitions || [],
});
