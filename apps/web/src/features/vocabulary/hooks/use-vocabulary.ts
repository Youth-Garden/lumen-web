import {
  CreateFolderPayload,
  CreateFlashcardPayload,
  vocabularyKeys,
  vocabularyService,
} from '@/services/vocabulary';
import { studyKeys } from '@/services/study';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCreateFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFolderPayload) =>
      vocabularyService.createFolder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.folders() });
    },
  });
};

export const useCreateFlashcard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFlashcardPayload) =>
      vocabularyService.createFlashcard(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.folders() });
      queryClient.invalidateQueries({
        queryKey: studyKeys.dueFlashcards(),
      });
    },
  });
};

export const useVocabularyWords = (
  params?: {
    page?: number;
    limit?: number;
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
    ...options,
  });
};

export const useVocabularyFolders = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: vocabularyKeys.folders(),
    queryFn: () => vocabularyService.listFolders(),
    retry: false,
    ...options,
  });
};

export const useVocabularyFolderDetail = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: vocabularyKeys.folderDetail(id),
    queryFn: () => vocabularyService.getFolder(id).then((res) => res?.data),
    retry: false,
    ...options,
  });
};
