import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { progressKeys } from '@/services/progress';
import {
  studyService,
  studyKeys,
  type BatchReviewFlashcardsPayload,
  type ReviewFlashcardPayload,
} from '@/services/study';
import { vocabularyKeys } from '@/services/vocabulary';

export const useReviewFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewFlashcardPayload) =>
      studyService.reviewFlashcard(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studyKeys.dueFlashcards(),
      });
      queryClient.invalidateQueries({
        queryKey: vocabularyKeys.folders(),
      });
      queryClient.invalidateQueries({
        queryKey: vocabularyKeys.words(),
      });
      queryClient.invalidateQueries({
        queryKey: vocabularyKeys.overview(),
      });
      queryClient.invalidateQueries({
        queryKey: progressKeys.all,
      });
    },
  });
};

export const useBatchReviewFlashcards = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: BatchReviewFlashcardsPayload) =>
      studyService.batchReviewFlashcards(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studyKeys.dueFlashcards(),
      });
      queryClient.invalidateQueries({
        queryKey: vocabularyKeys.folders(),
      });
      queryClient.invalidateQueries({
        queryKey: vocabularyKeys.words(),
      });
      queryClient.invalidateQueries({
        queryKey: vocabularyKeys.overview(),
      });
      queryClient.invalidateQueries({
        queryKey: progressKeys.all,
      });
    },
  });
};

export const useDueFlashcards = (
  params?: {
    folderId?: string;
    limit?: number;
  },
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: studyKeys.dueFlashcards(params),
    queryFn: () => studyService.listDueFlashcards(params),
    retry: false,
    ...options,
  });
};
