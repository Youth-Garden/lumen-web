export const vocabularyKeys = {
  all: ['admin-vocabulary'] as const,
  lists: () => [...vocabularyKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...vocabularyKeys.lists(), params] as const,
  detail: (id: string) => [...vocabularyKeys.all, 'detail', id] as const,
};
