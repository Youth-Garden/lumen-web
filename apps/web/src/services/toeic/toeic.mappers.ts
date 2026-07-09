import {
  ToeicQuestionDto,
  ToeicTestDto,
  ToeicTestListResponse,
} from './toeic.types';

export const toeicQuestionMapper = (raw: any): ToeicQuestionDto => ({
  id: raw?.id || '',
  part: raw?.part ?? 0,
  questionNumber: raw?.questionNumber ?? 0,
  audioUrl: raw?.audioUrl ?? undefined,
  imageUrl: raw?.imageUrl ?? undefined,
  questionText: raw?.questionText ?? undefined,
  options: Array.isArray(raw?.options) ? raw.options : [],
});

export const toeicTestMapper = (raw: any): ToeicTestDto => ({
  id: raw?.id || '',
  title: raw?.title || '',
  description: raw?.description || undefined,
  questions: Array.isArray(raw?.questions) ? raw.questions.map(toeicQuestionMapper) : [],
});

export const toeicTestListItemMapper = (raw: any): Omit<ToeicTestDto, 'questions'> => ({
  id: raw?.id || '',
  title: raw?.title || '',
  description: raw?.description || undefined,
});

export const toeicTestListMapper = (raw: any): ToeicTestListResponse => ({
  items: Array.isArray(raw?.items) ? raw.items.map(toeicTestListItemMapper) : [],
  total: raw?.total || 0,
});
