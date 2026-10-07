import { DailyGoalHistoryItem, HeatmapItem } from '@/services/progress';
import { Locale } from '@/shared/types';
import { format, isAfter, isSameDay, startOfDay, subDays } from 'date-fns';

export type DayTrackerStatus =
  'completed' | 'active_today' | 'frozen' | 'missed' | 'upcoming';

export interface TrackerDayItem {
  date: Date;
  dateStr: string;
  dayLabel: string;
  isToday: boolean;
  isFuture: boolean;
  minutes: number;
  isGoalMet: boolean;
  status: DayTrackerStatus;
}

export interface StreakMilestoneInfo {
  currentStreak: number;
  nextMilestone: number;
  prevMilestone: number;
  progressPercent: number;
  remainingDays: number;
}

const MILESTONES = [3, 7, 14, 30, 60, 100, 180, 365];

export function formatTrackerDayLabel(date: Date, locale: Locale): string {
  if (locale === Locale.VI) {
    const day = date.getDay();
    if (day === 0) return 'CN';
    return `T${day + 1}`;
  }
  return format(date, 'EEE');
}

export function resolveTargetForDate(
  date: Date,
  goalHistories: DailyGoalHistoryItem[] | undefined,
  fallbackGoal: number,
  initialDefaultGoal = 15,
): number {
  const targetDate = startOfDay(date);
  const today = startOfDay(new Date());
  const isPastDay = targetDate.getTime() < today.getTime();

  if (goalHistories && goalHistories.length > 0) {
    const sortedDesc = [...goalHistories].sort(
      (a, b) =>
        new Date(b.effectiveFrom).getTime() -
        new Date(a.effectiveFrom).getTime(),
    );

    const targetTime = targetDate.getTime();

    for (const history of sortedDesc) {
      const fromTime = startOfDay(new Date(history.effectiveFrom)).getTime();
      if (targetTime >= fromTime) {
        return Math.max(history.targetMinutes, 1);
      }
    }

    const earliestFrom = startOfDay(
      new Date(sortedDesc[sortedDesc.length - 1].effectiveFrom),
    ).getTime();
    if (targetTime < earliestFrom) {
      return Math.max(initialDefaultGoal, 1);
    }
  }

  if (isPastDay) {
    return Math.max(initialDefaultGoal, 1);
  }

  return Math.max(fallbackGoal, 1);
}

export function computeWeeklyTrackerDays(
  heatmapData: HeatmapItem[] | undefined,
  todayStudyMinutes: number,
  dailyGoalMinutes: number,
  locale: Locale,
  streakFreezes = 0,
  forceTodayCompleted = false,
  goalHistories?: DailyGoalHistoryItem[],
  lastActivityDate?: string,
  frozenDates?: string[],
): TrackerDayItem[] {
  const today = startOfDay(new Date());

  const historyMap = new Map<string, number>();
  heatmapData?.forEach((item) => {
    if (item?.date) {
      const dStr = String(item.date).slice(0, 10);
      historyMap.set(
        dStr,
        (historyMap.get(dStr) || 0) + (Number(item.count) || 0),
      );
    }
  });

  const rawDays: TrackerDayItem[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const isToday = isSameDay(date, today);
    const isFuture = isAfter(date, today);
    const safeGoal = resolveTargetForDate(
      date,
      goalHistories,
      dailyGoalMinutes,
    );

    let minutes = 0;
    if (isToday) {
      minutes = forceTodayCompleted ? safeGoal : todayStudyMinutes;
    } else if (!isFuture) {
      const count = historyMap.get(dateStr) || 0;
      minutes = count > 0 ? Math.max(5, count * 2) : 0;
    }

    const isGoalMet = minutes >= safeGoal;

    let status: DayTrackerStatus = 'upcoming';
    if (isToday) {
      status =
        forceTodayCompleted || isGoalMet || minutes > 0
          ? 'completed'
          : 'active_today';
    } else if (!isFuture) {
      if (isGoalMet || minutes > 0) {
        status = 'completed';
      } else {
        status = 'missed';
      }
    }

    rawDays.push({
      date,
      dateStr,
      dayLabel: formatTrackerDayLabel(date, locale),
      isToday,
      isFuture,
      minutes,
      isGoalMet: forceTodayCompleted && isToday ? true : isGoalMet,
      status,
    });
  }

  const lastActiveDay = lastActivityDate
    ? startOfDay(new Date(lastActivityDate))
    : null;

  const lastActiveDayStr = lastActiveDay
    ? format(lastActiveDay, 'yyyy-MM-dd')
    : null;
  const lastActiveHasMinutes = lastActiveDayStr
    ? (historyMap.get(lastActiveDayStr) || 0) > 0
    : false;
  const isLastActiveAFreezeDay =
    lastActiveDay !== null && !lastActiveHasMinutes;

  let lastActualStudyDay: Date | null = null;
  rawDays.forEach((d) => {
    if (d.status === 'completed') {
      if (!lastActualStudyDay || isAfter(d.date, lastActualStudyDay)) {
        if (
          !lastActiveDay ||
          !isAfter(d.date, lastActiveDay) ||
          lastActiveHasMinutes
        ) {
          lastActualStudyDay = d.date;
        }
      }
    }
  });

  const frozenDateSet = new Set(frozenDates || []);

  for (let i = 0; i < rawDays.length; i++) {
    const day = rawDays[i];
    if (day.status === 'missed') {
      const prevDay = i > 0 ? rawDays[i - 1] : null;
      const nextDay = i < rawDays.length - 1 ? rawDays[i + 1] : null;

      const isExplicitDbFrozen = frozenDateSet.has(day.dateStr);

      const isPastConsumedFreeze =
        isLastActiveAFreezeDay &&
        lastActiveDay !== null &&
        (!lastActualStudyDay || isAfter(day.date, lastActualStudyDay)) &&
        !isAfter(day.date, lastActiveDay);

      const isSandwichedFrozen =
        prevDay?.status === 'completed' && nextDay?.status === 'completed';

      const isFirstMissedAfterCompleted = prevDay?.status === 'completed';

      if (
        isExplicitDbFrozen ||
        isPastConsumedFreeze ||
        isSandwichedFrozen ||
        isFirstMissedAfterCompleted
      ) {
        day.status = 'frozen';
      }
    }
  }

  return rawDays;
}

export function calculateStreakMilestone(
  currentStreak: number,
): StreakMilestoneInfo {
  const safeStreak = Math.max(currentStreak, 0);
  const nextMilestone =
    MILESTONES.find((m) => m > safeStreak) || safeStreak + 100;

  const milestoneIndex = MILESTONES.indexOf(nextMilestone);
  const prevMilestone = milestoneIndex > 0 ? MILESTONES[milestoneIndex - 1] : 0;

  const range = nextMilestone - prevMilestone;
  const currentInRange = safeStreak - prevMilestone;
  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((currentInRange / range) * 100)),
  );

  return {
    currentStreak: safeStreak,
    nextMilestone,
    prevMilestone,
    progressPercent,
    remainingDays: Math.max(0, nextMilestone - safeStreak),
  };
}
