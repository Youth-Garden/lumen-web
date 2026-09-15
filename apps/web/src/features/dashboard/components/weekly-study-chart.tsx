'use client';

import { HeatmapItem } from '@/services/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  SegmentedTabs,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { format, startOfDay, subDays } from 'date-fns';
import { useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface WeeklyStudyChartProps {
  heatmapData?: HeatmapItem[];
  dailyGoalMinutes: number;
  todayStudyMinutes: number;
  isLoading?: boolean;
}

interface ChartDayItem {
  dateStr: string;
  dayLabel: string;
  fullDate: string;
  minutes: number;
  goal: number;
  isGoalMet: boolean;
  isToday: boolean;
}

export function WeeklyStudyChart({
  heatmapData = [],
  dailyGoalMinutes,
  todayStudyMinutes,
  isLoading = false,
}: WeeklyStudyChartProps) {
  const t = useTranslations('Dashboard.Overview');
  const [period, setPeriod] = useState<'7d' | '30d'>('7d');

  const safeGoal = dailyGoalMinutes > 0 ? dailyGoalMinutes : 15;

  const dataMap = useMemo(() => {
    const map = new Map<string, number>();
    heatmapData.forEach((item) => {
      map.set(item.date, item.count);
    });
    return map;
  }, [heatmapData]);

  const chartData: ChartDayItem[] = useMemo(() => {
    const today = startOfDay(new Date());
    const todayStr = format(today, 'yyyy-MM-dd');
    const dayCount = period === '7d' ? 7 : 30;

    const list: ChartDayItem[] = [];

    for (let i = dayCount - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const isToday = dateStr === todayStr;

      const activityCount = dataMap.get(dateStr) || 0;
      let minutes = 0;

      if (isToday) {
        minutes = todayStudyMinutes;
      } else if (activityCount > 0) {
        minutes = Math.max(5, Math.round(activityCount * 2));
      }

      const dayLabel =
        period === '7d'
          ? format(date, 'EEE')
          : i % 5 === 0 || i === 0
            ? format(date, 'd/M')
            : '';

      list.push({
        dateStr,
        dayLabel,
        fullDate: format(date, 'dd/MM/yyyy'),
        minutes,
        goal: safeGoal,
        isGoalMet: minutes >= safeGoal,
        isToday,
      });
    }

    return list;
  }, [period, dataMap, todayStudyMinutes, safeGoal]);

  const stats = useMemo(() => {
    const totalMinutes = chartData.reduce((acc, cur) => acc + cur.minutes, 0);
    const avgMinutes = Math.round(totalMinutes / chartData.length);
    const metCount = chartData.filter((cur) => cur.isGoalMet).length;

    return {
      totalMinutes,
      avgMinutes,
      metCount,
    };
  }, [chartData]);

  if (isLoading) {
    return (
      <Card className="rounded-3xl border-none bg-card shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48 rounded-lg" />
          <Skeleton className="h-8 w-28 rounded-xl" />
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </Card>
    );
  }

  const maxMinutes = Math.max(...chartData.map((d) => d.minutes), safeGoal);
  const yDomainMax = Math.ceil((maxMinutes * 1.2) / 5) * 5;

  return (
    <Card className="rounded-3xl border-none bg-card shadow-xs overflow-hidden h-full flex flex-col justify-between">
      {/* Header */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icons name="bar-chart-2" className="h-4 w-4" />
            </div>
            <CardTitle className="text-lg font-bold font-heading text-foreground">
              {t('studyTrends')}
            </CardTitle>
          </div>
          <CardDescription className="text-xs text-muted-foreground">
            {t('studyTrendsDesc')}
          </CardDescription>
        </div>

        {/* Period Switcher */}
        <SegmentedTabs<'7d' | '30d'>
          value={period}
          onValueChange={setPeriod}
          options={[
            { value: '7d', label: t('last7Days') },
            { value: '30d', label: t('last30Days') },
          ]}
          size="sm"
          className="self-start sm:self-auto"
        />
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {/* Minimalist Typographic Stats Header (No box-in-box clutter) */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground border-b border-border/40 pb-3">
          <div>
            <span>{t('weeklyTotal')}: </span>
            <strong className="text-sm font-bold text-foreground font-heading ml-1">
              {stats.totalMinutes}m
            </strong>
          </div>
          <div>
            <span>{t('dailyAverage')}: </span>
            <strong className="text-sm font-bold text-foreground font-heading ml-1">
              {stats.avgMinutes}m
            </strong>
          </div>
          <div>
            <span>{t('goalsMet')}: </span>
            <strong className="text-sm font-bold text-success font-heading ml-1">
              {stats.metCount}/{chartData.length} {t('days')}
            </strong>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 35, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
                opacity={0.4}
              />
              <XAxis
                dataKey="dayLabel"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
              />
              <YAxis
                domain={[0, yDomainMax]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                unit="m"
                allowDecimals={false}
              />
              <Tooltip
                cursor={{ fill: 'var(--muted)', opacity: 0.15 }}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const item = payload[0].payload as ChartDayItem;
                  return (
                    <div className="rounded-2xl border-none bg-card p-3 shadow-md text-card-foreground space-y-1.5 min-w-[130px]">
                      <p className="text-[11px] font-bold text-muted-foreground">
                        {item.fullDate} {item.isToday && `• ${t('today')}`}
                      </p>
                      <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="font-medium text-muted-foreground">
                          {t('studiedMinutes')}:
                        </span>
                        <span className="font-black font-heading text-foreground">
                          {item.minutes}m
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-[11px] pt-1 border-t border-border/40 text-muted-foreground">
                        <span>{t('dailyGoalLine')}:</span>
                        <span className="font-semibold text-foreground">
                          {item.goal}m
                        </span>
                      </div>
                      {item.isGoalMet && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-success pt-0.5">
                          <Icons name="check" className="h-3 w-3" />
                          <span>{t('goalsMet')}</span>
                        </div>
                      )}
                    </div>
                  );
                }}
              />
              <ReferenceLine
                y={safeGoal}
                stroke="var(--primary)"
                strokeDasharray="4 4"
                strokeOpacity={0.5}
                label={{
                  value: `${safeGoal}m ${t('dailyGoalLine')}`,
                  fill: 'var(--primary)',
                  fontSize: 10,
                  position: 'insideTopRight',
                  offset: 8,
                }}
              />
              <Bar
                dataKey="minutes"
                radius={[6, 6, 6, 6]}
                maxBarSize={period === '7d' ? 32 : 12}
                minPointSize={4}
                background={{ fill: 'var(--muted)', opacity: 0.2, radius: 6 }}
              >
                {chartData.map((entry) => (
                  <Cell
                    key={entry.dateStr}
                    fill={
                      entry.isGoalMet
                        ? 'var(--success)'
                        : entry.isToday
                          ? 'var(--primary)'
                          : entry.minutes > 0
                            ? 'var(--chart-2)'
                            : 'var(--muted)'
                    }
                    opacity={entry.minutes > 0 ? 1 : 0.4}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
