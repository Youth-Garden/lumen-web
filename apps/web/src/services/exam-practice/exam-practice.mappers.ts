import { ExamAttemptDetailResponse } from './exam-practice.types';

export const examAttemptDetailMapper = (
  raw: any,
): ExamAttemptDetailResponse => ({
  id: raw?.id || '',
  testId: raw?.testId || '',
  userId: raw?.userId || '',
  totalScore: raw?.totalScore || 0,
  status: raw?.status || 'PENDING',
  answers: Array.isArray(raw?.answers)
    ? raw.answers.map((ans: any) => ({
        questionId: ans?.questionId || '',
        userAnswer: ans?.userAnswer || '',
        isCorrect: !!ans?.isCorrect,
      }))
    : [],
});
