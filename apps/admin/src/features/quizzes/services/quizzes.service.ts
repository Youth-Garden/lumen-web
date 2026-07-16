import { CoreService } from '@/services/core';
import type { BaseResponse } from '@lumen/shared-api';
import type {
  PresetQuiz,
  PresetQuizListResponse,
  CreatePresetQuizDto,
  UpdatePresetQuizDto,
} from '../types';

export class QuizzesService extends CoreService {
  getQuizzes(page = 1, limit = 20): Promise<BaseResponse<PresetQuizListResponse>> {
    return this._get<PresetQuizListResponse>('/admin/quizzes', {
      params: { page, limit },
    });
  }

  getQuizById(id: string): Promise<BaseResponse<PresetQuiz>> {
    return this._get<PresetQuiz>(`/admin/quizzes/${id}`);
  }

  createQuiz(data: CreatePresetQuizDto): Promise<BaseResponse<{ id: string }>> {
    return this._post<{ id: string }>('/admin/quizzes', data);
  }

  updateQuiz(id: string, data: UpdatePresetQuizDto): Promise<BaseResponse<void>> {
    return this._put<void>(`/admin/quizzes/${id}`, data);
  }

  deleteQuiz(id: string): Promise<BaseResponse<void>> {
    return this._delete<void>(`/admin/quizzes/${id}`);
  }
}

export const quizzesService = QuizzesService.getInstance();
