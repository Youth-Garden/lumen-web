export const speakingKeys = {
  all: ['speaking'] as const,
  tasks: () => [...speakingKeys.all, 'tasks'] as const,
  taskDetail: (id: string) => [...speakingKeys.all, 'tasks', id] as const,
};
