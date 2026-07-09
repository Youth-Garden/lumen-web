import { MaterialDto, DictationResultDto, TranscriptDto } from './material.types';

export const transcriptMapper = (raw: any): TranscriptDto => ({
  id: raw?.id || '',
  materialId: raw?.materialId || '',
  order: raw?.order ?? 0,
  startTime: raw?.startTime ?? 0,
  endTime: raw?.endTime ?? 0,
  textEn: raw?.textEn || '',
  textVi: raw?.textVi || '',
});

export const materialMapper = (raw: any): MaterialDto => ({
  id: raw?.id || '',
  title: raw?.title || '',
  description: raw?.description || '',
  sourceUrl: raw?.sourceUrl || '',
  type: raw?.type || 'TEXT',
  difficultyLevel: raw?.difficultyLevel || '',
  category: raw?.category || '',
  tags: Array.isArray(raw?.tags) ? raw.tags : [],
  transcripts: Array.isArray(raw?.transcripts) ? raw.transcripts.map(transcriptMapper) : [],
});

export const materialListMapper = (raw: any): MaterialDto[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map(materialMapper);
};

export const dictationResultMapper = (raw: any): DictationResultDto => ({
  materialId: raw?.materialId || '',
  score: raw?.score || 0,
  results: Array.isArray(raw?.results) ? raw.results.map((result: any) => ({
    transcriptId: result?.transcriptId || '',
    userInput: result?.userInput || '',
    correctAnswer: result?.correctAnswer || '',
    isCorrect: Boolean(result?.isCorrect),
    diff: result?.diff || null,
  })) : [],
});
