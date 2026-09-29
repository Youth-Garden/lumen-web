export const studyKeys = {
  all: ['study'] as const,
  dueWords: (params?: Record<string, unknown>) =>
    [...studyKeys.all, 'due-words', params] as const,
};
