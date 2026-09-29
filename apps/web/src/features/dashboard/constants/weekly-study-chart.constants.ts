import { HeatmapItem } from '@/services/progress';

export const TRANSLATION_NAMESPACE = 'Dashboard.Overview';

export type Period = '7d' | '30d';

export const PERIOD_DAYS: Record<Period, number> = { '7d': 7, '30d': 30 };

export const DEFAULT_DAILY_GOAL_MINUTES = 15;

/**
 * The heatmap only exposes an activity count per day, not real study time.
 * Until the API returns minutes, we estimate: each activity ≈ 2 minutes,
 * with a floor so that a single tiny activity is still visible on the chart.
 */
export const MINUTES_PER_ACTIVITY = 2;
export const MIN_ACTIVE_MINUTES = 5;

/** In the 30-day view, display date label every 2 days for rich horizontal timeline. */
export const MONTH_TICK_INTERVAL = 2;

/** Y-axis max = tallest value × headroom, rounded up to the next step. */
export const Y_AXIS_HEADROOM = 1.25;
export const Y_AXIS_STEP = 5;

/** Full colour = goal met, faded = below goal, hidden = no activity. */
export const BAR_OPACITY = { goalMet: 1, belowGoal: 0.4, none: 0 } as const;

export const CHART_MARGIN = { top: 24, right: 15, left: -20, bottom: 0 };

/** Stable reference so the default prop doesn't invalidate memoised data. */
export const EMPTY_HEATMAP: HeatmapItem[] = [];
