import { useMutation, useQueryClient } from '@tanstack/react-query';
import { vocabularyService, vocabularyKeys } from '@/services/vocabulary';
import { CreateDeckPayload, CreateFlashcardPayload, ReviewFlashcardPayload } from '@/services/vocabulary';

export const useCreateDeckMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateDeckPayload) => vocabularyService.createDeck(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.decks() });
    },
  });
};

export const useCreateFlashcardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFlashcardPayload) => vocabularyService.createFlashcard(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.decks() });
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.dueFlashcards() });
    },
  });
};

export const useReviewFlashcardMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewFlashcardPayload) => vocabularyService.reviewFlashcard(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.dueFlashcards() });
    },
  });
};
