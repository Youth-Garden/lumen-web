import {
  QuizDetailResponseDto,
  QuestionDetailDto,
  QuizListItemDto,
  GenerateQuizResponseDto,
  FinishQuizResponseDto,
} from './quiz.types';

export const questionDetailMapper = (raw: any): QuestionDetailDto => ({
  id: raw?.id || '',
  type: raw?.type || '',
  questionText: raw?.questionText || '',
  options: Array.isArray(raw?.options) ? raw.options : [],
  userAnswer: raw?.userAnswer ?? undefined,
  correctAnswer: raw?.correctAnswer ?? undefined,
  isCorrect: raw?.isCorrect ?? undefined,
});

export const quizDetailMapper = (raw: any): QuizDetailResponseDto => ({
  id: raw?.id || '',
  status: raw?.status || '',
  score: raw?.score ?? 0,
  questions: Array.isArray(raw?.questions)
    ? raw.questions.map(questionDetailMapper)
    : [],
  createdAt: raw?.createdAt || '',
  completedAt: raw?.completedAt ?? undefined,
});

export const quizListItemMapper = (raw: any): QuizListItemDto => ({
  id: raw?.id || '',
  status: raw?.status || '',
  score: raw?.score ?? 0,
  createdAt: raw?.createdAt || '',
  completedAt: raw?.completedAt ?? undefined,
});

export const finishQuizResponseMapper = (raw: any): FinishQuizResponseDto => ({
  score: raw?.score || 0,
});
