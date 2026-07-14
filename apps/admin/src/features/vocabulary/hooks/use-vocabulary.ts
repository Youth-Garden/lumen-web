import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { vocabularyService, vocabularyKeys } from '@/services/vocabulary';
import type {
  CreateVocabularyWordPayload,
  UpdateVocabularyWordPayload,
} from '@/services/vocabulary';

export const useCreateVocabularyWord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateVocabularyWordPayload) =>
      vocabularyService.createWord(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.lists() });
    },
  });
};

export const useUpdateVocabularyWord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateVocabularyWordPayload;
    }) => vocabularyService.updateWord(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: vocabularyKeys.detail(id),
      });
    },
  });
};

export const useDeleteVocabularyWord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vocabularyService.deleteWord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.lists() });
    },
  });
};

export const useVocabularyWords = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  cefrLevel?: string;
}) => {
  return useQuery({
    queryKey: vocabularyKeys.list(params),
    queryFn: () => vocabularyService.listWords(params),
  });
};

export const useVocabularyWordDetail = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: vocabularyKeys.detail(id),
    queryFn: () => vocabularyService.getWordById(id),
    enabled: options?.enabled ?? Boolean(id),
  });
};
