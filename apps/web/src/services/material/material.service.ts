import { WebApiService } from '../core';
import { BaseResponse } from '@lumen/shared-api';

export interface TranscriptDto {
  id: string;
  materialId: string;
  order: number;
  startTime: number;
  endTime: number;
  textEn: string;
  textVi: string;
}

export interface MaterialDto {
  id: string;
  title: string;
  description: string;
  sourceUrl: string;
  type: 'VIDEO' | 'AUDIO' | 'TEXT';
  difficultyLevel: string;
  category: string;
  tags: string[];
  transcripts: TranscriptDto[];
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

class MaterialService extends WebApiService {
  async getMaterials(params?: {
    type?: string;
    category?: string;
    difficultyLevel?: string;
  }): Promise<BaseResponse<MaterialDto[]>> {
    return this._get<MaterialDto[]>('/materials', params);
  }

  async getMaterialById(id: string): Promise<BaseResponse<MaterialDto>> {
    return this._get<MaterialDto>(`/materials/${id}`);
  }

  async submitDictation(
    data: DictationSubmissionDto,
  ): Promise<BaseResponse<DictationResultDto>> {
    return this._post<DictationResultDto>('/materials/dictation', data);
  }
}

export const materialService = new MaterialService();
