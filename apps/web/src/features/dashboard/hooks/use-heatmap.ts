import { useAuthStore } from '@/store/auth.store';
import { useQuery } from '@tanstack/react-query';
import {
  HeatmapItem,
  progressKeys,
  progressService,
} from '@/services/progress';

export function useHeatmap(year?: number) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<HeatmapItem[]>({
    queryKey: progressKeys.heatmap(year),
    queryFn: () => progressService.getHeatmapData(year),
    enabled: isAuthenticated,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
}
