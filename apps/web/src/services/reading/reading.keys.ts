export const readingKeys = {
  all: ['reading'] as const,
  lists: () => [...readingKeys.all, 'list'] as const,
  list: (filters: { page: number; limit: number }) => [...readingKeys.lists(), filters] as const,
  details: () => [...readingKeys.all, 'detail'] as const,
  detail: (id: string) => [...readingKeys.details(), id] as const,
};
