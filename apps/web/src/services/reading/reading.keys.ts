export const readingKeys = {
  all: ['reading'] as const,
  lists: () => [...readingKeys.all, 'list'] as const,
  list: (filters: { page: number; limit: number }) =>
    [...readingKeys.lists(), filters] as const,
  publicLists: () => [...readingKeys.all, 'public-list'] as const,
  publicList: (filters: { page: number; limit: number }) =>
    [...readingKeys.publicLists(), filters] as const,
  details: () => [...readingKeys.all, 'detail'] as const,
  detail: (id: string) => [...readingKeys.details(), id] as const,
};
