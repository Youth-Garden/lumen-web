export const vocabularyKeys = {
  all: ['vocabulary'] as const,
  words: () => [...vocabularyKeys.all, 'words'] as const,
  wordList: (params?: Record<string, unknown>) =>
    [...vocabularyKeys.words(), 'list', params] as const,
  wordDetail: (id: string) =>
    [...vocabularyKeys.all, 'word-detail', id] as const,
  decks: () => [...vocabularyKeys.all, 'decks'] as const,
  deckDetail: (id: string) => [...vocabularyKeys.decks(), id] as const,
  dueFlashcards: (params?: Record<string, unknown>) => [...vocabularyKeys.all, 'due-flashcards', params] as const,
};
