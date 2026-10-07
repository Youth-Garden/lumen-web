import {
  ActivityItem,
  ActivityType,
  BadgeType,
  DashboardProgressResponse,
  HeatmapItem,
  LeaderboardResponse,
  LeaderboardUser,
} from './progress.types';

export const activityItemMapper = (raw: any): ActivityItem => ({
  id: raw.id || '',
  type: Object.values(ActivityType).includes(raw.type)
    ? raw.type
    : ActivityType.DICTATION_COMPLETED,
  title: raw.title || '',
  description: raw.description || '',
  xpEarned: raw.xpEarned || 0,
  timestamp: raw.timestamp || '',
});

export const recentActivitiesMapper = (
  raw: any,
): ActivityItem | ActivityItem[] => {
  if (Array.isArray(raw)) {
    return raw.map(activityItemMapper);
  }
  return activityItemMapper(raw);
};

export const heatmapItemMapper = (raw: any): HeatmapItem => ({
  date: String(raw.date || '').slice(0, 10),
  count: raw.count || 0,
});

export const heatmapMapper = (raw: any): HeatmapItem | HeatmapItem[] => {
  if (Array.isArray(raw)) {
    return raw.map(heatmapItemMapper);
  }
  return heatmapItemMapper(raw);
};

export const dashboardMapper = (raw: any): DashboardProgressResponse => ({
  streak: raw.streak || 0,
  lastActivityDate: raw.lastActivityDate
    ? String(raw.lastActivityDate)
    : undefined,
  totalPoints: raw.totalPoints || 0,
  dailyGoalMinutes: raw.dailyGoalMinutes || 0,
  todayStudyMinutes: raw.todayStudyMinutes || 0,
  streakFreezes: raw.streakFreezes || 0,
  unlockedBadges: Array.isArray(raw.unlockedBadges) ? raw.unlockedBadges : [],
  goalHistories: Array.isArray(raw.goalHistories)
    ? raw.goalHistories.map((h: any) => ({
        targetMinutes: Number(h.targetMinutes) || 0,
        effectiveFrom: String(h.effectiveFrom || ''),
        effectiveTo: h.effectiveTo ? String(h.effectiveTo) : null,
      }))
    : [],
  frozenDates: Array.isArray(raw.frozenDates)
    ? raw.frozenDates.map((d: any) => String(d).slice(0, 10))
    : [],
});

export const leaderboardMapper = (raw: any): LeaderboardResponse => {
  const topUsersRaw = Array.isArray(raw.topUsers) ? raw.topUsers : [];
  const topUsers: LeaderboardUser[] = topUsersRaw.map((user: any) => ({
    userId: user.userId || '',
    fullName: user.fullName || undefined,
    avatarUrl: user.avatarUrl || undefined,
    totalPoints: user.totalPoints || 0,
    streak: user.streak || 0,
    unlockedBadges: Array.isArray(user.unlockedBadges)
      ? (user.unlockedBadges as BadgeType[])
      : [],
  }));

  return {
    topUsers,
    currentUserRank: userRankNumber(raw.currentUserRank),
  };
};

function userRankNumber(val: unknown): number | undefined {
  if (typeof val === 'number') return val;
  if (typeof val === 'string' && val.length > 0) return Number(val);
  return undefined;
}
