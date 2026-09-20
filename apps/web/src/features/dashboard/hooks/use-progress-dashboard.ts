import { useAuthStore } from '@/store/auth.store';
import {
  DashboardProgressResponse,
  UpdateProgressSettingsPayload,
  progressKeys,
  progressService,
} from '@/services/progress';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useProgressDashboard = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<DashboardProgressResponse>({
    queryKey: progressKeys.dashboard(),
    queryFn: () => progressService.getDashboardData(),
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
        (old) =>
          old
            ? {
                ...old,
                dailyGoalMinutes:
                  variables.dailyGoalMinutes ?? old.dailyGoalMinutes,
              }
            : old,
      );
      void queryClient.invalidateQueries({
        queryKey: progressKeys.all,
        refetchType: 'none',
      });
    },
  });
};
