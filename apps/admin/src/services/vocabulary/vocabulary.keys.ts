export const vocabularyAdminKeys = {
  all: ['admin-vocabulary'] as const,
  lists: () => [...vocabularyAdminKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...vocabularyAdminKeys.lists(), params] as const,
  detail: (id: string) => [...vocabularyAdminKeys.all, 'detail', id] as const,
};
