'use client';

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
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import { format, isSameDay, startOfDay, subDays } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef } from 'react';

interface HeatmapCalendarProps {
  data: HeatmapItem[] | undefined;
  isLoading: boolean;
  todayStudyMinutes?: number;
  streak?: number;
  dailyGoalMinutes?: number;
}

interface CalendarDay {
  date: Date;
  dateStr: string;
  count: number;
}

function getIntensityClass(count: number): string {
  if (count === 0) return 'bg-muted/40 dark:bg-muted/30 hover:bg-muted/60 transition-colors duration-200';
  if (count < 3) return 'bg-indigo-200 dark:bg-indigo-900/50 hover:bg-indigo-300 dark:hover:bg-indigo-800 transition-colors duration-200';
  if (count < 7) return 'bg-indigo-300 dark:bg-indigo-800/60 hover:bg-indigo-400 dark:hover:bg-indigo-700 transition-colors duration-200';
  if (count < 15) return 'bg-indigo-500 dark:bg-indigo-700/70 hover:bg-indigo-600 dark:hover:bg-indigo-600 transition-colors duration-200';
  if (count < 30) return 'bg-indigo-600 dark:bg-indigo-600/80 hover:bg-indigo-700 dark:hover:bg-indigo-700 transition-colors duration-200';
  return 'bg-indigo-700 dark:bg-indigo-500 hover:brightness-110 transition-all duration-200 shadow-xs';
}

function getIntensityDotClass(count: number): string {
  if (count === 0) return 'bg-muted/50';
  if (count < 3) return 'bg-indigo-200 dark:bg-indigo-900/50';
  if (count < 7) return 'bg-indigo-300 dark:bg-indigo-800';
  if (count < 15) return 'bg-indigo-500 dark:bg-indigo-700';
  if (count < 30) return 'bg-indigo-600 dark:bg-indigo-600';
  return 'bg-indigo-700 dark:bg-indigo-500';
}

