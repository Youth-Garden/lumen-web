import { ActivityItem, ActivityType } from './progress.types';

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
    timestamp: new Date(item.timestamp),
  }));
};
