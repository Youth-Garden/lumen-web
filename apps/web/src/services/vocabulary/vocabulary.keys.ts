export const vocabularyKeys = {
  all: ['vocabulary'] as const,
  words: () => [...vocabularyKeys.all, 'words'] as const,
  wordList: (params?: Record<string, unknown>) =>
    [...vocabularyKeys.words(), 'list', params] as const,
  wordDetail: (id: string) =>
    [...vocabularyKeys.all, 'word-detail', id] as const,
  folders: () => [...vocabularyKeys.all, 'folders'] as const,
  folderDetail: (id: string) => [...vocabularyKeys.folders(), id] as const,
  folderTopics: (id: string) =>
    [...vocabularyKeys.folders(), id, 'topics'] as const,
  folderFlashcards: (id: string, topic?: string) =>
    [...vocabularyKeys.folders(), id, 'flashcards', topic] as const,
  overview: () => [...vocabularyKeys.all, 'overview'] as const,
};
