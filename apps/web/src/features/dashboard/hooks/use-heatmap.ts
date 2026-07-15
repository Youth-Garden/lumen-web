import { useQuery } from '@tanstack/react-query';
import {
  HeatmapItem,
  progressKeys,
  progressService,
} from '@/services/progress';

export function useHeatmap() {
  return useQuery<HeatmapItem[]>({
    queryKey: progressKeys.heatmap(),
    queryFn: () => progressService.getHeatmapData(),
  });
}
