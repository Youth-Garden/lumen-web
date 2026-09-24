'use client';

import { HeatmapItem } from '@/services/progress';
import { Locale } from '@/shared/types';
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
import { useLocale } from '@/shared/hooks';
import { useTranslations } from 'next-intl';
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

/* -------------------------------------------------------------------------- */
/* Constants & types                                                          */
/* -------------------------------------------------------------------------- */

const TRANSLATION_NAMESPACE = 'Dashboard.Overview';

type Period = '7d' | '30d';

const PERIOD_DAYS: Record<Period, number> = { '7d': 7, '30d': 30 };

const DEFAULT_DAILY_GOAL_MINUTES = 15;

/**
 * The heatmap only exposes an activity count per day, not real study time.
 * Until the API returns minutes, we estimate: each activity ≈ 2 minutes,
 * with a floor so that a single tiny activity is still visible on the chart.
 */
const MINUTES_PER_ACTIVITY = 2;
const MIN_ACTIVE_MINUTES = 5;

/** In the 30-day view, display date label every 2 days for rich horizontal timeline. */
const MONTH_TICK_INTERVAL = 2;

/** Y-axis max = tallest value × headroom, rounded up to the next step. */
const Y_AXIS_HEADROOM = 1.25;
const Y_AXIS_STEP = 5;

/** Full colour = goal met, faded = below goal, hidden = no activity. */
const BAR_OPACITY = { goalMet: 1, belowGoal: 0.4, none: 0 } as const;

const CHART_MARGIN = { top: 24, right: 15, left: -20, bottom: 0 };

/** Stable reference so the default prop doesn't invalidate memoised data. */
const EMPTY_HEATMAP: HeatmapItem[] = [];

interface WeeklyStudyChartProps {
  heatmapData?: HeatmapItem[];
  dailyGoalMinutes: number;
  todayStudyMinutes: number;
  isLoading?: boolean;
}

interface ChartDayItem {
  dateStr: string;
  /** Empty string = no label rendered on the x-axis for this day. */
  tickLabel: string;
  fullDate: string;
  minutes: number;
  isGoalMet: boolean;
  isToday: boolean;
}

interface StudyStats {
  totalMinutes: number;
  avgMinutes: number;
  metCount: number;
  yDomainMax: number;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function estimateMinutesFromActivity(activityCount: number): number {
  if (activityCount <= 0) return 0;
  return Math.max(
    MIN_ACTIVE_MINUTES,
    Math.round(activityCount * MINUTES_PER_ACTIVITY),
  );
}

/** 45 → "45m", 60 → "1h", 135 → "2h 15m" */
function formatDuration(totalMinutes: number): string {
  const minutes = Math.max(0, Math.round(totalMinutes));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

function formatWeekdayLabel(date: Date, locale: Locale): string {
  if (locale === Locale.VI) {
    const day = date.getDay();
    return day === 0 ? 'CN' : `T${day + 1}`;
  }
  return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
}

function getBarOpacity(day: ChartDayItem): number {
  if (day.minutes === 0) return BAR_OPACITY.none;
  return day.isGoalMet ? BAR_OPACITY.goalMet : BAR_OPACITY.belowGoal;
}

interface BuildChartDataParams {
  period: Period;
  locale: Locale;
  goal: number;
  todayStudyMinutes: number;
  activityByDate: ReadonlyMap<string, number>;
}

function buildChartData({
  period,
  locale,
  goal,
  todayStudyMinutes,
  activityByDate,
}: BuildChartDataParams): ChartDayItem[] {
  const today = startOfDay(new Date());
  const todayStr = format(today, 'yyyy-MM-dd');
  const dayCount = PERIOD_DAYS[period];
  const isWeekView = period === '7d';

  const fullDateFormatter = new Intl.DateTimeFormat(locale, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const shortDateFormatter = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'numeric',
  });

  return Array.from({ length: dayCount }, (_, index) => {
    const offset = dayCount - 1 - index;
    const date = subDays(today, offset);
    const dateStr = format(date, 'yyyy-MM-dd');
    const isToday = dateStr === todayStr;

    const estimated = estimateMinutesFromActivity(
      activityByDate.get(dateStr) ?? 0,
    );
    const minutes = isToday
      ? Math.max(todayStudyMinutes, estimated)
      : estimated;

    let tickLabel = '';
    if (isWeekView) {
      tickLabel = formatWeekdayLabel(date, locale);
    } else if (offset % MONTH_TICK_INTERVAL === 0) {
      tickLabel = shortDateFormatter.format(date);
    }

    return {
      dateStr,
      tickLabel,
      fullDate: fullDateFormatter.format(date),
      minutes,
      isGoalMet: minutes >= goal,
      isToday,
    };
  });
}

function calculateStats(chartData: ChartDayItem[], goal: number): StudyStats {
  const totalMinutes = chartData.reduce((sum, day) => sum + day.minutes, 0);
  const maxMinutes = Math.max(...chartData.map((day) => day.minutes), goal);

  return {
    totalMinutes,
    avgMinutes: Math.round(totalMinutes / chartData.length),
    metCount: chartData.filter((day) => day.isGoalMet).length,
    yDomainMax:
      Math.ceil((maxMinutes * Y_AXIS_HEADROOM) / Y_AXIS_STEP) * Y_AXIS_STEP,
  };
}

/* -------------------------------------------------------------------------- */
/* Data hook                                                                  */
/* -------------------------------------------------------------------------- */

interface UseStudyChartDataParams {
  heatmapData: HeatmapItem[];
  dailyGoalMinutes: number;
  todayStudyMinutes: number;
  period: Period;
  locale: Locale;
}

function useStudyChartData({
  heatmapData,
  dailyGoalMinutes,
  todayStudyMinutes,
  period,
  locale,
}: UseStudyChartDataParams) {
  const goal =
    dailyGoalMinutes > 0 ? dailyGoalMinutes : DEFAULT_DAILY_GOAL_MINUTES;

  const activityByDate = useMemo(
    () =>
      new Map<string, number>(
        heatmapData.map((item): [string, number] => [item.date, item.count]),
      ),
    [heatmapData],
  );

  const chartData = useMemo(
    () =>
      buildChartData({
        period,
        locale,
        goal,
        todayStudyMinutes,
        activityByDate,
      }),
    [period, locale, goal, todayStudyMinutes, activityByDate],
  );

  const stats = useMemo(
    () => calculateStats(chartData, goal),
    [chartData, goal],
  );

  return { chartData, stats, goal };
}

/* -------------------------------------------------------------------------- */
/* Chart labels                                                               */
/* -------------------------------------------------------------------------- */

interface DayTickProps {
  x?: number | string;
  y?: number | string;
  item?: ChartDayItem;
  showTodayDot: boolean;
}

/** Custom x-axis tick: highlights today and skips days without a label. */
function DayTick({ x = 0, y = 0, item, showTodayDot }: DayTickProps) {
  if (!item?.tickLabel) return <g />;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={14}
        textAnchor="middle"
        fill={item.isToday ? 'var(--primary)' : 'var(--muted-foreground)'}
        fontSize={showTodayDot ? 11 : 10}
        fontWeight={item.isToday ? 700 : 500}
      >
        {item.tickLabel}
      </text>
      {item.isToday && showTodayDot && (
        <circle cx={0} cy={22} r={2} fill="var(--primary)" />
      )}
    </g>
  );
}

