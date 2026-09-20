'use client';

import { HeatmapItem } from '@/services/progress';
import { StreakIcon } from '@/shared/components/streak-icon';
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
    return days.filter((d) => d.status === 'completed' || (d.isToday && d.isGoalMet))
      .length;
  }, [days]);

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
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
              <Icons name="target" className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold font-heading text-foreground">
                {t('weeklyGoalTitle')}
              </CardTitle>
              <CardDescription className="text-[11px] text-muted-foreground">
                {t('weeklyGoalDesc')}
              </CardDescription>
            </div>
          </div>

          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center gap-1 shadow-2xs">
            <Icons name="check" className="h-3.5 w-3.5 stroke-[2.5]" />
            {completedDaysCount}/7 {t('days')}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 flex-1 flex flex-col justify-between gap-4">
        {/* 7 Days Row */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1">
          {days.map((item) => {
            const isTodayMet = item.isToday && item.isGoalMet;
            const isTodayInProgress = item.isToday && !item.isGoalMet;

            return (
              <div
                key={item.dateStr}
                className="flex flex-col items-center gap-1.5 text-center group"
              >
                {/* Day Label */}
                <span
                  className={cn(
                    'text-[11px] font-semibold transition-colors',
                    item.isToday
                      ? 'text-primary font-bold'
                      : 'text-muted-foreground',
                  )}
                >
                  {item.dayLabel}
                </span>

                {/* Day Circle */}
                <div
                  className={cn(
                    'h-9 w-9 sm:h-10 sm:w-10 rounded-2xl flex items-center justify-center transition-all duration-200',
                    item.status === 'completed' || isTodayMet
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : isTodayInProgress
                        ? 'border-2 border-primary bg-primary/10 text-primary shadow-xs ring-2 ring-primary/20 animate-pulse'
                        : item.status === 'missed'
                          ? 'bg-muted/40 text-muted-foreground/60'
                          : 'border border-dashed border-border/70 bg-transparent text-muted-foreground/40',
                  )}
                >
                  {item.status === 'completed' || isTodayMet ? (
                    <Icons name="check" className="h-4 w-4 stroke-[2.5]" />
                  ) : isTodayInProgress ? (
                    <span className="text-[11px] font-black font-heading">
                      {item.minutes}m
                    </span>
                  ) : item.status === 'missed' ? (
                    <span className="text-[10px] font-bold text-muted-foreground/50">
                      —
                    </span>
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-border" />
                  )}
                </div>

                {/* Bottom Mini Indicator */}
                <span
                  className={cn(
                    'text-[10px] font-medium transition-colors',
                    item.isToday
                      ? 'text-primary font-bold'
                      : item.minutes > 0
                        ? 'text-muted-foreground'
                        : 'text-muted-foreground/40',
                  )}
                >
                  {item.minutes > 0 ? `${item.minutes}m` : '0m'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Motivational Footer Pill */}
        <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/25 rounded-2xl p-2.5 px-3">
          <div className="flex items-center gap-1.5">
            <StreakIcon size={14} />
            <span className="text-[11px] font-medium text-foreground">
              {todayStudyMinutes > 0
                ? t('streakActive')
                : t('streakInactive')}
            </span>
          </div>

          <span className="text-[10px] font-semibold text-primary">
            {todayStudyMinutes >= dailyGoalMinutes
              ? t('dailyGoalReached')
              : t('keepGoingToReachGoal', {
                  minutes: Math.max(0, dailyGoalMinutes - todayStudyMinutes),
                })}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
