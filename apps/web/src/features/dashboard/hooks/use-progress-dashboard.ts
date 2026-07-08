import { useQuery } from '@tanstack/react-query';
import { progressService, DashboardProgressResponse, progressKeys } from '@/services/progress';

export const useProgressDashboard = () => {
  return useQuery<DashboardProgressResponse>({
    queryKey: progressKeys.dashboard(),
    queryFn: () => progressService.getDashboardData(),
  });
};
