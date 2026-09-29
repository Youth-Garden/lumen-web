import { useAuthStore } from '@/store/auth.store';
import { useQuery } from '@tanstack/react-query';
import {
  HeatmapItem,
  progressKeys,
  progressService,
} from '@/services/progress';

const HEATMAP_CACHE_KEY = 'lumen_heatmap_cache';

export function useHeatmap(year?: number) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<HeatmapItem[]>({
    queryKey: progressKeys.heatmap(year),
    queryFn: async () => {
      const data = await progressService.getHeatmapData(year);
      if (typeof window !== 'undefined' && data && !year) {
        try {
          localStorage.setItem(HEATMAP_CACHE_KEY, JSON.stringify(data));
        } catch {
          // ignore
        }
      }
      return data;
    },
    initialData: () => {
      if (typeof window === 'undefined' || year) return undefined;
      try {
        const cached = localStorage.getItem(HEATMAP_CACHE_KEY);
        return cached ? (JSON.parse(cached) as HeatmapItem[]) : undefined;
      } catch {
        return undefined;
      }
    },
    initialDataUpdatedAt: 0,
    enabled: isAuthenticated,
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });
}