interface BarValueLabelProps {
  x?: number;
  y?: number;
  width?: number;
  value?: number;
}

/** Value label rendered above each bar (7-day view only). */
function renderBarValueLabel({
  x = 0,
  y = 0,
  width = 0,
  value,
}: BarValueLabelProps) {
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
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {value}m
    </text>
  );
}

/* -------------------------------------------------------------------------- */
/* Tooltip                                                                    */
/* -------------------------------------------------------------------------- */

interface StudyChartTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: ChartDayItem }>;
  goal: number;
}

function StudyChartTooltip({ active, payload, goal }: StudyChartTooltipProps) {
  const t = useTranslations(TRANSLATION_NAMESPACE);
  const item = payload?.[0]?.payload;

  if (!active || !item) return null;

  const remaining = Math.max(0, goal - item.minutes);

  return (
    <ChartTooltipCard>
      <ChartTooltipTitle>
        {item.fullDate}
        {item.isToday && ` • ${t('today')}`}
      </ChartTooltipTitle>
      <ChartTooltipRow
        color="var(--primary)"
        label={t('studiedMinutes')}
        value={formatDuration(item.minutes)}
      />
      <ChartTooltipSeparator />
      <ChartTooltipRow
        label={t('dailyGoalLine')}
        value={formatDuration(goal)}
      />
      {item.isGoalMet ? (
        <div className="flex items-center gap-1 pt-0.5 text-[10px] font-bold text-primary">
          <Icons name="check" className="h-3 w-3" />
          <span>{t('goalsMet')}</span>
        </div>
      ) : item.minutes > 0 ? (
        <div className="pt-0.5 text-[10px] text-muted-foreground">
          {t('minutesLeft', { minutes: remaining })}
        </div>
      ) : null}
    </ChartTooltipCard>
  );
}

/* -------------------------------------------------------------------------- */
/* Skeleton                                                                   */
/* -------------------------------------------------------------------------- */

