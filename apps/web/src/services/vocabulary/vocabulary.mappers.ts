import { VocabularyWord, Deck, DueFlashcard } from './vocabulary.types';

export const wordMapper = (raw: any): VocabularyWord => {
  return {
    id: raw?.id || '',
    term: raw?.term || '',
    phonetic: raw?.phonetic,
    audioUrl: raw?.audioUrl,
    cefrLevel: raw?.cefrLevel,
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

export const deckMapper = (deck: any): Deck => ({
  id: deck?.id || '',
  name: deck?.name || '',
  description: deck?.description,
  flashcardCount: deck?.flashcardCount ?? 0,
});

export const deckListMapper = (raw: any): Deck[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map(deckMapper);
};

export const dueFlashcardMapper = (item: any): DueFlashcard => ({
  flashcardId: item?.flashcardId || '',
  wordId: item?.wordId || '',
  term: item?.term || '',
  deckId: item?.deckId || '',
  deckName: item?.deckName || '',
  nextReviewDate: item?.nextReviewDate || '',
  easeFactor: item?.easeFactor ?? 0,
  repetitions: item?.repetitions ?? 0,
});

export const dueFlashcardsMapper = (raw: any): DueFlashcard[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map(dueFlashcardMapper);
};
