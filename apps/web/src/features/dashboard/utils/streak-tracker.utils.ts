import { HeatmapItem } from '@/services/progress';
import { format, isAfter, isSameDay, startOfDay, subDays } from 'date-fns';

export type DayTrackerStatus =
  'completed' | 'active_today' | 'missed' | 'upcoming';

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

export function formatTrackerDayLabel(date: Date, locale: string): string {
  if (locale === 'vi') {
    const day = date.getDay();
    if (day === 0) return 'CN';
    return `T${day + 1}`;
  }
  return format(date, 'EEE');
}

export function computeWeeklyTrackerDays(
  heatmapData: HeatmapItem[] | undefined,
  todayStudyMinutes: number,
  dailyGoalMinutes: number,
  locale: string,
): TrackerDayItem[] {
  const today = startOfDay(new Date());
  const safeGoal = Math.max(dailyGoalMinutes, 1);

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

  const days: TrackerDayItem[] = [];

  for (let i = 6; i >= 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    const isToday = isSameDay(date, today);
    const isFuture = isAfter(date, today);

    let minutes = 0;
    if (isToday) {
      minutes = todayStudyMinutes;
    } else if (!isFuture) {
      const count = historyMap.get(dateStr) || 0;
      minutes = count > 0 ? Math.max(5, count * 2) : 0;
    }

    const isGoalMet = minutes >= safeGoal;

    let status: DayTrackerStatus = 'upcoming';
    if (isToday) {
      status = 'active_today';
    } else if (!isFuture) {
      status = isGoalMet || minutes > 0 ? 'completed' : 'missed';
    }

    days.push({
      date,
      dateStr,
      dayLabel: formatTrackerDayLabel(date, locale),
      isToday,
      isFuture,
      minutes,
      isGoalMet,
      status,
    });
  }

  return days;
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
