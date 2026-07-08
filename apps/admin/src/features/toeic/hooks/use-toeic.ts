import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toeicAdminService, toeicAdminKeys } from '@/services/toeic';
import type { CreateToeicTestPayload } from '@/services/toeic';

export const useCreateToeicTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateToeicTestPayload) => toeicAdminService.createTest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toeicAdminKeys.lists() });
    },
  });
};

export const useUpdateToeicTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      toeicAdminService.updateTest(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: toeicAdminKeys.lists() });
      queryClient.invalidateQueries({ queryKey: toeicAdminKeys.detail(id) });
    },
  });
};

export const useDeleteToeicTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toeicAdminService.deleteTest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: toeicAdminKeys.lists() });
    },
  });
};

export const usePublishToeicTest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toeicAdminService.publishTest(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: toeicAdminKeys.lists() });
      queryClient.invalidateQueries({ queryKey: toeicAdminKeys.detail(id) });
    },
  });
};

export const useToeicTests = (params?: { page?: number; limit?: number; search?: string; status?: string }) => {
  return useQuery({
    queryKey: toeicAdminKeys.list(params),
    queryFn: () => toeicAdminService.listTests(params),
  });
};

export const useToeicTestDetail = (id: string, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: toeicAdminKeys.detail(id),
    queryFn: () => toeicAdminService.getTestById(id),
    enabled: options?.enabled ?? Boolean(id),
  });
};