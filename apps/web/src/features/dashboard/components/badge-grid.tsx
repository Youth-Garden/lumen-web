'use client';

import { useTranslations } from 'next-intl';
import { Icons } from '@lumen/uikit/icons';
import { Card } from '@lumen/uikit/components';
import { useBadges } from '../hooks/use-gamification';

interface BadgeGridProps {
  unlockedBadges?: string[];
}

export const BadgeGrid = ({ unlockedBadges = [] }: BadgeGridProps) => {
  const t = useTranslations('Gamification');
  const { data: allBadges = [], isLoading } = useBadges();

  const defaultBadges = [
    {
      code: 'FIRST_BLOOD',
      name: 'First Blood',
      description: 'Completed your first study session',
      icon: 'zap',
    },
    {
      code: 'STREAK_3_DAYS',
      name: '3-Day Streak',
      description: 'Maintained a 3-day active learning streak',
      icon: 'flame',
    },
    {
      code: 'STREAK_7_DAYS',
      name: 'Week Warrior',
      description: 'Maintained a 7-day active learning streak',
      icon: 'award',
    },
    {
      code: 'XP_1000',
      name: '1K Club',
      description: 'Earned 1,000 XP points',
      icon: 'star',
    },
    {
      code: 'XP_5000',
      name: 'Master Scholar',
      description: 'Earned 5,000 XP points',
      icon: 'crown',
    },
  ];

  const badgeList = allBadges.length > 0 ? allBadges : defaultBadges;

  return (
    <Card className="p-6 bg-card/40">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
            <Icons name="award" className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-lg text-foreground">{t('badges')}</h3>
        </div>
      </div>

      {isLoading ? (
        <div className="flex min-h-[120px] items-center justify-center">
          <Icons
            name="loader-2"
            className="h-6 w-6 animate-spin text-primary"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {badgeList.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.code);

            return (
              <div
                key={badge.code}
                className={`flex flex-col items-center text-center p-3.5 rounded-xl transition-all ${
                  isUnlocked
                    ? 'bg-purple-500/10 shadow-sm'
                    : 'bg-muted/30 opacity-50 grayscale'
                }`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full mb-2 ${
                    isUnlocked
                      ? 'bg-purple-500 text-white shadow-md shadow-purple-500/30'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  <Icons name="award" className="h-6 w-6" />
                </div>
                <div className="font-bold text-xs text-foreground line-clamp-1">
                  {badge.name}
                </div>
                <div className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">
                  {badge.description}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
