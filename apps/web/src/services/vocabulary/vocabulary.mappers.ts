import { VocabularyWord, WordListResponse, Deck } from './vocabulary.types';

export const wordListMapper = (raw: any): WordListResponse => {
  return {
    items: (raw?.items || []).map(wordMapper),
    meta: {
      currentPage: raw?.meta?.currentPage || 1,
      perPage: raw?.meta?.perPage || 20,
      totalItems: raw?.meta?.totalItems || 0,
      totalPages: raw?.meta?.totalPages || 0,
    },
  };
};

export const wordMapper = (raw: any): VocabularyWord => {
  return {
    id: raw?.id || '',
    term: raw?.term || '',
    phonetic: raw?.phonetic || null,
    audioUrl: raw?.audioUrl || null,
    cefrLevel: raw?.cefrLevel || null,
    definitions: (raw?.definitions || []).map((def: any) => ({
      id: def?.id || '',
      partOfSpeech: def?.partOfSpeech || '',
      definitionEn: def?.definitionEn || '',
      translationVi: def?.translationVi || '',
      examples: (def?.examples || []).map((ex: any) => ({
        id: ex?.id || '',
        sentenceEn: ex?.sentenceEn || '',
        translationVi: ex?.translationVi || '',
      })),
    })),
  };
};

export const deckListMapper = (raw: any): Deck[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map((deckRaw: any) => ({
    id: deckRaw?.id || '',
    name: deckRaw?.name || '',
    description: deckRaw?.description || null,
    flashcardCount: deckRaw?.flashcardCount || 0,
  }));
};
