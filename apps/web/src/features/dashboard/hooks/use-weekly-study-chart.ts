import { useMemo } from 'react';
import { DEFAULT_DAILY_GOAL_MINUTES } from '../constants';
import { UseStudyChartDataParams } from '../types/weekly-study-chart.types';
import {
  buildChartData,
  calculateStats,
} from '../utils/weekly-study-chart.utils';

export function useWeeklyStudyChart({
  heatmapData,
  dailyGoalMinutes,
  todayStudyMinutes,
  period,
  locale,
  goalHistories,
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
        goalHistories,
      }),
    [period, locale, goal, todayStudyMinutes, activityByDate, goalHistories],
  );

  const stats = useMemo(
    () => calculateStats(chartData, goal),
    [chartData, goal],
  );

  return { chartData, stats, goal };
}
