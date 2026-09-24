'use client';

import { HeatmapItem } from '@/services/progress';
import {
  Badge,
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
      <Card className="p-4 sm:p-5 space-y-3">
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
    <Card className="h-full flex flex-col justify-between">
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
            const isMissed = item.status === 'missed';

            return (
              <div
                key={item.dateStr}
                className={cn(
                  'flex flex-col items-center justify-between py-3 sm:py-3.5 px-1 min-h-[72px] sm:min-h-[80px] rounded-2xl relative transition-all duration-200',
                  isCompleted && 'bg-emerald-500/10 dark:bg-emerald-500/15',
                  isMissed && 'bg-rose-500/10 dark:bg-rose-500/15',
                  isTodayActive && 'bg-primary/10 dark:bg-primary/20',
                  !isCompleted && !isMissed && !item.isToday && 'bg-muted/30',
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
                      <Icons
                        name="progress-ring"
                        percent={todayProgressPercent}
                        className="h-6 w-6 text-primary"
                      />
                      <span className="absolute text-[8px] font-black text-primary font-heading select-none">
                        {todayProgressPercent}%
                      </span>
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
                      : isCompleted || isMissed
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
