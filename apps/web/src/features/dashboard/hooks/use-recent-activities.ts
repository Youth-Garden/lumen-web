import { useQuery } from '@tanstack/react-query';
import { progressService } from '@/services/progress';
import { progressKeys } from '@/services/progress';

export function useRecentActivities() {
  return useQuery({
    queryKey: progressKeys.activities(),
    queryFn: () => progressService.getRecentActivities(),
  });
}
