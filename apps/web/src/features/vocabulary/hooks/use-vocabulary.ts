import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { vocabularyService, vocabularyKeys } from '@/services/vocabulary';
import {
  CreateDeckPayload,
  CreateFlashcardPayload,
  ReviewFlashcardPayload,
} from '@/services/vocabulary';

export const useCreateDeck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDeckPayload) =>
      vocabularyService.createDeck(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.decks() });
    },
  });
};

export const useCreateFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFlashcardPayload) =>
      vocabularyService.createFlashcard(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.decks() });
      queryClient.invalidateQueries({
        queryKey: vocabularyKeys.dueFlashcards(),
      });
    },
  });
};

export const useReviewFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewFlashcardPayload) =>
      vocabularyService.reviewFlashcard(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: vocabularyKeys.dueFlashcards(),
      });
    },
  });
};

export const useVocabularyWords = (
  params?: {
    search?: string;
    cefrLevel?: string;
  },
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: vocabularyKeys.wordList(params),
    queryFn: () => vocabularyService.listWords(params).then((res) => res.data),
    ...options,
  });
};

export const useVocabularyWordDetail = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: vocabularyKeys.wordDetail(id),
    queryFn: () => vocabularyService.getWord(id),
    enabled: options?.enabled,
  });
};

export const useVocabularyDecks = () => {
  return useQuery({
    queryKey: vocabularyKeys.decks(),
    queryFn: () => vocabularyService.listDecks(),
  });
};

export const useVocabularyDeck = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: vocabularyKeys.deckDetail(id),
    queryFn: () => vocabularyService.getDeck(id).then(res => res.data),
    enabled: options?.enabled,
  });
};

export const useDueFlashcards = (params?: { deckId?: string; limit?: number }) => {
  return useQuery({
    queryKey: vocabularyKeys.dueFlashcards(params),
    queryFn: () => vocabularyService.listDueFlashcards(params),
  });
};
