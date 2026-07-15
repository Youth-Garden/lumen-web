import { CefrLevelEnum } from '@/shared/types';

export enum MaterialTypeEnum {
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
}

export interface TranscriptDto {
  id: string;
  sequenceNumber: number;
  text: string;
  translation: string | undefined;
  startTime: number | undefined;
  endTime: number | undefined;
}

export interface MaterialDto {
  id: string;
  title: string;
  type: MaterialTypeEnum;
  transcripts: TranscriptDto[];
  description: string | undefined;
  mediaUrl: string | undefined;
  thumbnailUrl: string | undefined;
  level: CefrLevelEnum | undefined;
  tags: string[] | undefined;
  duration: number | undefined;
}

export interface MaterialListDto {
  items: Omit<MaterialDto, 'transcripts'>[];
  total: number;
}

export interface DictationSubmissionDto {
  materialId: string;
  answers: {
    transcriptId: string;
    userInput: string;
  }[];
}

export interface DictationResultDto {
  materialId: string;
  score: number;
  results: {
    transcriptId: string;
    userInput: string;
    correctAnswer: string;
    isCorrect: boolean;
    diff: string | null;
  }[];
}
