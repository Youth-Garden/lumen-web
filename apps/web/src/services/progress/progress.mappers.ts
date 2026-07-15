import {
  ActivityItem,
  ActivityType,
  HeatmapItem,
  DashboardProgressResponse,
} from './progress.types';

export const recentActivitiesMapper = (raw: any): ActivityItem[] => {
  if (!Array.isArray(raw)) return [];

  return raw.map((item: any) => ({
    id: item.id || '',
    type: (Object.values(ActivityType).includes(item.type as ActivityType)
      ? item.type
      : ActivityType.DICTATION_COMPLETED) as ActivityType, // Fallback if type is not found
    title: item.title || '',
    description: item.description || '',
    xpEarned: item.xpEarned || 0,
    timestamp: item.timestamp || '',
  }));
};

export const heatmapListMapper = (raw: any): HeatmapItem[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map((item: any) => ({
    date: item.date || '',
    count: item.count || 0,
  }));
};

export const dashboardMapper = (raw: any): DashboardProgressResponse => {
  return {
    streak: raw?.streak || 0,
    lastActivityDate: raw?.lastActivityDate,
    totalPoints: raw?.totalPoints || 0,
    dailyGoalMinutes: raw?.dailyGoalMinutes || 0,
    todayStudyMinutes: raw?.todayStudyMinutes || 0,
    streakFreezes: raw?.streakFreezes || 0,
    unlockedBadges: raw?.unlockedBadges || [],
  };
};
