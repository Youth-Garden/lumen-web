import { progressService } from '@/services/progress';
import { LeaderboardPeriodEnum } from '@/services/progress/progress.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const gamificationKeys = {
  all: ['gamification'] as const,
  leaderboard: (period?: LeaderboardPeriodEnum) =>
    [...gamificationKeys.all, 'leaderboard', period] as const,
  badges: () => [...gamificationKeys.all, 'badges'] as const,
};

export function useLeaderboard(
  period: LeaderboardPeriodEnum = LeaderboardPeriodEnum.ALL_TIME,
) {
  return useQuery({
    queryKey: gamificationKeys.leaderboard(period),
    queryFn: () => progressService.getLeaderboard(period),
  });
}

export function useBadges() {
  return useQuery({
    queryKey: gamificationKeys.badges(),
    queryFn: () => progressService.getBadges(),
  });
}

export function useBuyStreakFreeze() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => progressService.buyStreakFreeze(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress'] });
      queryClient.invalidateQueries({ queryKey: gamificationKeys.all });
    },
  });
}
