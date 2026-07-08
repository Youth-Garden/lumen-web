import { useQuery } from '@tanstack/react-query';
import { vocabularyService, vocabularyKeys } from '@/services/vocabulary';

export const useVocabularyWordsQuery = (params?: { search?: string; cefrLevel?: string }) => {
  return useQuery({
    queryKey: vocabularyKeys.wordList(params),
    queryFn: () => vocabularyService.listWords(params),
  });
};

export const useVocabularyWordDetailQuery = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: vocabularyKeys.wordDetail(id),
    queryFn: () => vocabularyService.getWord(id),
    enabled: options?.enabled,
  });
};

export const useVocabularyDecksQuery = () => {
  return useQuery({
    queryKey: vocabularyKeys.decks(),
    queryFn: () => vocabularyService.listDecks(),
  });
};

export const useDueFlashcardsQuery = () => {
  return useQuery({
    queryKey: vocabularyKeys.dueFlashcards(),
    queryFn: () => vocabularyService.listDueFlashcards(),
  });
};
