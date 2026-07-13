import {
  ExamAttemptDetailResponse,
  ExamAttemptStatus,
  ExamType,
} from './exam-practice.types';

export const examAttemptDetailMapper = (
  raw: any,
): ExamAttemptDetailResponse => ({
  id: raw?.id || '',
  testId: raw?.testId || '',
  userId: raw?.userId || '',
  testType: (raw?.testType as ExamType) || ExamType.TOEIC,
  status: (raw?.status as ExamAttemptStatus) || ExamAttemptStatus.COMPLETED,
  listeningScore: raw?.listeningScore || 0,
  readingScore: raw?.readingScore || 0,
  totalScore: raw?.totalScore || 0,
  startedAt: raw?.startedAt || '',
  completedAt: raw?.completedAt || null,
  answers: Array.isArray(raw?.answers)
    ? raw.answers.map((ans: any) => ({
        questionId: ans?.questionId || '',
        userAnswer: ans?.userAnswer || '',
        isCorrect: typeof ans?.isCorrect === 'boolean' ? ans.isCorrect : null,
      }))
    : [],
});
