import type {
  VocabularyWord,
  VocabularyWordListResponse,
} from './vocabulary.types';

export const vocabWordMapper = (raw: any): VocabularyWord => ({
  ...raw,
  id: raw?.id ? String(raw.id) : '',
  phonetic: raw?.phonetic ?? null,
  audioUrl: raw?.audioUrl ?? null,
  cefrLevel: raw?.cefrLevel ?? null,
  definitions: Array.isArray(raw?.definitions)
    ? raw.definitions.map((def: any) => ({
        ...def,
        id: def?.id ? String(def.id) : '',
        examples: Array.isArray(def?.examples)
          ? def.examples.map((ex: any) => ({
              ...ex,
              id: ex?.id ? String(ex.id) : '',
            }))
          : [],
      }))
    : [],
});

export const vocabWordListMapper = (raw: any): VocabularyWordListResponse => ({
  items: Array.isArray(raw?.items) ? raw.items.map(vocabWordMapper) : [],
  meta: raw?.meta ?? {
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 0,
  },
});
