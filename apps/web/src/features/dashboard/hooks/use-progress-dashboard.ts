import {
  DashboardProgressResponse,
  UpdateProgressSettingsPayload,
  progressKeys,
  progressService,
} from '@/services/progress';
import { useAuthStore } from '@/store/auth.store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const DASHBOARD_CACHE_KEY = 'lumen_progress_dashboard_cache';

export const useProgressDashboard = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<DashboardProgressResponse>({
    queryKey: progressKeys.dashboard(),
    queryFn: async () => {
      const data = await progressService.getDashboardData();
      if (typeof window !== 'undefined' && data) {
        try {
          localStorage.setItem(DASHBOARD_CACHE_KEY, JSON.stringify(data));
        } catch {
          // ignore quota error
        }
      }
      return data;
    },
    initialData: () => {
      if (typeof window === 'undefined') return undefined;
      try {
        const cached = localStorage.getItem(DASHBOARD_CACHE_KEY);
        return cached
          ? (JSON.parse(cached) as DashboardProgressResponse)
          : undefined;
      } catch {
        return undefined;
      }
    },
    initialDataUpdatedAt: 0,
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
          const updated = {
            ...old,
            dailyGoalMinutes:
              variables.dailyGoalMinutes ?? old.dailyGoalMinutes,
          };
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(
                DASHBOARD_CACHE_KEY,
                JSON.stringify(updated),
              );
            } catch {
              // ignore
            }
          }
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
