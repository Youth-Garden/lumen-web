'use client';

import { useHeatmap } from '@/features/dashboard/hooks';
import { HeatmapItem } from '@/services/progress';
import { useAuthStore } from '@/store/auth.store';
import {
  Button,
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
import {
  eachDayOfInterval,
  format,
  isAfter,
  isSameDay,
  startOfDay,
} from 'date-fns';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';

import {
  ChartTooltipRow,
  ChartTooltipTitle,
} from '@/shared/components/chart/chart-tooltip';

interface HeatmapCalendarProps {
  data?: HeatmapItem[];
  isLoading?: boolean;
  todayStudyMinutes?: number;
  streak?: number;
  dailyGoalMinutes?: number;
  selectedYear?: number;
  onSelectYear?: (year: number) => void;
}

interface CalendarDay {
  date: Date;
  dateStr: string;
  count: number;
  isFuture: boolean;
}

function getIntensityClass(count: number): string {
  if (count === 0)
    return 'bg-muted/70 dark:bg-muted/50 hover:bg-muted/90 transition-colors duration-200';
  if (count < 3)
    return 'bg-indigo-200 dark:bg-indigo-900/50 hover:bg-indigo-300 dark:hover:bg-indigo-800 transition-colors duration-200';
  if (count < 7)
    return 'bg-indigo-300 dark:bg-indigo-800/60 hover:bg-indigo-400 dark:hover:bg-indigo-700 transition-colors duration-200';
  if (count < 15)
    return 'bg-indigo-500 dark:bg-indigo-700/70 hover:bg-indigo-600 dark:hover:bg-indigo-600 transition-colors duration-200';
  if (count < 30)
    return 'bg-indigo-600 dark:bg-indigo-600/80 hover:bg-indigo-700 dark:hover:bg-indigo-700 transition-colors duration-200';
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
  data: externalData,
  isLoading: externalLoading,
  todayStudyMinutes = 0,
  streak = 0,
  selectedYear: controlledYear,
  onSelectYear,
}: HeatmapCalendarProps) {
  const t = useTranslations('Dashboard');
  const tOverview = useTranslations('Dashboard.Overview');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const user = useAuthStore((state) => state.user);
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const createdYear = useMemo(() => {
    if (user?.createdAt) {
      const year = new Date(user.createdAt).getFullYear();
      if (!isNaN(year) && year <= currentYear && year >= 2020) return year;
    }
    return currentYear;
  }, [user?.createdAt, currentYear]);

  const [internalYear, setInternalYear] = useState<number>(currentYear);
  const activeYear = controlledYear ?? internalYear;

  const {
    data: fetchedData,
    isLoading: fetchLoading,
    isFetching,
  } = useHeatmap(activeYear);
  const data = externalData ?? fetchedData;
  const isInitialLoading = (externalLoading ?? fetchLoading) && !data;

  const availableYears = useMemo(() => {
    const years: number[] = [];
    for (let y = currentYear; y >= createdYear; y--) {
      years.push(y);
    }
    return years;
  }, [currentYear, createdYear]);

  const handleYearChange = (year: number) => {
    if (onSelectYear) {
      onSelectYear(year);
    } else {
      setInternalYear(year);
    }
  };

  const today = useMemo(() => startOfDay(new Date()), []);
  const todayStr = useMemo(() => format(today, 'yyyy-MM-dd'), [today]);

  useEffect(() => {
    if (!isInitialLoading && scrollContainerRef.current) {
      if (activeYear === currentYear) {
        scrollContainerRef.current.scrollLeft =
          scrollContainerRef.current.scrollWidth;
      } else {
        scrollContainerRef.current.scrollLeft = 0;
      }
    }
  }, [isInitialLoading, data, activeYear, currentYear]);

  const days = useMemo(() => {
    const startDate = new Date(activeYear, 0, 1);
    const endDate = new Date(activeYear, 11, 31);
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, [activeYear]);

  const heatmapMap = useMemo(() => {
    const map = new Map<string, number>();
    data?.forEach((item) => {
      if (item?.date) {
        const normalized = String(item.date).slice(0, 10);
        map.set(
          normalized,
          (map.get(normalized) || 0) + (Number(item.count) || 0),
        );
      }
    });
    if (activeYear === currentYear) {
      const currentTodayCount = map.get(todayStr) || 0;
      if (currentTodayCount === 0 && (todayStudyMinutes > 0 || streak > 0)) {
        map.set(
          todayStr,
          Math.max(1, Math.round((todayStudyMinutes || 10) / 2)),
        );
      }
    }
    return map;
  }, [data, todayStr, todayStudyMinutes, streak, activeYear, currentYear]);

  const totalActivities = useMemo(() => {
    let sum = 0;
    heatmapMap.forEach((count) => {
      sum += count;
    });
    return sum;
  }, [heatmapMap]);

  const activeDaysCount = useMemo(() => {
    let count = 0;
    heatmapMap.forEach((c) => {
      if (c > 0) count++;
    });
    return count;
  }, [heatmapMap]);

  const longestStreak = useMemo(() => {
    let maxStreak = 0;
    let currentConsecutive = 0;

    days.forEach((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = heatmapMap.get(dateStr) || 0;
      if (count > 0) {
        currentConsecutive++;
        if (currentConsecutive > maxStreak) {
          maxStreak = currentConsecutive;
        }
      } else {
        currentConsecutive = 0;
      }
    });

    return maxStreak;
  }, [days, heatmapMap]);

  const averagePerDay = useMemo(
    () =>
      activeDaysCount > 0
        ? Math.round((totalActivities / activeDaysCount) * 10) / 10
        : 0,
    [totalActivities, activeDaysCount],
  );

  const { weeks, monthLabels } = useMemo(() => {
    const weeksList: (CalendarDay | null)[][] = [];
    let currentWeek: (CalendarDay | null)[] = [];
    const firstDayOfWeek = days[0].getDay();

    for (let idx = 0; idx < firstDayOfWeek; idx++) currentWeek.push(null);
    days.forEach((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const isFuture = isAfter(date, today);
      currentWeek.push({
        date,
        dateStr,
        count: heatmapMap.get(dateStr) || 0,
        isFuture,
      });
      if (currentWeek.length === 7) {
        weeksList.push(currentWeek);
        currentWeek = [];
      }
    });
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null);
      weeksList.push(currentWeek);
    }

    const labels: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;
    weeksList.forEach((week, weekIndex) => {
      const firstValidDay = week.find(
        (day): day is CalendarDay => day !== null,
      );
      if (firstValidDay) {
        const month = firstValidDay.date.getMonth();
        if (month !== lastMonth) {
          labels.push({ weekIndex, label: format(firstValidDay.date, 'MMM') });
          lastMonth = month;
        }
      }
    });

    return { weeks: weeksList, monthLabels: labels };
  }, [days, heatmapMap, today]);

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
          {isInitialLoading ? (
            <Skeleton className="w-28 h-4 rounded-md" />
          ) : (
            <span className="text-xs text-muted-foreground font-medium">
              {totalActivities} {t('contributionsInYear', { year: activeYear })}
            </span>
          )}
        </CardHeader>

        <CardContent className="pt-1">
          {isInitialLoading ? (
            <HeatmapSkeleton yearsCount={availableYears.length} />
          ) : (
            <div className="flex flex-col lg:flex-row items-stretch gap-6">
              <div
                className={cn(
                  'flex-1 min-w-0 flex flex-col justify-between gap-3 transition-opacity duration-200',
                  isFetching && 'opacity-70',
                )}
              >
                <div
                  ref={scrollContainerRef}
                  className="overflow-x-auto pb-1 scrollbar-thin scroll-smooth"
                >
                  <div className="flex gap-2.5 w-max py-1">
                    <div className="flex flex-col gap-1 text-[10px] font-medium text-muted-foreground/70 select-none pt-5 shrink-0">
                      <span className="h-3 leading-3" />
                      <span className="h-3 leading-3">{t('dayMon')}</span>
                      <span className="h-3 leading-3" />
                      <span className="h-3 leading-3">{t('dayWed')}</span>
                      <span className="h-3 leading-3" />
                      <span className="h-3 leading-3">{t('dayFri')}</span>
                      <span className="h-3 leading-3" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex gap-1 h-3.5 text-[10px] font-medium text-muted-foreground/70 select-none">
                        {weeks.map((_, weekIndex) => {
                          const monthItem = monthLabels.find(
                            (item) => item.weekIndex === weekIndex,
                          );
                          return (
                            <div
                              key={weekIndex}
                              className="w-3 shrink-0 text-left overflow-visible"
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

                      <div className="flex gap-1">
                        {weeks.map((week, weekIndex) => (
                          <div
                            key={weekIndex}
                            className="flex flex-col gap-1 shrink-0"
                          >
                            {week.map((day, dayIndex) => {
                              if (!day)
                                return (
                                  <div
                                    key={`empty-${weekIndex}-${dayIndex}`}
                                    className="w-3 h-3 rounded-full shrink-0 bg-transparent"
                                  />
                                );

                              if (day.isFuture) {
                                return (
                                  <div
                                    key={day.dateStr}
                                    className="w-3 h-3 rounded-full shrink-0 bg-muted/40 dark:bg-muted/30"
                                  />
                                );
                              }

                              const formattedDate = format(
                                day.date,
                                'dd/MM/yyyy',
                              );
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
                                          isToday &&
                                            'ring-2 ring-primary ring-offset-2 ring-offset-card',
                                          safeCount > 0 &&
                                            'hover:scale-150 hover:z-10',
                                        )}
                                        style={{
                                          animationDelay: `${(weekIndex + dayIndex) % 500}ms`,
                                        }}
                                      />
                                    }
                                  />
                                  <TooltipContent
                                    variant="card"
                                    side="top"
                                    align="center"
                                    sideOffset={6}
                                    className="p-3 min-w-[140px] space-y-1.5 pointer-events-none"
                                  >
                                    <ChartTooltipTitle>
                                      {formattedDate}{' '}
                                      {isToday && `• ${tOverview('today')}`}
                                    </ChartTooltipTitle>
                                    <ChartTooltipRow
                                      color={
                                        safeCount > 0
                                          ? 'var(--primary)'
                                          : 'var(--muted)'
                                      }
                                      label={t('totalActivities')}
                                      value={
                                        safeCount > 0
                                          ? t('activitiesValue', {
                                              count: safeCount,
                                            })
                                          : 0
                                      }
                                    />
                                    {safeCount > 0 && (
                                      <div className="w-full h-1.5 rounded-full bg-muted/50 mt-0.5 overflow-hidden">
                                        <div
                                          className={cn(
                                            'h-full rounded-full transition-all',
                                            getIntensityDotClass(
                                              Math.min(safeCount, 30),
                                            ),
                                          )}
                                          style={{
                                            width: `${Math.min((safeCount / 30) * 100, 100)}%`,
                                          }}
                                        />
                                      </div>
                                    )}
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

                <HeatmapLegend
                  activeDaysCount={activeDaysCount}
                  averagePerDay={averagePerDay}
                  lessText={t('less')}
                  moreText={t('more')}
                />
              </div>

              <HeatmapInsightsSidebar
                activeYear={activeYear}
                currentYear={currentYear}
                streak={streak}
                longestStreak={longestStreak}
                activeDaysCount={activeDaysCount}
                totalDaysInYear={days.length}
                averagePerDay={averagePerDay}
                totalActivities={totalActivities}
              />

              <div className="flex flex-row lg:flex-col gap-1.5 shrink-0 border-t lg:border-t-0 lg:border-l border-border/40 pt-3 lg:pt-0 lg:pl-5 justify-start">
                {availableYears.map((year) => {
                  const isSelected = activeYear === year;
                  return (
                    <Button
                      key={year}
                      variant={isSelected ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => handleYearChange(year)}
                      className="font-semibold text-xs h-8 px-3"
                    >
                      {year}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}

function HeatmapSkeleton({ yearsCount = 1 }: { yearsCount?: number }) {
  const dummyWeeks = Array.from({ length: 53 });
  const dummyDays = Array.from({ length: 7 });

  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-6 animate-pulse">
      {/* Grid Skeleton */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
        <div className="overflow-x-auto pb-1 scrollbar-thin">
          <div className="flex gap-2.5 w-max py-1">
            <div className="flex flex-col gap-1 pt-5 shrink-0">
              <Skeleton className="w-4 h-3 rounded" />
              <Skeleton className="w-4 h-3 rounded" />
              <Skeleton className="w-4 h-3 rounded" />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex gap-2 h-3.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="w-8 h-3 rounded shrink-0 mr-2" />
                ))}
              </div>

              <div className="flex gap-1">
                {dummyWeeks.map((_, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1 shrink-0">
                    {dummyDays.map((_, dIdx) => (
                      <div
                        key={dIdx}
                        className="w-3 h-3 rounded-full bg-muted/40 shrink-0"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend Skeleton */}
        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <Skeleton className="w-48 h-3 rounded" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="w-6 h-3 rounded" />
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full bg-muted/40" />
              ))}
            </div>
            <Skeleton className="w-6 h-3 rounded" />
          </div>
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="hidden lg:flex flex-col justify-between w-60 xl:w-64 border-l border-border/40 pl-5 py-0.5 shrink-0 space-y-3">
        <div className="space-y-3">
          <Skeleton className="w-32 h-4 rounded" />
          <div className="space-y-2.5">
            <Skeleton className="w-full h-3 rounded" />
            <Skeleton className="w-full h-3 rounded" />
            <Skeleton className="w-full h-3 rounded" />
            <Skeleton className="w-full h-3 rounded" />
          </div>
        </div>
        <Skeleton className="w-full h-12 rounded-2xl" />
      </div>

      {/* Year Column Skeleton */}
      <div className="flex flex-row lg:flex-col gap-1.5 shrink-0 border-t lg:border-t-0 lg:border-l border-border/40 pt-3 lg:pt-0 lg:pl-5 justify-start">
        {Array.from({ length: Math.max(yearsCount, 1) }).map((_, i) => (
          <Skeleton key={i} className="w-14 h-8 rounded-lg shrink-0" />
        ))}
      </div>
    </div>
  );
}

function HeatmapLegend({
  activeDaysCount,
  averagePerDay,
  lessText,
  moreText,
}: {
  activeDaysCount: number;
  averagePerDay: number;
  lessText: string;
  moreText: string;
}) {
  const t = useTranslations('Dashboard');
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
        {t('activeDaysSummary', {
          activeDays: activeDaysCount,
          avg: averagePerDay,
        })}
      </span>
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground/80">{lessText}</span>
        {legendItems.map((item) => (
          <Tooltip key={item.label}>
            <TooltipTrigger
              render={
                <div
                  className={cn(
                    'w-2.5 h-2.5 rounded-full cursor-help',
                    getIntensityDotClass(item.count),
                  )}
                />
              }
            />
            <TooltipContent
              variant="card"
              side="top"
              align="center"
              sideOffset={6}
              className="p-2 min-w-[85px] pointer-events-none"
            >
              <span className="text-[10px] font-semibold text-foreground">
                {item.label} {t('totalActivities').toLowerCase()}
              </span>
            </TooltipContent>
          </Tooltip>
        ))}
        <span className="text-muted-foreground/80">{moreText}</span>
      </div>
    </div>
  );
}

interface HeatmapInsightsSidebarProps {
  activeYear: number;
  currentYear: number;
  streak: number;
  longestStreak: number;
  activeDaysCount: number;
  totalDaysInYear: number;
  averagePerDay: number;
  totalActivities: number;
}

function HeatmapInsightsSidebar({
  activeYear,
  currentYear,
  streak,
  longestStreak,
  activeDaysCount,
  totalDaysInYear,
  averagePerDay,
  totalActivities,
}: HeatmapInsightsSidebarProps) {
  const t = useTranslations('Dashboard');
  const isCurrentYear = activeYear === currentYear;

  return (
    <div className="hidden lg:flex flex-col justify-between w-60 xl:w-64 border-l border-border/40 pl-5 py-0.5 shrink-0 space-y-3">
      <div>
        <p className="text-xs font-semibold text-foreground mb-3 flex items-center gap-1.5">
          <Icons name="sparkles" className="h-3.5 w-3.5 text-primary" />
          {t('statsTitleYear', { year: activeYear })}
        </p>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {t('activeDaysLabel')}:
            </span>
            <span className="font-bold text-foreground">
              {t('daysValue', { count: activeDaysCount })}
              <span className="text-muted-foreground font-normal ml-1 text-[11px]">
                /{totalDaysInYear}
              </span>
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {t('longestStreakLabel')}:
            </span>
            <span className="font-bold text-foreground flex items-center gap-1">
              <Icons name="award" className="h-3.5 w-3.5 text-amber-500" />
              {t('daysValue', { count: longestStreak })}
            </span>
          </div>

          {isCurrentYear ? (
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{t('streakLabel')}:</span>
              <span className="font-bold text-foreground flex items-center gap-1">
                <Icons name="flame" className="h-3.5 w-3.5 text-orange-500" />
                {t('daysValue', { count: streak })}
              </span>
            </div>
          ) : null}

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{t('avgPerDay')}:</span>
            <span className="font-bold text-primary">
              {t('activitiesValue', { count: averagePerDay })}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              {t('totalActivities')}:
            </span>
            <span className="font-bold text-foreground">
              {t('activitiesValue', { count: totalActivities })}
            </span>
          </div>
        </div>
      </div>

      <div className="p-2.5 rounded-2xl bg-muted/30 border border-border/40 text-[11px] text-muted-foreground leading-relaxed">
        {t('fsrsTip')}
      </div>
    </div>
  );
}
