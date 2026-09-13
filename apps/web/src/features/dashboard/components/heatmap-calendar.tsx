'use client';

import { useMemo } from 'react';
import { format, startOfDay, subDays } from 'date-fns';
import { useTranslations } from 'next-intl';

import { HeatmapItem } from '@/services/progress';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@lumen/uikit/components';
import { cn } from '@lumen/uikit/utils';

interface HeatmapCalendarProps {
  data: HeatmapItem[] | undefined;
  isLoading: boolean;
}

interface CalendarDay {
  date: Date;
  dateStr: string;
  count: number;
}

export function HeatmapCalendar({ data, isLoading }: HeatmapCalendarProps) {
  const t = useTranslations('Dashboard');

  const today = useMemo(() => startOfDay(new Date()), []);
  const days = useMemo(() => {
    return Array.from({ length: 365 }, (_, dayIndex) => {
      return subDays(today, 364 - dayIndex);
    });
  }, [today]);

  const heatmapMap = useMemo(() => {
    const map = new Map<string, number>();
    data?.forEach((item) => {
      map.set(item.date, item.count);
    });
    return map;
  }, [data]);

  const totalActivities = useMemo(() => {
    return data?.reduce((acc, item) => acc + (item.count || 0), 0) ?? 0;
  }, [data]);

  const { weeks, monthLabels } = useMemo(() => {
    const weeksList: (CalendarDay | null)[][] = [];
    let currentWeek: (CalendarDay | null)[] = [];

    const firstDayOfWeek = days[0].getDay();
    for (let index = 0; index < firstDayOfWeek; index++) {
      currentWeek.push(null);
    }

    days.forEach((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = heatmapMap.get(dateStr) || 0;
      currentWeek.push({ date, dateStr, count });

      if (currentWeek.length === 7) {
        weeksList.push(currentWeek);
        currentWeek = [];
      }
    });

    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeksList.push(currentWeek);
    }

    const labels: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;

    weeksList.forEach((week, weekIndex) => {
      const firstValidDay = week.find((day): day is CalendarDay => day !== null);
      if (firstValidDay) {
        const month = firstValidDay.date.getMonth();
        if (month !== lastMonth) {
          labels.push({
            weekIndex,
            label: format(firstValidDay.date, 'MMM'),
          });
          lastMonth = month;
        }
      }
    });

    return { weeks: weeksList, monthLabels: labels };
  }, [days, heatmapMap]);

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-muted/50';
    if (count < 3) return 'bg-emerald-200 dark:bg-emerald-900/50';
    if (count < 7) return 'bg-emerald-300 dark:bg-emerald-700/70';
    if (count < 15) return 'bg-emerald-400 dark:bg-emerald-600/80';
    return 'bg-emerald-500 dark:bg-emerald-500';
  };

  return (
    <Card className="w-full rounded-3xl border-none bg-card shadow-xs overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-bold text-foreground">
          {t('activityHeatmap')}
        </CardTitle>
        <span className="text-xs text-muted-foreground font-medium">
          {totalActivities} {t('contributions')}
        </span>
      </CardHeader>

      <CardContent className="space-y-3 pt-1">
        {isLoading ? (
          <Skeleton className="w-full h-32 rounded-2xl" />
        ) : (
          <>
            {/* Scrollable calendar container - ONLY grid and months scroll */}
            <div className="overflow-x-auto pb-2 scrollbar-thin">
              <div className="flex gap-2 w-max">
                {/* Day labels column */}
                <div className="flex flex-col gap-[3px] text-[10px] font-medium text-muted-foreground/60 select-none pt-4 shrink-0">
                  <span className="h-[12px] leading-[12px]" />
                  <span className="h-[12px] leading-[12px]">Mon</span>
                  <span className="h-[12px] leading-[12px]" />
                  <span className="h-[12px] leading-[12px]">Wed</span>
                  <span className="h-[12px] leading-[12px]" />
                  <span className="h-[12px] leading-[12px]">Fri</span>
                  <span className="h-[12px] leading-[12px]" />
                </div>

                {/* Main grid with month labels on top */}
                <div className="flex flex-col gap-1">
                  {/* Month labels row */}
                  <div className="flex gap-[3px] h-3.5 text-[10px] font-medium text-muted-foreground/70 select-none">
                    {weeks.map((_, weekIndex) => {
                      const monthItem = monthLabels.find(
                        (item) => item.weekIndex === weekIndex,
                      );
                      return (
                        <div
                          key={weekIndex}
                          className="w-[12px] shrink-0 text-left overflow-visible"
                        >
                          {monthItem?.label && (
                            <span className="whitespace-nowrap">
                              {monthItem.label}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Heatmap cells */}
                  <TooltipProvider delay={50}>
                    <div className="flex gap-[3px]">
                      {weeks.map((week, weekIndex) => (
                        <div
                          key={weekIndex}
                          className="flex flex-col gap-[3px] shrink-0"
                        >
                          {week.map((day, dayIndex) => {
                            if (!day) {
                              return (
                                <div
                                  key={`empty-${dayIndex}`}
                                  className="w-[12px] h-[12px]"
                                />
                              );
                            }

                            const formattedDate = format(
                              day.date,
                              'MMM d, yyyy',
                            );

                            return (
                              <Tooltip key={day.dateStr}>
                                <TooltipTrigger
                                  render={
                                    <div
                                      tabIndex={0}
                                      className={cn(
                                        'w-[12px] h-[12px] rounded-full transition-all duration-150 cursor-pointer hover:ring-2 hover:ring-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                                        getIntensityClass(day.count),
                                      )}
                                    />
                                  }
                                />
                                <TooltipContent
                                  side="top"
                                  sideOffset={6}
                                  className="text-xs py-1 px-2.5 shadow-md"
                                >
                                  <span>
                                    {day.count > 0
                                      ? t('activityTooltip', {
                                          count: day.count,
                                          date: formattedDate,
                                        })
                                      : t('noActivityTooltip', {
                                          date: formattedDate,
                                        })}
                                  </span>
                                </TooltipContent>
                              </Tooltip>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            {/* Chú thích / Legend - OUTSIDE the scroll container, firmly fixed at bottom right */}
            <div className="flex justify-end items-center gap-2 text-xs text-muted-foreground pt-1 border-t border-border/10">
              <span>{t('less')}</span>
              <div className="w-2.5 h-2.5 rounded-full bg-muted/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-200 dark:bg-emerald-900/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-300 dark:bg-emerald-700/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 dark:bg-emerald-600/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 dark:bg-emerald-500" />
              <span>{t('more')}</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

