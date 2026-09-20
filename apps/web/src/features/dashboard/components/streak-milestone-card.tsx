'use client';

import {
  LongestStreakIcon,
  StreakFreezeIcon,
} from '@/shared/components/streak-icon';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { calculateStreakMilestone } from '../utils/streak-tracker.utils';

interface StreakMilestoneCardProps {
  streak: number;
  streakFreezes?: number;
  isLoading?: boolean;
}

export function StreakMilestoneCard({
  streak,
  streakFreezes = 0,
  isLoading = false,
}: StreakMilestoneCardProps) {
  const t = useTranslations('Dashboard.Overview');

  const milestone = useMemo(() => {
    return calculateStreakMilestone(streak);
  }, [streak]);

  if (isLoading) {
    return (
      <Card className="rounded-3xl border-none bg-card shadow-xs p-4 sm:p-5 space-y-3">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-none bg-card shadow-xs overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="px-5 pt-3.5 pb-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icons
              name="trophy"
              className="h-4.5 w-4.5 text-amber-500 shrink-0"
            />
            <div>
              <CardTitle className="text-sm font-bold font-heading text-foreground">
                {t('streakMilestoneTitle')}
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground">
                {t('streakMilestoneDesc')}
              </CardDescription>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
            {t('nextMilestoneLabel', { days: milestone.nextMilestone })}
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-3 pt-1 flex-1 flex flex-col justify-between gap-2">
        {/* Milestone Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Icons name="award" className="h-4 w-4 text-amber-500 shrink-0" />
              <span className="text-xs font-bold text-foreground">
                {streak} {t('days')}{' '}
                <span className="text-[11px] text-muted-foreground font-normal">
                  ({milestone.progressPercent}%)
                </span>
              </span>
            </div>
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 shrink-0">
              {t('daysRemainingToMilestone', { days: milestone.remainingDays })}
            </span>
          </div>

          <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-linear-to-r from-amber-400 via-amber-500 to-orange-500 rounded-full transition-all duration-500 shadow-2xs"
              style={{ width: `${Math.max(6, milestone.progressPercent)}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
            <span>
              {milestone.prevMilestone} {t('days')}
            </span>
            <span>
              {milestone.nextMilestone} {t('days')} 🏆
            </span>
          </div>
        </div>

        {/* Protection & Record Badges */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40">
          {/* Streak Freeze Inventory */}
          <div className="flex items-center gap-2 py-0.5">
            <StreakFreezeIcon size={16} />
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground font-medium truncate">
                {t('streakProtection')}
              </p>
              <p className="text-xs font-bold text-foreground truncate">
                {streakFreezes} {t('streakFreezesCount', { count: '' }).trim()}
              </p>
            </div>
          </div>

          {/* Longest Streak Record */}
          <div className="flex items-center gap-2 py-0.5">
            <LongestStreakIcon size={16} />
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground font-medium truncate">
                {t('longestStreakRecord', { days: '' }).replace(':', '').trim()}
              </p>
              <p className="text-xs font-bold text-foreground truncate">
                {Math.max(streak, 1)} {t('days')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
