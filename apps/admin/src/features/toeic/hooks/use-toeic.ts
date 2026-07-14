import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toeicService, toeicKeys } from '@/services/toeic';
import type { CreateToeicTestPayload } from '@/services/toeic';
import { toast } from 'sonner';

export const useCreateToeicTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateToeicTestPayload) =>
      toeicService.createTest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toeicKeys.lists() });
    },
  });
};

export const useUpdateToeicTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      toeicService.updateTest(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: toeicKeys.lists() });
      queryClient.invalidateQueries({ queryKey: toeicKeys.detail(id) });
    },
  });
};

export const useDeleteToeicTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toeicService.deleteTest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toeicKeys.lists() });
    },
  });
};

export const usePublishToeicTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toeicService.publishTest(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: toeicKeys.lists() });
      queryClient.invalidateQueries({ queryKey: toeicKeys.detail(id) });
    },
  });
};

export const useToeicTests = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) => {
  return useQuery({
    queryKey: toeicKeys.list(params),
    queryFn: () => toeicService.listTests(params),
  });
};

export const useToeicTestDetail = (
  id: string,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: toeicKeys.detail(id),
    queryFn: () => toeicService.getTestById(id),
    enabled: options?.enabled ?? Boolean(id),
  });
};

export const useGetMissingExplanations = () => {
  return useQuery({
    queryKey: ['toeic', 'admin', 'missing-explanations'],
    queryFn: () =>
      toeicService.getMissingExplanations().then((res) => res.data),
  });
};

export const useUpdateExplanation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: {
      questionId: string;
      explanation: string;
      mediaUrls?: string[];
    }) =>
      toeicService.updateExplanation(variables.questionId, {
        explanation: variables.explanation,
        mediaUrls: variables.mediaUrls,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['toeic', 'admin', 'missing-explanations'],
      });
      toast.success('Explanation updated successfully');
    },
    onError: () => {
      toast.error('Failed to update explanation');
    },
  });
};
