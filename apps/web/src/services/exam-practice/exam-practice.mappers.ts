import {
  AttemptHistoryResponse,
  AttemptSummary,
  ExamAttemptDetailResponse,
  ExamAttemptMode,
  ExamAttemptStatus,
  ExamType,
} from './exam-practice.types';

export const examAttemptDetailMapper = (
  raw: Record<string, unknown>,
): ExamAttemptDetailResponse => ({
  id: String(raw?.id ?? ''),
  testId: String(raw?.testId ?? ''),
  userId: String(raw?.userId ?? ''),
  testType: (raw?.testType as ExamType) ?? ExamType.TOEIC,
  status: (raw?.status as ExamAttemptStatus) ?? ExamAttemptStatus.COMPLETED,
  listeningScore: Number(raw?.listeningScore ?? 0),
  readingScore: Number(raw?.readingScore ?? 0),
  totalScore: Number(raw?.totalScore ?? 0),
  startedAt: String(raw?.startedAt ?? ''),
  completedAt: raw?.completedAt ? String(raw.completedAt) : undefined,
  mode: (raw?.mode as ExamAttemptMode) ?? ExamAttemptMode.FULL,
  elapsedSeconds: Number(raw?.elapsedSeconds ?? 0),
  customTimeLimit: raw?.customTimeLimit
    ? Number(raw.customTimeLimit)
    : undefined,
  questionIds: Array.isArray(raw?.questionIds)
    ? (raw!.questionIds as string[])
    : undefined,
  answers: Array.isArray(raw?.answers)
    ? (raw.answers as Record<string, unknown>[]).map((ans) => ({
        questionId: String(ans?.questionId ?? ''),
        userAnswer: String(ans?.userAnswer ?? ''),
        isCorrect:
          typeof ans?.isCorrect === 'boolean' ? ans.isCorrect : undefined,
      }))
    : [],
});

export const attemptSummaryMapper = (
  raw: Record<string, unknown>,
): AttemptSummary => ({
  id: String(raw?.id ?? ''),
  testId: String(raw?.testId ?? ''),
  testType: (raw?.testType as ExamType) ?? ExamType.TOEIC,
  status: (raw?.status as ExamAttemptStatus) ?? ExamAttemptStatus.IN_PROGRESS,
  mode: (raw?.mode as ExamAttemptMode) ?? ExamAttemptMode.FULL,
  listeningScore: Number(raw?.listeningScore ?? 0),
  readingScore: Number(raw?.readingScore ?? 0),
  totalScore: Number(raw?.totalScore ?? 0),
  startedAt: String(raw?.startedAt ?? ''),
  completedAt: raw?.completedAt ? String(raw.completedAt) : undefined,
  totalAnswered: Number(raw?.totalAnswered ?? 0),
  totalCorrect: Number(raw?.totalCorrect ?? 0),
});

export const attemptHistoryMapper = (
  raw: Record<string, unknown>,
): AttemptHistoryResponse => ({
  items: Array.isArray(raw?.items)
    ? (raw.items as Record<string, unknown>[]).map(attemptSummaryMapper)
    : [],
  paging: {
    offset: Number((raw?.paging as Record<string, unknown>)?.offset ?? 1),
    limit: Number((raw?.paging as Record<string, unknown>)?.limit ?? 10),
    total: Number((raw?.paging as Record<string, unknown>)?.total ?? 0),
  },
});
