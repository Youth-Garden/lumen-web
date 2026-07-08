export const toeicAdminKeys = {
  all: ['admin-toeic'] as const,
  lists: () => [...toeicAdminKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...toeicAdminKeys.lists(), params] as const,
  detail: (id: string) => [...toeicAdminKeys.all, 'detail', id] as const,
};
