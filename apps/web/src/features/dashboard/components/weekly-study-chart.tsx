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
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
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
  displayMinutes: number;
  goal: number;
  isGoalMet: boolean;
  isToday: boolean;
}

function formatDayLabel(date: Date, locale: string): string {
  if (locale === 'vi') {
    const day = date.getDay();
    if (day === 0) return 'CN';
    return `T${day + 1}`;
  }
  return format(date, 'EEE');
}

interface CustomLabelProps {
  x?: number;
  y?: number;
  width?: number;
  value?: number;
}

function renderBarTopLabel(props: CustomLabelProps) {
  const { x = 0, y = 0, width = 0, value } = props;
  if (value === undefined || value === null) return null;
  const isZero = value === 0;

  return (
    <text
      x={x + width / 2}
      y={y - 6}
      fill={isZero ? 'var(--muted-foreground)' : 'var(--foreground)'}
      textAnchor="middle"
      fontSize={isZero ? 10 : 11}
      fontWeight={isZero ? 500 : 700}
      opacity={isZero ? 0.45 : 1}
    >
      {value}m
    </text>
  );
}

export function WeeklyStudyChart({
  heatmapData = [],
  dailyGoalMinutes,
  todayStudyMinutes,
  isLoading = false,
}: WeeklyStudyChartProps) {
  const t = useTranslations('Dashboard.Overview');
  const locale = useLocale();
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
        const estimatedFromActivity =
          activityCount > 0 ? Math.max(5, Math.round(activityCount * 2)) : 0;
        minutes = Math.max(todayStudyMinutes, estimatedFromActivity);
      } else if (activityCount > 0) {
        minutes = Math.max(5, Math.round(activityCount * 2));
      }

      const dayLabel =
        period === '7d'
          ? formatDayLabel(date, locale)
          : i % 5 === 0 || i === 0
            ? format(date, 'd/M')
            : '';

      list.push({
        dateStr,
        dayLabel,
        fullDate: format(date, 'dd/MM/yyyy'),
        minutes,
        displayMinutes: minutes,
        goal: safeGoal,
        isGoalMet: minutes >= safeGoal,
        isToday,
      });
    }

    return list;
  }, [period, dataMap, todayStudyMinutes, safeGoal, locale]);

  const stats = useMemo(() => {
    const totalMinutes = chartData.reduce((acc, cur) => acc + cur.minutes, 0);
    const avgMinutes = Math.round(totalMinutes / chartData.length);
    const metCount = chartData.filter((cur) => cur.isGoalMet).length;

    return { totalMinutes, avgMinutes, metCount };
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
  const yDomainMax = Math.ceil((maxMinutes * 1.25) / 5) * 5;

  return (
    <Card className="rounded-3xl border-none bg-card shadow-xs overflow-hidden h-full flex flex-col justify-between">
      {/* Header */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div className="space-y-0.5">
          <CardTitle className="text-lg font-bold font-heading text-foreground">
            {t('studyTrends')}
          </CardTitle>
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
        {/* Minimalist Typographic Stats Header */}
        <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground border-b border-border/40 pb-3">
          <div className="flex items-center gap-1.5">
            <span>{t('weeklyTotal')}:</span>
            <strong className="text-sm font-bold text-foreground font-heading">
              {stats.totalMinutes}m
            </strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span>{t('dailyAverage')}:</span>
            <strong className="text-sm font-bold text-foreground font-heading">
              {stats.avgMinutes}m
            </strong>
          </div>
          <div className="flex items-center gap-1.5">
            <span>{t('goalsMet')}:</span>
            <strong className="text-sm font-bold text-foreground font-heading">
              {stats.metCount}/{chartData.length} {t('days')}
            </strong>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-64 w-full pt-2">
          <ChartContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 24, right: 15, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
                opacity={0.3}
              />

              <XAxis
                dataKey="dayLabel"
                axisLine={false}
                tickLine={false}
                interval={0}
                tick={({ x, y, index }) => {
                  const item = chartData[index];
                  if (!item || !item.dayLabel) return null;
                  const isToday = item.isToday;

                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        x={0}
                        y={0}
                        dy={14}
                        textAnchor="middle"
                        fill={
                          isToday ? 'var(--primary)' : 'var(--muted-foreground)'
                        }
                        fontSize={11}
                        fontWeight={isToday ? 700 : 500}
                      >
                        {item.dayLabel}
                      </text>
                      {isToday && period === '7d' && (
                        <circle cx={0} cy={22} r={2} fill="var(--primary)" />
                      )}
                    </g>
                  );
                }}
              />

              <YAxis
                domain={[0, yDomainMax]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
                unit="m"
                allowDecimals={false}
              />

              <ChartTooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const item = payload[0].payload as ChartDayItem;

                  return (
                    <ChartTooltipCard>
                      <ChartTooltipTitle>
                        {item.fullDate} {item.isToday && `• ${t('today')}`}
                      </ChartTooltipTitle>
                      <ChartTooltipRow
                        color="var(--primary)"
                        label={t('studiedMinutes')}
                        value={`${item.minutes}m`}
                      />
                      <ChartTooltipSeparator />
                      <ChartTooltipRow
                        label={t('dailyGoalLine')}
                        value={`${item.goal}m`}
                      />
                      {item.isGoalMet ? (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-primary pt-0.5">
                          <Icons name="check" className="h-3 w-3" />
                          <span>{t('goalsMet')}</span>
                        </div>
                      ) : item.minutes > 0 ? (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground pt-0.5">
                          <span>
                            {t('minutesLeft', {
                              minutes: Math.max(0, item.goal - item.minutes),
                            })}
                          </span>
                        </div>
                      ) : null}
                    </ChartTooltipCard>
                  );
                }}
              />

              <ReferenceLine
                y={safeGoal}
                stroke="var(--primary)"
                strokeDasharray="4 4"
                strokeOpacity={0.4}
                label={{
                  value: `${safeGoal}m ${t('dailyGoalLine')}`,
                  fill: 'var(--primary)',
                  fontSize: 10,
                  fontWeight: 600,
                  position: 'insideTopLeft',
                  offset: 8,
                }}
              />

              <Bar
                dataKey="displayMinutes"
                radius={[6, 6, 2, 2]}
                maxBarSize={period === '7d' ? 36 : 10}
                className="cursor-pointer"
              >
                <LabelList
                  dataKey="minutes"
                  content={renderBarTopLabel}
                />
                {chartData.map((entry) => {
                  const isZero = entry.minutes === 0;
                  return (
                    <Cell
                      key={entry.dateStr}
                      fill={isZero ? 'transparent' : 'var(--primary)'}
                      opacity={isZero ? 0 : 1}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
