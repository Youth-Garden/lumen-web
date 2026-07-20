import { ToeicQuestionDto, ToeicTestDto } from './toeic.types';

export const toeicQuestionMapper = (raw: any): ToeicQuestionDto => ({
  id: raw?.id || '',
  testId: raw?.testId || '',
  part: raw?.part ?? 0,
  questionNumber: raw?.questionNumber ?? 0,
  audioUrl: raw?.audioUrl ?? null,
  imageUrl: raw?.imageUrl ?? null,
  transcript: raw?.transcript ?? null,
  questionText: raw?.questionText ?? null,
  options: Array.isArray(raw?.options) ? raw.options : null,
  correctAnswer: raw?.correctAnswer || '',
  explanation: raw?.explanation ?? null,
});

export const toeicTestMapper = (raw: any): ToeicTestDto => ({
  id: raw?.id || '',
  title: raw?.title || '',
  description: raw?.description || null,
  isPublished: !!raw?.isPublished,
  createdAt: raw?.createdAt || '',
  questions: Array.isArray(raw?.questions)
    ? raw.questions.map(toeicQuestionMapper)
    : [],
});

export const toeicTestListItemMapper = (
  raw: any,
): Omit<ToeicTestDto, 'questions'> => ({
  id: raw?.id || '',
  title: raw?.title || '',
  description: raw?.description || null,
  isPublished: !!raw?.isPublished,
  createdAt: raw?.createdAt || '',
});
