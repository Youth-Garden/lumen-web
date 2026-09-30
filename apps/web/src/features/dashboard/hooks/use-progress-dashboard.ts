import {
  DashboardProgressResponse,
  UpdateProgressSettingsPayload,
  progressKeys,
  progressService,
} from '@/services/progress';
import { useAuthStore } from '@/store/auth.store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useProgressDashboard = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<DashboardProgressResponse>({
    queryKey: progressKeys.dashboard(),
    queryFn: () => progressService.getDashboardData(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: isAuthenticated,
  });
};

export const useUpdateProgressSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProgressSettingsPayload) =>
      progressService.updateSettings(payload),
    onSuccess: (_, variables) => {
      queryClient.setQueryData<DashboardProgressResponse>(
        progressKeys.dashboard(),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            dailyGoalMinutes:
              variables.dailyGoalMinutes ?? old.dailyGoalMinutes,
          };
        },
      );
      void queryClient.invalidateQueries({
        queryKey: progressKeys.all,
        refetchType: 'none',
      });
    },
  });
};
