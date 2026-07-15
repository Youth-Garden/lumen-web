import {
  DictationResultDto,
  MaterialDto,
  MaterialTypeEnum,
  TranscriptDto,
} from './material.types';
import { CefrLevelEnum } from '@/shared/types';

export const transcriptMapper = (raw: any): TranscriptDto => ({
  id: raw?.id || '',
  sequenceNumber: raw?.sequenceNumber ?? 0,
  startTime: raw?.startTime ?? undefined,
  endTime: raw?.endTime ?? undefined,
  text: raw?.text || '',
  translation: raw?.translation || undefined,
});

export const materialMapper = (raw: any): MaterialDto => ({
  id: raw?.id || '',
  title: raw?.title || '',
  description: raw?.description || undefined,
  mediaUrl: raw?.mediaUrl || undefined,
  thumbnailUrl: raw?.thumbnailUrl || undefined,
  type: (raw?.type as MaterialTypeEnum) || MaterialTypeEnum.TEXT,
  level: (raw?.level as CefrLevelEnum) || undefined,
  tags: Array.isArray(raw?.tags) ? raw.tags : undefined,
  duration: raw?.duration || undefined,
  transcripts: Array.isArray(raw?.transcripts)
    ? raw.transcripts.map(transcriptMapper)
    : [],
});

export const materialListMapper = (raw: any): MaterialDto[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map(materialMapper);
};

export const dictationResultMapper = (raw: any): DictationResultDto => ({
  materialId: raw?.materialId || '',
  score: raw?.score || 0,
  results: Array.isArray(raw?.results)
    ? raw.results.map((result: any) => ({
        transcriptId: result?.transcriptId || '',
        userInput: result?.userInput || '',
        correctAnswer: result?.correctAnswer || '',
        isCorrect: Boolean(result?.isCorrect),
        diff: result?.diff || null,
      }))
    : [],
});
