export const examPracticeKeys = {
  all: ['examPractice'] as const,
  attempts: () => [...examPracticeKeys.all, 'attempt'] as const,
  attemptDetail: (id: string) => [...examPracticeKeys.attempts(), id] as const,
};
