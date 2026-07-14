export const examPracticeKeys = {
  all: ['examPractice'] as const,
  attempts: () => [...examPracticeKeys.all, 'attempt'] as const,
  myAttempts: (page: number) =>
    [...examPracticeKeys.attempts(), 'me', page] as const,
  attemptDetail: (id: string) => [...examPracticeKeys.attempts(), id] as const,
};
