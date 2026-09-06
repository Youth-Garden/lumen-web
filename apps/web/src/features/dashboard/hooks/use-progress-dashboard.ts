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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: progressKeys.dashboard() });
    },
  });
};
