export const toeicKeys = {
  all: ['admin-toeic'] as const,
  lists: () => [...toeicKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) =>
    [...toeicKeys.lists(), params] as const,
  detail: (id: string) => [...toeicKeys.all, 'detail', id] as const,
};
