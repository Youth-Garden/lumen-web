'use client';

import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';

type ActivityType = 'dictation_completed' | 'reading_completed' | 'quiz_completed' | 'streak_achieved';

interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  xpEarned: number;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'dictation_completed',
    title: 'Completed Dictation Lesson',
    description: 'B1 - General Conversation',
    timestamp: 'Just now',
    xpEarned: 50,
  },
  {
    id: '2',
    type: 'quiz_completed',
    title: 'Passed TOEIC Mini Quiz',
    description: 'Score: 90/100',
    timestamp: '2 hours ago',
    xpEarned: 120,
  },
  {
    id: '3',
    type: 'streak_achieved',
    title: '3 Day Streak Achieved!',
    description: 'Keep it up!',
    timestamp: 'Yesterday',
    xpEarned: 200,
  },
  {
    id: '4',
    type: 'reading_completed',
    title: 'Read Article',
    description: 'The Future of AI in Education',
    timestamp: 'Yesterday',
    xpEarned: 30,
  },
  {
    id: '5',
    type: 'dictation_completed',
    title: 'Completed Dictation Lesson',
    description: 'A2 - Basic Introductions',
    timestamp: '2 days ago',
    xpEarned: 50,
  },
];

const ActivityIcon = ({ type }: { type: ActivityType }) => {
  switch (type) {
    case 'dictation_completed':
      return <Icons name="headphones" className="h-4 w-4 text-primary" />;
    case 'reading_completed':
      return <Icons name="book-open" className="h-4 w-4 text-primary" />;
    case 'quiz_completed':
      return <Icons name="check-circle" className="h-4 w-4 text-green-500" />;
    case 'streak_achieved':
      return <Icons name="trophy" className="h-4 w-4 text-yellow-500" />;
    default:
      return <Icons name="book-open" className="h-4 w-4 text-primary" />;
  }
};

export function RecentActivity() {
  const t = useTranslations('Dashboard.Overview');

  return (
    <div className="space-y-8">
      {mockActivities.map((activity) => (
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
            <div className="text-xs text-muted-foreground">{activity.timestamp}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
