import {
  AdaptiveDrillQuestion,
  AdaptiveDrillResponse,
  AttemptHistoryResponse,
  AttemptSummary,
  ExamAttemptDetailResponse,
  ExamAttemptMode,
  ExamAttemptStatus,
  ExamType,
  PartMastery,
  WeaknessAnalysisResponse,
  WeaknessLevelEnum,
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
    ? (raw.answers as Record<string, unknown>[]).map((rawAnswer) => ({
        questionId: String(rawAnswer?.questionId ?? ''),
        userAnswer: String(rawAnswer?.userAnswer ?? ''),
        isCorrect:
          typeof rawAnswer?.isCorrect === 'boolean'
            ? rawAnswer.isCorrect
            : undefined,
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

export const weaknessAnalysisMapper = (
  raw: Record<string, unknown>,
): WeaknessAnalysisResponse => {
  const masteriesRaw = Array.isArray(raw?.partMasteries)
    ? raw.partMasteries
    : [];
  const partMasteries: PartMastery[] = masteriesRaw.map(
    (item: Record<string, unknown>) => ({
      partNumber: Number(item.partNumber ?? 1),
      name: String(item.name ?? ''),
      totalAttempted: Number(item.totalAttempted ?? 0),
      correctCount: Number(item.correctCount ?? 0),
      accuracyPercentage: Number(item.accuracyPercentage ?? 0),
      weaknessLevel:
        (item.weaknessLevel as WeaknessLevelEnum) ??
        WeaknessLevelEnum.NEEDS_PRACTICE,
    }),
  );

  const recommendedPartNumbers = Array.isArray(raw?.recommendedPartNumbers)
    ? (raw.recommendedPartNumbers as number[])
    : [];

  return {
    partMasteries,
    recommendedPartNumbers,
    overallAccuracy: Number(raw?.overallAccuracy ?? 0),
  };
};

export const adaptiveDrillMapper = (
  raw: Record<string, unknown>,
): AdaptiveDrillResponse => {
  const questionsRaw = Array.isArray(raw?.questions) ? raw.questions : [];
  const questions: AdaptiveDrillQuestion[] = questionsRaw.map(
    (rawQuestion: Record<string, unknown>) => ({
      questionId: String(rawQuestion.questionId ?? ''),
      partNumber: Number(rawQuestion.partNumber ?? 5),
      prompt: String(rawQuestion.prompt ?? ''),
      options: Array.isArray(rawQuestion.options)
        ? (rawQuestion.options as string[])
        : [],
      explanation: rawQuestion.explanation
        ? String(rawQuestion.explanation)
        : undefined,
    }),
  );

  return {
    drillId: String(raw?.drillId ?? ''),
    title: String(raw?.title ?? ''),
    targetPartNumbers: Array.isArray(raw?.targetPartNumbers)
      ? (raw.targetPartNumbers as number[])
      : [],
    estimatedMinutes: Number(raw?.estimatedMinutes ?? 5),
    questions,
  };
};
