import { progressKeys } from '@/services/progress';
import {
  studyService,
  studyKeys,
  type BatchReviewFlashcardsPayload,
  type DueWord,
  type ReviewFlashcardPayload,
} from '@/services/study';
import { vocabularyKeys, type FolderWordsPage } from '@/services/vocabulary';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useReviewFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ReviewFlashcardPayload) =>
      studyService.reviewFlashcard(payload),
    onMutate: async (payload: ReviewFlashcardPayload) => {
      await queryClient.cancelQueries({ queryKey: vocabularyKeys.all });
      await queryClient.cancelQueries({ queryKey: studyKeys.all });

      let newLevel: number | undefined;
      let newStep: number | undefined;

      if (payload.isResetToUnlearned) {
        newLevel = 0;
        newStep = 0;
      } else if (payload.isFastTrackKnown) {
        newLevel = 6;
        newStep = 6;
      } else if (payload.isFastTrackTempMemory) {
        newLevel = 3;
        newStep = 3;
      }

      if (newLevel !== undefined) {
        queryClient.setQueriesData<FolderWordsPage>(
          { queryKey: vocabularyKeys.folders() },
          (old) => {
            if (!old || !Array.isArray(old.items)) return old;
            return {
              ...old,
              items: old.items.map((item) => {
                if (
                  item.flashcardId === payload.flashcardId ||
                  item.id === payload.flashcardId ||
                  item.wordId === payload.flashcardId
                ) {
                  return {
                    ...item,
                    level: newLevel,
                    learningStep: newStep ?? item.learningStep,
                    isWilted: false,
                  };
                }
                return item;
              }),
            };
          },
        );

        queryClient.setQueriesData<DueWord[]>(
          { queryKey: studyKeys.all },
          (old) => {
            if (!Array.isArray(old)) return old;
            return old.filter(
              (item) =>
                item.flashcardId !== payload.flashcardId &&
                item.wordId !== payload.flashcardId,
            );
          },
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studyKeys.dueWords(),
      });
      queryClient.invalidateQueries({
        queryKey: vocabularyKeys.all,
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
        queryKey: studyKeys.dueWords(),
      });
      queryClient.invalidateQueries({
        queryKey: vocabularyKeys.all,
      });
      queryClient.invalidateQueries({
        queryKey: progressKeys.all,
      });
    },
  });
};

export const useDueWords = (
  params?: {
    folderId?: string;
    limit?: number;
    page?: number;
    includeNew?: boolean;
  },
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: studyKeys.dueWords(params),
    queryFn: () => studyService.listDueWords(params),
    retry: false,
    ...options,
  });
};
