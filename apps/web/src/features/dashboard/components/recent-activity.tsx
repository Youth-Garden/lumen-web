'use client';

import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';
import { useRecentActivities } from '../hooks/use-recent-activities';

import { ActivityType } from '@/services/progress';

const ActivityIcon = ({ type }: { type: ActivityType }) => {
  switch (type) {
    case ActivityType.DICTATION_COMPLETED:
    case ActivityType.SPEAKING_COMPLETED:
      return <Icons name="headphones" className="h-4 w-4 text-primary" />;
    case ActivityType.READING_COMPLETED:
    case ActivityType.GRAMMAR_COMPLETED:
      return <Icons name="book-open" className="h-4 w-4 text-primary" />;
    case ActivityType.QUIZ_COMPLETED:
      return <Icons name="check-circle" className="h-4 w-4 text-green-500" />;
    case ActivityType.STREAK_ACHIEVED:
      return <Icons name="trophy" className="h-4 w-4 text-yellow-500" />;
    case ActivityType.FLASHCARD_REVIEWED:
      return <Icons name="book" className="h-4 w-4 text-blue-500" />;
    default:
      return <Icons name="activity" className="h-4 w-4 text-primary" />;
  }
};

export function RecentActivity() {
  const t = useTranslations('Dashboard.Overview');
  const { data: activities, isLoading } = useRecentActivities();

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Loading activities...</div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        No recent activity found.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <div className="bg-primary/10 p-2 rounded-full mr-4">
            <ActivityIcon type={activity.type} />
          </div>
          <div className="space-y-1 flex-1">
            <p className="text-sm font-medium leading-none">{activity.title}</p>
            <p className="text-sm text-muted-foreground">
              {activity.description}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="font-medium text-green-600 dark:text-green-400">
              +{activity.xpEarned} XP
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(activity.timestamp).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
