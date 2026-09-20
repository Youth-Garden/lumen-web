import { format, isAfter } from 'date-fns';
import type { HeatmapItem } from '@/services/progress';
import type { CalendarDay, MonthLabelItem } from '../types/heatmap.types';

export function getIntensityClass(count: number): string {
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

export function getIntensityDotClass(count: number): string {
  if (count === 0) return 'bg-muted/50';
  if (count < 3) return 'bg-indigo-200 dark:bg-indigo-900/50';
  if (count < 7) return 'bg-indigo-300 dark:bg-indigo-800';
  if (count < 15) return 'bg-indigo-500 dark:bg-indigo-700';
  if (count < 30) return 'bg-indigo-600 dark:bg-indigo-600';
  return 'bg-indigo-700 dark:bg-indigo-500';
}

export function buildHeatmapMap(
  data: HeatmapItem[] | undefined,
  activeYear: number,
  currentYear: number,
  todayStr: string,
  todayStudyMinutes: number,
  streak: number,
): Map<string, number> {
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
      map.set(todayStr, Math.max(1, Math.round((todayStudyMinutes || 10) / 2)));
    }
  }

  return map;
}

export function calculateHeatmapStats(
  days: Date[],
  heatmapMap: Map<string, number>,
) {
  let totalActivities = 0;
  let activeDaysCount = 0;
  let maxStreak = 0;
  let currentConsecutive = 0;

  heatmapMap.forEach((count) => {
    totalActivities += count;
    if (count > 0) {
      activeDaysCount++;
    }
  });

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

  const averagePerDay =
    activeDaysCount > 0
      ? Math.round((totalActivities / activeDaysCount) * 10) / 10
      : 0;

  return {
    totalActivities,
    activeDaysCount,
    longestStreak: maxStreak,
    averagePerDay,
  };
}

export function buildHeatmapWeeksAndMonthLabels(
  days: Date[],
  heatmapMap: Map<string, number>,
  today: Date,
): {
  weeks: (CalendarDay | null)[][];
  monthLabels: MonthLabelItem[];
} {
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

  const labels: MonthLabelItem[] = [];
  let lastMonth = -1;

  weeksList.forEach((week, weekIndex) => {
    const firstValidDay = week.find((day): day is CalendarDay => day !== null);
    if (firstValidDay) {
      const month = firstValidDay.date.getMonth();
      if (month !== lastMonth) {
        labels.push({ weekIndex, label: format(firstValidDay.date, 'MMM') });
        lastMonth = month;
      }
    }
  });

  return { weeks: weeksList, monthLabels: labels };
}
