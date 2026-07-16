
import type {
  ToeicTestDto,
  ToeicTestListResponse,
  ToeicTestListItem,
  ToeicQuestionDto,
} from './toeic.types';

export const toeicQuestionMapper = (raw: any): ToeicQuestionDto => ({
  ...raw,
  id: raw?.id ? String(raw.id) : '',
  audioUrl: raw?.audioUrl ?? null,
  imageUrl: raw?.imageUrl ?? null,
  explanation: raw?.explanation ?? null,
  options: Array.isArray(raw?.options) ? raw.options : [],
});

export const toeicTestMapper = (raw: any): ToeicTestDto => ({
  ...raw,
  id: raw?.id ? String(raw.id) : '',
  description: raw?.description ?? null,
  questions: Array.isArray(raw?.questions)
    ? raw.questions.map(toeicQuestionMapper)
    : [],
});

export const toeicTestListItemMapper = (raw: any): ToeicTestListItem => ({
  ...raw,
  id: raw?.id ? String(raw.id) : '',
  description: raw?.description ?? null,
});

export const toeicTestListMapper = (raw: any): ToeicTestListResponse => ({
  items: Array.isArray(raw?.items)
    ? raw.items.map(toeicTestListItemMapper)
    : [],
  meta: raw?.meta ?? {
    currentPage: 1,
    perPage: 10,
    totalItems: 0,
    totalPages: 0,
  },
});
