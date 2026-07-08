export const toeicKeys = {
  all: ['toeic'] as const,
  lists: () => [...toeicKeys.all, 'list'] as const,
  details: () => [...toeicKeys.all, 'detail'] as const,
  detail: (id: string) => [...toeicKeys.details(), id] as const,
};
