import { useQuery } from '@tanstack/react-query';
import { progressService } from '@/services/progress/progress.service';

export const useBadges = () => {
  return useQuery({
    queryKey: ['badges'],
    queryFn: () => progressService.getBadges(),
  });
};