function StudyChartSkeleton() {
  return (
    <Card aria-busy="true" className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48 rounded-lg" />
        <Skeleton className="h-8 w-28 rounded-xl" />
      </div>
      <Skeleton className="h-16 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Summary                                                                    */
/* -------------------------------------------------------------------------- */

interface StudyChartSummaryProps {
  stats: StudyStats;
  dayCount: number;
  isWeekView: boolean;
}

function StudyChartSummary({
  stats,
  dayCount,
  isWeekView,
}: StudyChartSummaryProps) {
  const t = useTranslations(TRANSLATION_NAMESPACE);

  const items = [
    {
      key: 'total',
      label: t(isWeekView ? 'weeklyTotal' : 'monthlyTotal'),
      value: formatDuration(stats.totalMinutes),
      suffix: null,
    },
    {
      key: 'average',
      label: t('dailyAverage'),
      value: formatDuration(stats.avgMinutes),
      suffix: null,
    },
    {
      key: 'goals',
      label: t('goalsMet'),
      value: `${stats.metCount}/${dayCount}`,
      suffix: t('days'),
    },
  ];

  return (
    <Card
      variant="muted"
      size="sm"
      className="grid grid-cols-3 divide-x divide-border/50 py-3 rounded-2xl"
    >
      {items.map(({ key, label, value, suffix }) => (
        <div key={key} className="min-w-0 space-y-0.5 px-3 sm:px-4">
          <dt className="truncate text-xs text-muted-foreground">{label}</dt>
          <dd className="font-heading text-lg font-bold tabular-nums text-foreground sm:text-xl">
            {value}
            {suffix && (
              <span className="ml-1 text-xs font-medium text-muted-foreground">
                {suffix}
              </span>
            )}
          </dd>
        </div>
      ))}
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Bar chart                                                                  */
/* -------------------------------------------------------------------------- */

interface StudyBarChartProps {
  data: ChartDayItem[];
  stats: StudyStats;
  goal: number;
  isWeekView: boolean;
}

function StudyBarChart({ data, stats, goal, isWeekView }: StudyBarChartProps) {
  const t = useTranslations(TRANSLATION_NAMESPACE);
  const hasActivity = stats.totalMinutes > 0;

  return (
    <div
      role="img"
      aria-label={t('chartAriaLabel', {
        total: formatDuration(stats.totalMinutes),
        average: formatDuration(stats.avgMinutes),
        met: stats.metCount,
        count: data.length,
      })}
      className="relative h-64 w-full pt-2"
    >
      <ChartContainer width="100%" height="100%">
        <BarChart data={data} margin={CHART_MARGIN}>
          <CartesianGrid
            vertical={false}
            horizontal={true}
            stroke="var(--border)"
            strokeOpacity={0.6}
          />

          <XAxis
            dataKey="dateStr"
            axisLine={{ stroke: 'var(--border)', strokeOpacity: 0.6 }}
            tickLine={false}
            interval={0}
            tick={({ x, y, index }) => (
              <DayTick
                x={x}
                y={y}
                item={data[index]}
                showTodayDot={isWeekView}
              />
            )}
          />

          <YAxis
            domain={[0, stats.yDomainMax]}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }}
            tickFormatter={(value: number) => `${value}m`}
            allowDecimals={false}
          />

          <ChartTooltip
            cursor={{ fill: 'var(--muted)', opacity: 0.4, radius: 6 }}
            content={({ active, payload }) => (
              <StudyChartTooltip
                active={active}
                payload={payload}
                goal={goal}
              />
            )}
          />

          <ReferenceLine
            y={goal}
            stroke="var(--primary)"
            strokeDasharray="4 4"
            strokeOpacity={0.65}
            label={{
              value: `${goal}m ${t('dailyGoalLine')}`,
              fill: 'var(--primary)',
              fontSize: 10,
              fontWeight: 600,
              position: 'insideTopRight',
              offset: 8,
            }}
          />

          <Bar
            dataKey="minutes"
            radius={[8, 8, 3, 3]}
            barSize={isWeekView ? 70 : 30}
          >
            {/* Value labels would be unreadable on 30 slim bars. */}
            {isWeekView && (
              <LabelList dataKey="minutes" content={renderBarValueLabel} />
            )}

            {data.map((day) => (
              <Cell
                key={day.dateStr}
                fill="var(--primary)"
                fillOpacity={getBarOpacity(day)}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>

      {!hasActivity && (
        <p className="pointer-events-none absolute inset-0 flex items-center justify-center pb-8 text-sm text-muted-foreground">
          {t('noActivityYet')}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main component                                                             */
/* -------------------------------------------------------------------------- */

export function WeeklyStudyChart({
  heatmapData = EMPTY_HEATMAP,
  dailyGoalMinutes,
  todayStudyMinutes,
  isLoading = false,
}: WeeklyStudyChartProps) {
  const t = useTranslations(TRANSLATION_NAMESPACE);
  const locale = useLocale();
  const [period, setPeriod] = useState<Period>('7d');
  const isWeekView = period === '7d';

  const { chartData, stats, goal } = useStudyChartData({
    heatmapData,
    dailyGoalMinutes,
    todayStudyMinutes,
    period,
    locale,
  });

  if (isLoading) return <StudyChartSkeleton />;

  return (
    <Card className="flex h-full flex-col justify-between overflow-hidden">
      <CardHeader className="flex flex-col justify-between gap-3 pb-2 sm:flex-row sm:items-center">
        <div className="space-y-0.5">
          <CardTitle className="font-heading text-lg font-bold text-foreground">
            {t('studyTrends')}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {t('studyTrendsDesc')}
          </CardDescription>
        </div>

        <SegmentedTabs<Period>
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
        <StudyChartSummary
          stats={stats}
          dayCount={chartData.length}
          isWeekView={isWeekView}
        />
        <StudyBarChart
          data={chartData}
          stats={stats}
          goal={goal}
          isWeekView={isWeekView}
        />
      </CardContent>
    </Card>
  );
}
