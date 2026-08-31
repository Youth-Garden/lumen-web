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
  const validId = id && id !== 'undefined' ? id : '';
  return useQuery({
    queryKey: vocabularyKeys.wordDetail(validId),
    queryFn: () => vocabularyService.getWord(validId),
    enabled: options?.enabled && Boolean(validId),
  });
};

export const useVocabularyDecks = () => {
  return useQuery({
    queryKey: vocabularyKeys.decks(),
    queryFn: () => vocabularyService.listDecks(),
  });
};

export const useVocabularyDeck = (id: string, options?: { enabled?: boolean }) => {
  const validId = id && id !== 'undefined' ? id : '';
  const isEnabled = options?.enabled !== undefined ? options.enabled : Boolean(validId);

  return useQuery({
    queryKey: vocabularyKeys.deckDetail(validId),
    queryFn: () => vocabularyService.getDeck(validId).then((res) => res?.data),
    enabled: isEnabled,
  });
};

export const useDueFlashcards = (params?: { deckId?: string; limit?: number }) => {
  let cleanParams: { deckId?: string; limit?: number } | undefined = undefined;

  if (params) {
    cleanParams = { ...params };
    if (cleanParams.deckId === 'undefined' || cleanParams.deckId === undefined) {
      delete cleanParams.deckId;
    }
  }

  const isEnabled = params?.deckId
    ? Boolean(params.deckId && params.deckId !== 'undefined')
    : true;

  return useQuery({
    queryKey: vocabularyKeys.dueFlashcards(cleanParams),
    queryFn: () => vocabularyService.listDueFlashcards(cleanParams),
    enabled: isEnabled,
  });
};
