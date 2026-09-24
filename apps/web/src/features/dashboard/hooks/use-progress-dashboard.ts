import { useLocalStorage } from '@lumen/hooks';
import {
  DashboardProgressResponse,
  UpdateProgressSettingsPayload,
  progressKeys,
  progressService,
} from '@/services/progress';
import { useAuthStore } from '@/store/auth.store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const PROGRESS_DASHBOARD_CACHE_KEY = 'lumen_progress_dashboard_cache';

export const useProgressDashboard = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [cachedData, setCachedData] = useLocalStorage<
    DashboardProgressResponse | undefined
  >(PROGRESS_DASHBOARD_CACHE_KEY, undefined);

  return useQuery<DashboardProgressResponse>({
    queryKey: progressKeys.dashboard(),
    queryFn: async () => {
      const data = await progressService.getDashboardData();
      if (data) {
        setCachedData(data);
      }
      return data;
    },
    placeholderData: (previousData) => previousData ?? cachedData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    enabled: isAuthenticated,
  });
};

export const useUpdateProgressSettings = () => {
  const queryClient = useQueryClient();
  const [, setCachedData] = useLocalStorage<
    DashboardProgressResponse | undefined
  >(PROGRESS_DASHBOARD_CACHE_KEY, undefined);

  return useMutation({
    mutationFn: (payload: UpdateProgressSettingsPayload) =>
      progressService.updateSettings(payload),
    onSuccess: (_, variables) => {
      queryClient.setQueryData<DashboardProgressResponse>(
        progressKeys.dashboard(),
        (old) => {
          if (!old) return old;
          const updated = {
            ...old,
            dailyGoalMinutes:
              variables.dailyGoalMinutes ?? old.dailyGoalMinutes,
          };
          setCachedData(updated);
          return updated;
        },
      );
      void queryClient.invalidateQueries({
        queryKey: progressKeys.all,
        refetchType: 'none',
      });
    },
  });
};
