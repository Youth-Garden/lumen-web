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
import { format, isSameDay, startOfDay, subDays } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useLocale, useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import {
  Area,
  AreaChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';

import { ChartContainer } from '@/shared/components/chart/chart-container';
import {
  ChartTooltip,
  ChartTooltipCard,
  ChartTooltipRow,
  ChartTooltipSeparator,
  ChartTooltipTitle,
} from '@/shared/components/chart/chart-tooltip';

interface StudyGoalConsistencyChartProps {
  heatmapData: HeatmapItem[] | undefined;
  dailyGoalMinutes: number;
  todayStudyMinutes: number;
  streak: number;
  isLoading?: boolean;
}

export function StudyGoalConsistencyChart({
  heatmapData,
  dailyGoalMinutes,
  todayStudyMinutes,
  streak,
  isLoading = false,
}: StudyGoalConsistencyChartProps) {
  const t = useTranslations('Dashboard.Overview');
  const tDashboard = useTranslations('Dashboard');
  const locale = useLocale();
  const dateLocale = locale === 'vi' ? vi : undefined;

  const chartData = useMemo(() => {
    const today = startOfDay(new Date());
    const safeGoal = Math.max(dailyGoalMinutes, 1);

    const historyMap = new Map<string, number>();
    heatmapData?.forEach((item) => {
      if (item?.date) {
        const dStr = String(item.date).slice(0, 10);
        historyMap.set(dStr, (historyMap.get(dStr) || 0) + (Number(item.count) || 0));
      }
    });

    const days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));

    return days.map((date) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const isCurrentDay = isSameDay(date, today);

      let minutes = 0;
      if (isCurrentDay) {
        minutes = todayStudyMinutes;
      } else {
        const count = historyMap.get(dateStr) || 0;
        minutes = count > 0 ? Math.min(count * 5, dailyGoalMinutes * 1.5) : 0;
      }

      const percentage = Math.min(150, Math.round((minutes / safeGoal) * 100));

      return {
        dateStr,
        dayName: format(date, 'EEE', { locale: dateLocale }),
        minutes,
        percentage,
        isToday: isCurrentDay,
      };
    });
  }, [heatmapData, dailyGoalMinutes, todayStudyMinutes, dateLocale]);

  const completedDays = useMemo(() => {
    return chartData.filter((d) => d.percentage >= 100).length;
  }, [chartData]);

  if (isLoading) {
    return (
      <Card className="rounded-3xl border-none bg-card shadow-xs p-6 space-y-4">
        <Skeleton className="h-6 w-40 rounded-lg" />
        <Skeleton className="h-44 w-full rounded-2xl" />
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-none bg-card shadow-xs overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icons name="target" className="h-4 w-4" />
              </div>
              <CardTitle className="text-base font-bold font-heading text-foreground">
                {t('goalConsistencyTitle')}
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              {t('goalConsistencyDesc')}
            </CardDescription>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1">
            <Icons name="check" className="h-3 w-3" />
            {completedDays}/7 {t('days')}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-2 pt-1">
        {/* Sub-kpis */}
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1 pb-1">
          <span>
            {tDashboard('streakLabel')}:{' '}
            <strong className="text-foreground font-semibold">{streak}</strong>{' '}
            {t('days')}
          </span>
          <span>
            {t('dailyGoalLine')}:{' '}
            <strong className="text-foreground font-semibold">
              {dailyGoalMinutes}m
            </strong>
          </span>
        </div>

        {/* Area Chart */}
        <div className="h-36 w-full -ml-2">
          <ChartContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 15, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="goalAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="dayName"
                stroke="var(--muted-foreground)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={[0, 120]}
                ticks={[0, 30, 60, 90, 120]}
                tickFormatter={(val) => `${val}%`}
                stroke="var(--muted-foreground)"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const item = payload[0].payload;
                  return (
                    <ChartTooltipCard>
                      <ChartTooltipTitle>
                        {item.dateStr} {item.isToday && `(${t('today')})`}
                      </ChartTooltipTitle>
                      <ChartTooltipRow
                        color="var(--primary)"
                        label={t('studiedMinutes')}
                        value={`${item.minutes}m`}
                        subValue={`/ ${dailyGoalMinutes}m`}
                      />
                      <ChartTooltipSeparator />
                      <ChartTooltipRow
                        label={t('goalConsistencyTitle')}
                        value={`${item.percentage}%`}
                      />
                    </ChartTooltipCard>
                  );
                }}
              />
              <ReferenceLine
                y={100}
                stroke="var(--primary)"
                strokeDasharray="3 3"
                strokeOpacity={0.4}
              />
              <Area
                type="monotone"
                dataKey="percentage"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#goalAreaGradient)"
                activeDot={{
                  r: 5,
                  fill: 'var(--card)',
                  stroke: 'var(--primary)',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
