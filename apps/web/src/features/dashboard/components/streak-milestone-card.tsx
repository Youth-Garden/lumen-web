'use client';

import {
  LongestStreakIcon,
  StreakFreezeIcon,
  StreakIcon,
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
      <Card className="rounded-3xl border-none bg-card shadow-xs p-5 space-y-4">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <Skeleton className="h-28 w-full rounded-2xl" />
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-none bg-card shadow-xs overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="p-5 pb-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-500 shrink-0">
              <StreakIcon size={18} />
            </div>
            <div>
              <CardTitle className="text-sm font-bold font-heading text-foreground">
                {t('streakMilestoneTitle')}
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground">
                {t('streakMilestoneDesc')}
              </CardDescription>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
            {t('nextMilestoneLabel', { days: milestone.nextMilestone })}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 flex-1 flex flex-col justify-between gap-3">
        {/* Top: Milestone Progress Bar with Icon in Circle */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
            <Icons name="award" className="h-5 w-5" />
          </div>

          <div className="flex-1 space-y-1.5 min-w-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold text-foreground truncate">
                {streak} {t('days')}{' '}
                <span className="text-[10px] text-muted-foreground font-normal">
                  ({milestone.progressPercent}%)
                </span>
              </span>
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 shrink-0">
                {t('daysRemainingToMilestone', { days: milestone.remainingDays })}
              </span>
            </div>

            <div className="w-full h-2.5 bg-muted/30 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-linear-to-r from-amber-400 via-amber-500 to-orange-500 rounded-full transition-all duration-500 shadow-2xs"
                style={{ width: `${Math.max(6, milestone.progressPercent)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-0.5">
              <span>{milestone.prevMilestone} {t('days')}</span>
              <span>{milestone.nextMilestone} {t('days')} 🏆</span>
            </div>
          </div>
        </div>

        {/* Protection & Record Badges */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {/* Streak Freeze Inventory */}
          <div className="flex items-center gap-2 bg-muted/25 rounded-2xl p-2 px-2.5">
            <StreakFreezeIcon size={20} />
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
          <div className="flex items-center gap-2 bg-muted/25 rounded-2xl p-2 px-2.5">
            <LongestStreakIcon size={20} />
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
