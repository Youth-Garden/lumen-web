import {
  CreateFolderPayload,
  CreateFlashcardPayload,
  ReviewFlashcardPayload,
  vocabularyKeys,
  vocabularyService,
} from '@/services/vocabulary';
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

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
  const isUuid = UUID_REGEX.test(id);
  const validId = id && id !== 'undefined' && isUuid ? id : '';
  return useQuery({
    queryKey: vocabularyKeys.wordDetail(validId),
    queryFn: () => vocabularyService.getWord(validId),
    enabled: options?.enabled && Boolean(validId),
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
  const isUuid = UUID_REGEX.test(id);
  const validId = id && id !== 'undefined' && isUuid ? id : '';
  const isEnabled =
    options?.enabled !== undefined
      ? options.enabled && Boolean(validId)
      : Boolean(validId);

  return useQuery({
    queryKey: vocabularyKeys.folderDetail(validId),
    queryFn: () => vocabularyService.getFolder(validId).then((res) => res?.data),
    enabled: isEnabled,
    retry: false,
  });
};

export const useDueFlashcards = (params?: {
  folderId?: string;
  limit?: number;
}) => {
  let cleanParams: { folderId?: string; limit?: number } | undefined = undefined;

  if (params) {
    cleanParams = { ...params };
    const isUuid = cleanParams.folderId && UUID_REGEX.test(cleanParams.folderId);
    if (!isUuid) {
      delete cleanParams.folderId;
    }
  }

  const isEnabled = params?.folderId
    ? Boolean(params.folderId && params.folderId !== 'undefined' && UUID_REGEX.test(params.folderId))
    : true;

  return useQuery({
    queryKey: vocabularyKeys.dueFlashcards(cleanParams),
    queryFn: () => vocabularyService.listDueFlashcards(cleanParams),
    enabled: isEnabled,
    retry: false,
  });
};
