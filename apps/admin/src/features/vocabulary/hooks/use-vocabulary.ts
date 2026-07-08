import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { vocabularyAdminService, vocabularyAdminKeys } from '@/services/vocabulary';
import type { CreateVocabularyWordPayload, UpdateVocabularyWordPayload } from '@/services/vocabulary';

export const useCreateVocabularyWord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateVocabularyWordPayload) => vocabularyAdminService.createWord(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyAdminKeys.lists() });
    },
  });
};

export const useUpdateVocabularyWord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateVocabularyWordPayload }) =>
      vocabularyAdminService.updateWord(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: vocabularyAdminKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vocabularyAdminKeys.detail(id) });
    },
  });
};

export const useDeleteVocabularyWord = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vocabularyAdminService.deleteWord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyAdminKeys.lists() });
    },
  });
};

export const useVocabularyWords = (params?: { page?: number; limit?: number; search?: string; cefrLevel?: string }) => {
  return useQuery({
    queryKey: vocabularyAdminKeys.list(params),
    queryFn: () => vocabularyAdminService.listWords(params),
  });
};

export const useVocabularyWordDetail = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: vocabularyAdminKeys.detail(id),
    queryFn: () => vocabularyAdminService.getWordById(id),
    enabled: options?.enabled ?? Boolean(id),
  });
};