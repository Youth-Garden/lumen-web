import {
  ActivityItem,
  ActivityType,
  BadgeType,
  DashboardProgressResponse,
  HeatmapItem,
  LeaderboardResponse,
  LeaderboardUser,
} from './progress.types';

export const activityItemMapper = (raw?: unknown): ActivityItem => {
  const item = (raw && typeof raw === 'object' ? raw : {}) as Record<
    string,
    unknown
  >;
  return {
    id: String(item.id || ''),
    type: (Object.values(ActivityType).includes(item.type as ActivityType)
      ? item.type
      : ActivityType.DICTATION_COMPLETED) as ActivityType,
    title: String(item.title || ''),
    description: String(item.description || ''),
    xpEarned: Number(item.xpEarned || 0),
    timestamp: String(item.timestamp || ''),
  };
};

export const recentActivitiesMapper = (
  raw?: unknown,
): ActivityItem | ActivityItem[] => {
  if (Array.isArray(raw)) {
    return raw.map(activityItemMapper);
  }
  return activityItemMapper(raw);
};

export const heatmapItemMapper = (raw?: unknown): HeatmapItem => {
  const item = (raw && typeof raw === 'object' ? raw : {}) as Record<
    string,
    unknown
  >;
  return {
    date: String(item.date || '').slice(0, 10),
    count: Number(item.count || 0),
  };
};

export const heatmapMapper = (raw?: unknown): HeatmapItem | HeatmapItem[] => {
  if (Array.isArray(raw)) {
    return raw.map(heatmapItemMapper);
  }
  return heatmapItemMapper(raw);
};

export const dashboardMapper = (
  raw: Record<string, unknown>,
): DashboardProgressResponse => {
  return {
    streak: Number(raw?.streak || 0),
    lastActivityDate: raw?.lastActivityDate
      ? String(raw.lastActivityDate)
      : undefined,
    totalPoints: Number(raw?.totalPoints || 0),
    dailyGoalMinutes: Number(raw?.dailyGoalMinutes || 0),
    todayStudyMinutes: Number(raw?.todayStudyMinutes || 0),
    streakFreezes: Number(raw?.streakFreezes || 0),
    unlockedBadges: Array.isArray(raw?.unlockedBadges)
      ? (raw.unlockedBadges as string[])
      : [],
  };
};

export const leaderboardMapper = (
  raw: Record<string, unknown>,
): LeaderboardResponse => {
  const topUsersRaw = Array.isArray(raw?.topUsers) ? raw.topUsers : [];
  const topUsers: LeaderboardUser[] = topUsersRaw.map(
    (user: Record<string, unknown>) => ({
      userId: String(user.userId || ''),
      fullName: user.fullName ? String(user.fullName) : undefined,
      avatarUrl: user.avatarUrl ? String(user.avatarUrl) : undefined,
      totalPoints: Number(user.totalPoints || 0),
      streak: Number(user.streak || 0),
      unlockedBadges: Array.isArray(user.unlockedBadges)
        ? (user.unlockedBadges as BadgeType[])
        : [],
    }),
  );

  return {
    topUsers,
    currentUserRank: userRankNumber(raw?.currentUserRank),
  };
};

function userRankNumber(val: unknown): number | undefined {
  if (typeof val === 'number') return val;
  if (typeof val === 'string' && val.length > 0) return Number(val);
  return undefined;
}
