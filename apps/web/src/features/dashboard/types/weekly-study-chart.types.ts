import { DailyGoalHistoryItem, HeatmapItem } from '@/services/progress';
import { Locale } from '@/shared/types';
import { Period } from '../constants';

export interface WeeklyStudyChartProps {
  heatmapData?: HeatmapItem[];
  dailyGoalMinutes: number;
  todayStudyMinutes: number;
  goalHistories?: DailyGoalHistoryItem[];
  isLoading?: boolean;
}

export interface ChartDayItem {
  dateStr: string;
  /** Empty string = no label rendered on the x-axis for this day. */
  tickLabel: string;
  fullDate: string;
  minutes: number;
  targetMinutes: number;
  isGoalMet: boolean;
  isToday: boolean;
}

export interface StudyStats {
  totalMinutes: number;
  avgMinutes: number;
  metCount: number;
  yDomainMax: number;
}

export interface BuildChartDataParams {
  period: Period;
  locale: Locale;
  goal: number;
  todayStudyMinutes: number;
  activityByDate: ReadonlyMap<string, number>;
  goalHistories?: DailyGoalHistoryItem[];
}

export interface UseStudyChartDataParams {
  heatmapData: HeatmapItem[];
  dailyGoalMinutes: number;
  todayStudyMinutes: number;
  period: Period;
  locale: Locale;
  goalHistories?: DailyGoalHistoryItem[];
}
