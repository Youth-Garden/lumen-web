import { api } from '@/shared/services/api';
import { PresetQuiz, PresetQuizListResponse, CreatePresetQuizDto, UpdatePresetQuizDto } from '../types';

export const quizzesService = {
  getQuizzes: async (page = 1, limit = 20) => {
    const res = await api.get<PresetQuizListResponse>('/admin/quizzes', {
      params: { page, limit },
    });
    return res.data;
  },

  getQuizById: async (id: string) => {
    const res = await api.get<PresetQuiz>(`/admin/quizzes/${id}`);
    return res.data;
  },

  createQuiz: async (data: CreatePresetQuizDto) => {
    const res = await api.post<{ id: string }>('/admin/quizzes', data);
    return res.data;
  },

  updateQuiz: async (id: string, data: UpdatePresetQuizDto) => {
    const res = await api.put(`/admin/quizzes/${id}`, data);
    return res.data;
  },

  deleteQuiz: async (id: string) => {
    const res = await api.delete(`/admin/quizzes/${id}`);
    return res.data;
  },
};
