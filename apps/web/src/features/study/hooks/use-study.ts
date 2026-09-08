import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  studyService,
  studyKeys,
  type ReviewFlashcardPayload,
} from '@/services/study';

export const useReviewFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewFlashcardPayload) =>
      studyService.reviewFlashcard(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studyKeys.dueFlashcards(),
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
