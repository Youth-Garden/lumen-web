export const vocabularyKeys = {
  all: ['vocabulary'] as const,
  words: () => [...vocabularyKeys.all, 'words'] as const,
  wordList: (params?: Record<string, unknown>) =>
    [...vocabularyKeys.words(), 'list', params] as const,
  wordDetail: (id: string) =>
    [...vocabularyKeys.all, 'word-detail', id] as const,
  decks: () => [...vocabularyKeys.all, 'decks'] as const,
  dueFlashcards: () => [...vocabularyKeys.all, 'due-flashcards'] as const,
};
