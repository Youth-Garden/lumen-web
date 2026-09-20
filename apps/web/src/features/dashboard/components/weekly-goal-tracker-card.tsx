'use client';

import { HeatmapItem } from '@/services/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { computeWeeklyTrackerDays } from '../utils/streak-tracker.utils';

interface WeeklyGoalTrackerCardProps {
  heatmapData?: HeatmapItem[];
  todayStudyMinutes: number;
  dailyGoalMinutes: number;
  streak: number;
  isLoading?: boolean;
}

export function WeeklyGoalTrackerCard({
  heatmapData,
  todayStudyMinutes,
  dailyGoalMinutes,
  streak,
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
    );
  }, [heatmapData, todayStudyMinutes, dailyGoalMinutes, locale]);

  const completedDaysCount = useMemo(() => {
    return days.filter(
      (d) => d.status === 'completed' || (d.isToday && d.isGoalMet),
    ).length;
  }, [days]);

  if (isLoading) {
    return (
      <Card className="rounded-3xl border-none bg-card shadow-xs p-4 sm:p-5 space-y-3">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </Card>
    );
  }

  const safeGoal = Math.max(dailyGoalMinutes, 1);
  const todayProgressPercent = Math.min(
    100,
    Math.round((todayStudyMinutes / safeGoal) * 100),
  );

  return (
    <Card className="rounded-3xl border-none bg-card shadow-xs overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="px-5 pt-3.5 pb-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icons
              name="target"
              className="h-4.5 w-4.5 text-primary shrink-0"
            />
            <div>
              <CardTitle className="text-sm font-bold font-heading text-foreground">
                {t('weeklyGoalTitle')}
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground">
                {t('weeklyGoalDesc')}
              </CardDescription>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center gap-1">
            <Icons name="check" className="h-3.5 w-3.5 stroke-[2.5]" />
            {completedDaysCount}/7 {t('days')}
          </span>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-3 pt-1 flex-1 flex flex-col justify-center">
        {/* 7 Day Capsule Cards with soft background and NO border */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {days.map((item) => {
            const isTodayMet = item.isToday && item.isGoalMet;
            const isCompleted = item.status === 'completed' || isTodayMet;
            const isTodayActive = item.isToday && !item.isGoalMet;

            // Radial arc for today in-progress
            const ringRadius = 10;
            const ringCircumference = 2 * Math.PI * ringRadius;
            const ringOffset =
              ringCircumference -
              (todayProgressPercent / 100) * ringCircumference;

            return (
              <div
                key={item.dateStr}
                className={cn(
                  'w-full flex flex-col items-center justify-between py-1.5 px-0.5 rounded-2xl transition-colors min-h-[52px]',
                  item.isToday
                    ? 'bg-primary/10 dark:bg-primary/15'
                    : 'bg-muted/40 dark:bg-muted/20',
                )}
              >
                {/* Status Indicator Icon */}
                <div className="h-6 w-6 flex items-center justify-center">
                  {isCompleted ? (
                    <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                      <Icons name="check" className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  ) : isTodayActive ? (
                    <div className="relative flex items-center justify-center h-6 w-6">
                      <svg
                        width="24"
                        height="24"
                        className="transform -rotate-90 origin-center"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r={ringRadius}
                          fill="none"
                          stroke="var(--muted)"
                          strokeWidth="2.5"
                          opacity={0.35}
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r={ringRadius}
                          fill="none"
                          stroke="var(--primary)"
                          strokeWidth="2.5"
                          strokeDasharray={ringCircumference}
                          strokeDashoffset={ringOffset}
                          strokeLinecap="round"
                        />
                      </svg>
                      {item.minutes > 0 && (
                        <span className="absolute text-[8px] font-black text-primary font-heading">
                          {todayProgressPercent}%
                        </span>
                      )}
                    </div>
                  ) : item.status === 'missed' ? (
                    <span className="text-sm font-black text-amber-500 font-heading select-none leading-none">
                      !
                    </span>
                  ) : (
                    /* Upcoming days: clean subtle concentric ring */
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center opacity-50">
                      <div className="h-2 w-2 rounded-full border border-muted-foreground/40" />
                    </div>
                  )}
                </div>

                {/* Day Label */}
                <span
                  className={cn(
                    'text-xs font-semibold tracking-tight transition-colors mt-0.5',
                    item.isToday
                      ? 'text-primary font-bold'
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