export function HeatmapCalendar({
  data,
  isLoading,
  todayStudyMinutes = 0,
  streak = 0,
  dailyGoalMinutes = 0,
}: HeatmapCalendarProps) {
  const t = useTranslations('Dashboard');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const today = useMemo(() => startOfDay(new Date()), []);
  const todayStr = useMemo(() => format(today, 'yyyy-MM-dd'), [today]);

  useEffect(() => {
    if (!isLoading && scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
    }
  }, [isLoading, data]);

  const days = useMemo(() => Array.from({ length: 365 }, (_, idx) => subDays(today, 364 - idx)), [today]);

  const heatmapMap = useMemo(() => {
    const map = new Map<string, number>();
    data?.forEach((item) => {
      if (item?.date) {
        const normalized = String(item.date).slice(0, 10);
        map.set(normalized, (map.get(normalized) || 0) + (Number(item.count) || 0));
      }
    });
    const currentTodayCount = map.get(todayStr) || 0;
    if (currentTodayCount === 0 && (todayStudyMinutes > 0 || streak > 0)) {
      map.set(todayStr, Math.max(1, Math.round((todayStudyMinutes || 10) / 2)));
    }
    return map;
  }, [data, todayStr, todayStudyMinutes, streak]);

  const totalActivities = useMemo(() => {
    let sum = 0;
    heatmapMap.forEach((count) => { sum += count; });
    return sum;
  }, [heatmapMap]);

  const activeDaysCount = useMemo(() => {
    let count = 0;
    heatmapMap.forEach((c) => { if (c > 0) count++; });
    return count;
  }, [heatmapMap]);

  const averagePerDay = useMemo(() => (
    activeDaysCount > 0 ? Math.round((totalActivities / activeDaysCount) * 10) / 10 : 0
  ), [totalActivities, activeDaysCount]);

  const { weeks, monthLabels } = useMemo(() => {
    const weeksList: (CalendarDay | null)[][] = [];
    let currentWeek: (CalendarDay | null)[] = [];
    const firstDayOfWeek = days[0].getDay();

    for (let idx = 0; idx < firstDayOfWeek; idx++) currentWeek.push(null);
    days.forEach((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      currentWeek.push({ date, dateStr, count: heatmapMap.get(dateStr) || 0 });
      if (currentWeek.length === 7) { weeksList.push(currentWeek); currentWeek = []; }
    });
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      weeksList.push(currentWeek);
    }

    const labels: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;
    weeksList.forEach((week, weekIndex) => {
      const firstValidDay = week.find((day): day is CalendarDay => day !== null);
      if (firstValidDay) {
        const month = firstValidDay.date.getMonth();
        if (month !== lastMonth) { labels.push({ weekIndex, label: format(firstValidDay.date, 'MMM') }); lastMonth = month; }
      }
    });

    return { weeks: weeksList, monthLabels: labels };
  }, [days, heatmapMap]);

  return (
    <TooltipProvider delay={100}>
      <Card className="rounded-3xl border-none bg-card shadow-xs overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icons name="calendar" className="h-4 w-4" />
            </div>
            <CardTitle className="text-base font-bold font-heading text-foreground">
              {t('activityHeatmap')}
            </CardTitle>
          </div>
          <span className="text-xs text-muted-foreground font-medium">
            {totalActivities} {t('contributions')}
          </span>
        </CardHeader>

        <CardContent className="pt-1">
          {isLoading ? (
            <Skeleton className="w-full h-36 rounded-2xl" />
          ) : (
            <div className="flex flex-col lg:flex-row items-stretch gap-6">
              <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                <div ref={scrollContainerRef} className="overflow-x-auto pb-1 scrollbar-thin scroll-smooth">
                  <div className="flex gap-2.5 w-max py-1">
                    <div className="flex flex-col gap-1 text-[10px] font-medium text-muted-foreground/70 select-none pt-5 shrink-0">
                      <span className="h-3 leading-3" /><span className="h-3 leading-3">T2</span>
                      <span className="h-3 leading-3" /><span className="h-3 leading-3">T4</span>
                      <span className="h-3 leading-3" /><span className="h-3 leading-3">T6</span>
                      <span className="h-3 leading-3" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex gap-1 h-3.5 text-[10px] font-medium text-muted-foreground/70 select-none">
                        {weeks.map((_, weekIndex) => {
                          const monthItem = monthLabels.find((item) => item.weekIndex === weekIndex);
                          return (
                            <div key={weekIndex} className="w-3 shrink-0 text-left overflow-visible">
                              {monthItem?.label && <span className="whitespace-nowrap">{monthItem.label}</span>}
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex gap-1">
                        {weeks.map((week, weekIndex) => (
                          <div key={weekIndex} className="flex flex-col gap-1 shrink-0">
                            {week.map((day, dayIndex) => {
                              if (!day) return <div key={`empty-${weekIndex}-${dayIndex}`} className="w-3 h-3 rounded-full shrink-0 bg-transparent" />;
                              const formattedDate = format(day.date, 'dd/MM/yyyy');
                              const isToday = isSameDay(day.date, today);
                              const safeCount = day.count || 0;

                              return (
                                <Tooltip key={day.dateStr}>
                                  <TooltipTrigger
                                    render={
                                      <div
                                        tabIndex={0}
                                        className={cn(
                                          'w-3 h-3 rounded-full shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 focus-visible:ring-offset-card animate-in fade-in zoom-in-90',
                                          getIntensityClass(safeCount),
                                          isToday && 'ring-2 ring-primary ring-offset-2 ring-offset-card',
                                          safeCount > 0 && 'hover:scale-150 hover:z-10',
                                        )}
                                        style={{ animationDelay: `${(weekIndex + dayIndex) % 500}ms` }}
                                      />
                                    }
                                  />
                                  <TooltipContent side="top" align="center" className="rounded-xl bg-card border border-border shadow-lg px-3 py-2">
                                    <div className="space-y-1 min-w-[120px]">
                                      <p className="text-xs font-bold text-foreground">
                                        {formattedDate}{isToday && <span className="text-primary ml-1">• Hôm nay</span>}
                                      </p>
                                      <div className="flex items-center justify-between gap-3 text-[11px]">
                                        <span className="text-muted-foreground">Hoạt động:</span>
                                        <span className="font-bold text-foreground">{safeCount > 0 ? `${safeCount} đóng góp` : 'Chưa có'}</span>
                                      </div>
                                      {safeCount > 0 && (
                                        <div className="w-full h-1.5 rounded-full bg-muted/50 mt-1 overflow-hidden">
                                          <div
                                            className={cn('h-full rounded-full transition-all', getIntensityDotClass(Math.min(safeCount, 30)))}
                                            style={{ width: `${Math.min((safeCount / 30) * 100, 100)}%` }}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <HeatmapLegend activeDaysCount={activeDaysCount} averagePerDay={averagePerDay} lessText={t('less')} moreText={t('more')} />
              </div>

              <HeatmapInsightsSidebar streak={streak} todayStudyMinutes={todayStudyMinutes} dailyGoalMinutes={dailyGoalMinutes} averagePerDay={averagePerDay} totalActivities={totalActivities} />
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

function HeatmapLegend({ activeDaysCount, averagePerDay, lessText, moreText }: { activeDaysCount: number; averagePerDay: number; lessText: string; moreText: string }) {
  const legendItems = [
    { count: 0, label: '0' },
    { count: 1, label: '1-2' },
    { count: 5, label: '3-6' },
    { count: 12, label: '7-14' },
    { count: 25, label: '15+' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground pt-2 border-t border-border/30">
      <span className="text-[10px] text-muted-foreground/80 font-medium">
        {activeDaysCount} ngày học tích cực · trung bình <strong className="text-foreground">{averagePerDay}</strong> hoạt động/ngày
      </span>
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground/80">{lessText}</span>
        {legendItems.map((item) => (
          <Tooltip key={item.label}>
            <TooltipTrigger render={<div className={cn('w-2.5 h-2.5 rounded-full cursor-help', getIntensityDotClass(item.count))} />} />
            <TooltipContent side="top" align="center">
              <span className="text-[10px]">{item.label} hoạt động</span>
            </TooltipContent>
          </Tooltip>
        ))}
        <span className="text-muted-foreground/80">{moreText}</span>
      </div>
    </div>
  );
}

function HeatmapInsightsSidebar({ streak, todayStudyMinutes, dailyGoalMinutes, averagePerDay, totalActivities }: { streak: number; todayStudyMinutes: number; dailyGoalMinutes: number; averagePerDay: number; totalActivities: number }) {
  const goalProgress = useMemo(() => {
    const safeGoal = dailyGoalMinutes > 0 ? dailyGoalMinutes : 15;
    return Math.min(100, Math.round((todayStudyMinutes / safeGoal) * 100));
  }, [todayStudyMinutes, dailyGoalMinutes]);

  return (
    <div className="hidden lg:flex flex-col justify-between w-64 xl:w-72 border-l border-border/40 pl-6 py-0.5 shrink-0 space-y-3">
      <div>
        <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <Icons name="sparkles" className="h-3.5 w-3.5 text-primary" />
          Thống kê chuyên cần
        </p>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Chuỗi học tập:</span>
            <span className="font-bold text-foreground flex items-center gap-1">
              <Icons name="flame" className="h-3.5 w-3.5 text-orange-500" />
              {streak} ngày
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Thời gian hôm nay:</span>
            <span className="font-bold text-foreground">{todayStudyMinutes} phút</span>
          </div>

          {dailyGoalMinutes > 0 && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Mục tiêu hôm nay:</span>
                <span className="font-semibold text-foreground">{todayStudyMinutes}/{dailyGoalMinutes}m</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted/40 overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${goalProgress}%` }} />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Trung bình/ngày:</span>
            <span className="font-bold text-primary">{averagePerDay} lượt</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Tổng hoạt động:</span>
            <span className="font-bold text-foreground">{totalActivities} lượt</span>
          </div>
        </div>
      </div>

      <div className="p-2.5 rounded-2xl bg-muted/30 border border-border/40 text-[11px] text-muted-foreground leading-relaxed">
        Học đều đặn mỗi ngày từ 10-15 phút kích hoạt chu kỳ lặp lại ngắt quãng tối ưu của thuật toán FSRS.
      </div>
    </div>
  );
}
