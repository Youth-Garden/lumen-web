import { useAuthStore } from '@/store/auth.store';
import { useQuery } from '@tanstack/react-query';
import {
  HeatmapItem,
  progressKeys,
  progressService,
} from '@/services/progress';

export function useHeatmap() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<HeatmapItem[]>({
    queryKey: progressKeys.heatmap(),
    queryFn: () => progressService.getHeatmapData(),
    enabled: isAuthenticated,
  });
}
