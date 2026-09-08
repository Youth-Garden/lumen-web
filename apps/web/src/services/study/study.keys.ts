export const studyKeys = {
  all: ['study'] as const,
  dueFlashcards: (params?: Record<string, unknown>) =>
    [...studyKeys.all, 'due-flashcards', params] as const,
};
