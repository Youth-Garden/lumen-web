export interface AdminVocabularyWord {
  id: string;
  term: string;
  phonetic: string | null;
  audioUrl: string | null;
  cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | null;
  definitions: Array<{
    id: string;
    partOfSpeech: string;
    definitionEn: string;
    translationVi: string;
    examples: Array<{ id: string; sentenceEn: string; translationVi: string }>;
  }>;
}

export interface VocabularyWordListResponse {
  items: AdminVocabularyWord[];
  meta: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface CreateVocabularyWordPayload {
  term: string;
  phonetic?: string;
  cefrLevel?: string;
  definitions: Array<{
    partOfSpeech: string;
    definitionEn: string;
    translationVi: string;
    examples?: Array<{ sentenceEn: string; translationVi: string }>;
  }>;
}

export type UpdateVocabularyWordPayload = Partial<CreateVocabularyWordPayload>;
