import { useQuery } from '@tanstack/react-query';
import { progressService } from '@/services/progress/progress.service';

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => progressService.getLeaderboard(),
  });
};
