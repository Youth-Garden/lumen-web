'use client';

import { DailyGoalHistoryItem, HeatmapItem } from '@/services/progress';
import { StreakFreezeIcon, StreakIcon } from '@/shared/components/streak-icon';
import { useLocale } from '@/shared/hooks';
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { computeWeeklyTrackerDays } from '../utils/streak-tracker.utils';

interface WeeklyGoalTrackerCardProps {
  heatmapData?: HeatmapItem[];
  todayStudyMinutes: number;
  dailyGoalMinutes: number;
  streak: number;
  streakFreezes?: number;
  lastActivityDate?: string;
  goalHistories?: DailyGoalHistoryItem[];
  frozenDates?: string[];
  isLoading?: boolean;
}

export function WeeklyGoalTrackerCard({
  heatmapData,
  todayStudyMinutes,
  dailyGoalMinutes,
  streak,
  streakFreezes = 0,
  lastActivityDate,
  goalHistories,
  frozenDates,
  isLoading = false,
}: WeeklyGoalTrackerCardProps) {
  const t = useTranslations('Dashboard.Overview');
  const locale = useLocale();

  const days = useMemo(() => {
    return computeWeeklyTrackerDays(
      heatmapData,
      todayStudyMinutes,
      dailyGoalMinutes,
      locale,
      streakFreezes,
      false,
      goalHistories,
      lastActivityDate,
      frozenDates,
    );
  }, [
    heatmapData,
    todayStudyMinutes,
    dailyGoalMinutes,
    locale,
    streakFreezes,
    goalHistories,
    lastActivityDate,
    frozenDates,
  ]);

  const completedDaysCount = useMemo(() => {
    return days.filter(
      (d) =>
        d.status === 'completed' ||
        d.status === 'frozen' ||
        (d.isToday && d.isGoalMet),
    ).length;
  }, [days]);

  if (isLoading) {
    return (
      <Card className="h-full flex flex-col justify-between">
        <CardHeader className="px-5 pt-3.5 pb-0">
          <div className="flex items-center justify-between gap-2">
            <Skeleton className="h-4.5 w-36 rounded-md" />
            <Skeleton className="h-5.5 w-20 rounded-full shrink-0" />
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-4 pt-1 flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-7 gap-2 sm:gap-2.5 w-full">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-between py-3 sm:py-3.5 px-1 min-h-[72px] sm:min-h-[80px] rounded-2xl bg-muted/20"
              >
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-3 w-5 rounded mt-1" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="px-5 pt-3.5 pb-0">
        <div className="flex items-center justify-between gap-2">
          <div>
            <CardTitle className="text-sm font-bold font-heading text-foreground">
              {t('weeklyGoalTitle')}
            </CardTitle>
          </div>

          <Badge
            variant="success"
            size="sm"
            className="shrink-0 font-bold flex items-center gap-1"
          >
            <Icons name="check" className="h-3.5 w-3.5 stroke-[2.5]" />
            {completedDaysCount}/7 {t('days')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-4 pt-1 flex-1 flex flex-col justify-center">
        {/* 7 Day Capsule Cards */}
        <div className="grid grid-cols-7 gap-2 sm:gap-2.5 w-full">
          {days.map((item) => {
            const isTodayMet = item.isToday && item.isGoalMet;
            const isCompleted = item.status === 'completed' || isTodayMet;
            const isTodayActive = item.isToday && !item.isGoalMet;
            const isFrozen = item.status === 'frozen';
            const isMissed = item.status === 'missed';

            return (
              <div
                key={item.dateStr}
                className={cn(
                  'flex flex-col items-center justify-between py-3 sm:py-3.5 px-1 min-h-[72px] sm:min-h-[80px] rounded-2xl relative transition-all duration-200',
                  isCompleted && 'bg-emerald-500/10 dark:bg-emerald-500/15',
                  isFrozen && 'bg-blue-500/10 dark:bg-blue-500/15',
                  isMissed && 'bg-rose-500/10 dark:bg-rose-500/15',
                  isTodayActive && 'bg-primary/10 dark:bg-primary/20',
                  !isCompleted &&
                    !isFrozen &&
                    !isMissed &&
                    !item.isToday &&
                    'bg-muted/30',
                )}
              >
                {/* Status Indicator Icon */}
                <div className="h-6 w-6 flex items-center justify-center">
                  {isCompleted ? (
                    <StreakIcon size={22} />
                  ) : isFrozen ? (
                    <StreakFreezeIcon size={20} />
                  ) : isTodayActive ? (
                    <div className="relative h-6 w-6 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-[1.5px] border-dashed border-primary/50 dark:border-primary/60 animate-pulse" />
                      <Icons
                        name="flame"
                        className="h-3.5 w-3.5 text-primary stroke-[2.2] fill-primary/15 shrink-0"
                      />
                    </div>
                  ) : isMissed ? (
                    <div className="h-6 w-6 flex items-center justify-center">
                      <span className="text-base font-black text-rose-500 dark:text-rose-400 font-heading select-none leading-none">
                        !
                      </span>
                    </div>
                  ) : (
                    /* Upcoming days: clean borderless subtle dot */
                    <div className="h-6 w-6 flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                    </div>
                  )}
                </div>

                {/* Day Label */}
                <span
                  className={cn(
                    'text-xs font-semibold tracking-tight transition-colors mt-1',
                    item.isToday
                      ? 'text-primary font-bold'
                      : isCompleted || isFrozen || isMissed
                        ? 'text-foreground'
                        : 'text-muted-foreground',
                  )}
                >
                  {item.dayLabel}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
