'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  TooltipProvider,
} from '@lumen/uikit/components';
import { cn } from '@lumen/uikit/utils';
import { eachDayOfInterval, format, startOfDay } from 'date-fns';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useHeatmap } from '@/features/dashboard/hooks';
import { useAuthStore } from '@/store/auth.store';
import type { HeatmapCalendarProps } from '../types/heatmap.types';
import {
  buildHeatmapMap,
  buildHeatmapWeeksAndMonthLabels,
  calculateHeatmapStats,
} from '../utils/heatmap.utils';
import { HeatmapGrid } from './heatmap/heatmap-grid';
import { HeatmapInsightsSidebar } from './heatmap/heatmap-insights-sidebar';
import { HeatmapLegend } from './heatmap/heatmap-legend';
import { HeatmapSkeleton } from './heatmap/heatmap-skeleton';
import { HeatmapYearSelector } from './heatmap/heatmap-year-selector';

export function HeatmapCalendar({
  data: externalData,
  isLoading: externalLoading,
  todayStudyMinutes = 0,
  streak = 0,
  selectedYear: controlledYear,
  onSelectYear,
}: HeatmapCalendarProps) {
  const t = useTranslations('Dashboard');
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

  const heatmapMap = useMemo(
    () =>
      buildHeatmapMap(
        data,
        activeYear,
        currentYear,
        todayStr,
        todayStudyMinutes,
        streak,
      ),
    [data, activeYear, currentYear, todayStr, todayStudyMinutes, streak],
  );

  const { totalActivities, activeDaysCount, longestStreak, averagePerDay } =
    useMemo(() => calculateHeatmapStats(days, heatmapMap), [days, heatmapMap]);

  const { weeks, monthLabels } = useMemo(
    () => buildHeatmapWeeksAndMonthLabels(days, heatmapMap, today),
    [days, heatmapMap, today],
  );

  return (
    <TooltipProvider delay={100}>
      <Card className="rounded-3xl border-none bg-card shadow-xs overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-bold font-heading text-foreground">
            {t('activityHeatmap')}
          </CardTitle>
          {!isInitialLoading && (
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
                <HeatmapGrid
                  weeks={weeks}
                  monthLabels={monthLabels}
                  today={today}
                  scrollContainerRef={scrollContainerRef}
                />

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

              <HeatmapYearSelector
                availableYears={availableYears}
                activeYear={activeYear}
                onSelectYear={handleYearChange}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
