import { Locale } from '@/shared/types';
import { format, startOfDay, subDays } from 'date-fns';
import {
  BAR_OPACITY,
  MINUTES_PER_ACTIVITY,
  MIN_ACTIVE_MINUTES,
  MONTH_TICK_INTERVAL,
  PERIOD_DAYS,
  Y_AXIS_HEADROOM,
  Y_AXIS_STEP,
} from '../constants';
import {
  BuildChartDataParams,
  ChartDayItem,
  StudyStats,
} from '../types/weekly-study-chart.types';
import { resolveTargetForDate } from './streak-tracker.utils';

export function estimateMinutesFromActivity(activityCount: number): number {
  if (activityCount <= 0) return 0;
  return Math.max(
    MIN_ACTIVE_MINUTES,
    Math.round(activityCount * MINUTES_PER_ACTIVITY),
  );
}

/** 45 → "45m", 60 → "1h", 135 → "2h 15m" */
export function formatDuration(totalMinutes: number): string {
  const minutes = Math.max(0, Math.round(totalMinutes));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}

export function formatWeekdayLabel(date: Date, locale: Locale): string {
  if (locale === Locale.VI) {
    const day = date.getDay();
    return day === 0 ? 'CN' : `T${day + 1}`;
  }
  return new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date);
}

export function getBarOpacity(day: ChartDayItem): number {
  if (day.minutes === 0) return BAR_OPACITY.none;
  return day.isGoalMet ? BAR_OPACITY.goalMet : BAR_OPACITY.belowGoal;
}

export function buildChartData({
  period,
  locale,
  goal,
  todayStudyMinutes,
  activityByDate,
  goalHistories,
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

    const dayGoalTarget = resolveTargetForDate(date, goalHistories, goal);

    return {
      dateStr,
      tickLabel,
      fullDate: fullDateFormatter.format(date),
      minutes,
      targetMinutes: dayGoalTarget,
      isGoalMet: minutes >= dayGoalTarget,
      isToday,
    };
  });
}

export function calculateStats(
  chartData: ChartDayItem[],
  goal: number,
): StudyStats {
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
