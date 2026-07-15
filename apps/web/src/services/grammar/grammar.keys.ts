export const grammarKeys = {
  all: ['grammar'] as const,
  topics: () => [...grammarKeys.all, 'topics'] as const,
  topicDetail: (id: string) => [...grammarKeys.all, 'topics', id] as const,
  lessonExercises: (lessonId: string) =>
    [...grammarKeys.all, 'lessons', lessonId, 'exercises'] as const,
};
