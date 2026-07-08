export const materialKeys = {
  all: ['materials'] as const,
  lists: () => [...materialKeys.all, 'list'] as const,
  list: (params?: Record<string, unknown>) => [...materialKeys.lists(), params] as const,
  detail: (id: string) => [...materialKeys.all, 'detail', id] as const,
};
