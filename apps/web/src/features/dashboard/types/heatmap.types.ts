import type { HeatmapItem } from '@/services/progress';

export interface CalendarDay {
  date: Date;
  dateStr: string;
  count: number;
  isFuture: boolean;
}

export interface MonthLabelItem {
  weekIndex: number;
  label: string;
}

export interface HeatmapCalendarProps {
  data?: HeatmapItem[];
  isLoading?: boolean;
  todayStudyMinutes?: number;
  streak?: number;
  dailyGoalMinutes?: number;
  selectedYear?: number;
  onSelectYear?: (year: number) => void;
}

export interface HeatmapGridProps {
  weeks: (CalendarDay | null)[][];
  monthLabels: MonthLabelItem[];
  today: Date;
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

export interface HeatmapLegendProps {
  activeDaysCount: number;
  averagePerDay: number;
  lessText: string;
  moreText: string;
}

export interface HeatmapInsightsSidebarProps {
  activeYear: number;
  currentYear: number;
  streak: number;
  longestStreak: number;
  activeDaysCount: number;
  totalDaysInYear: number;
  averagePerDay: number;
  totalActivities: number;
}

export interface HeatmapYearSelectorProps {
  availableYears: number[];
  activeYear: number;
  onSelectYear: (year: number) => void;
}

export interface HeatmapSkeletonProps {
  yearsCount?: number;
}
