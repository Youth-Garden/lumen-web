import { EMPTY_PAGING } from '@/services/core';
import {
  CreateFolderPayload,
  CreateFlashcardPayload,
  vocabularyKeys,
  vocabularyService,
  type Folder,
} from '@/services/vocabulary';
import { studyKeys } from '@/services/study';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

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

export const useDeleteFolder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => vocabularyService.deleteFolder(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: vocabularyKeys.folders() });
      const previousFolders = queryClient.getQueryData<Folder[]>(
        vocabularyKeys.folders(),
      );

      queryClient.setQueryData<Folder[]>(vocabularyKeys.folders(), (old) => {
        if (!Array.isArray(old)) return old;
        return old.filter((f) => f.id !== id);
      });

      return { previousFolders };
    },
    onError: (_err, _id, context) => {
      if (context?.previousFolders) {
        queryClient.setQueryData(
          vocabularyKeys.folders(),
          context.previousFolders,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: vocabularyKeys.folders() });
      queryClient.invalidateQueries({ queryKey: studyKeys.dueWords() });
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
        queryKey: studyKeys.dueWords(),
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
    queryFn: () =>
      vocabularyService
        .listWords(params)
        .then((res) => res?.data ?? EMPTY_PAGING),
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

export const useFolderTopics = (
  folderId: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: vocabularyKeys.folderTopics(folderId),
    queryFn: () =>
      vocabularyService
        .getFolderTopics(folderId)
        .then((res) => res?.data ?? []),
    enabled: Boolean(folderId) && (options?.enabled ?? true),
    retry: false,
  });
};

export const useFolderWords = (
  folderId: string,
  topic?: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: vocabularyKeys.folderWords(folderId, topic),
    queryFn: () =>
      vocabularyService
        .getFolderWords(folderId, topic)
        .then((res) => res?.data ?? EMPTY_PAGING),
    enabled: Boolean(folderId) && (options?.enabled ?? true),
    retry: false,
  });
};

export const useFolderWordsInfinite = (
  folderId: string,
  topic?: string,
  options?: { enabled?: boolean },
) => {
  return useInfiniteQuery({
    queryKey: vocabularyKeys.folderWordsInfinite(folderId, topic),
    queryFn: ({ pageParam = 1 }) =>
      vocabularyService
        .getFolderWords(folderId, topic, pageParam as number, 50)
        .then((res) => res?.data ?? EMPTY_PAGING),
    getNextPageParam: (lastPage) => {
      if (!lastPage?.meta) return undefined;
      const { currentPage, totalPages = 0 } = lastPage.meta;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: Boolean(folderId) && (options?.enabled ?? true),
    retry: false,
  });
};
