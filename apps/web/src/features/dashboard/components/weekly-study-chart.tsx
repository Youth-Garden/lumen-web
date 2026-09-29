'use client';

import { useLocalStorage } from '@lumen/hooks';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  SegmentedTabs,
} from '@lumen/uikit/components';
import { useLocale } from '@/shared/hooks';
import { useTranslations } from 'next-intl';
import { EMPTY_HEATMAP, Period, TRANSLATION_NAMESPACE } from '../constants';
import { useWeeklyStudyChart } from '../hooks';
import { WeeklyStudyChartProps } from '../types/weekly-study-chart.types';
import { StudyBarChart } from './study-bar-chart';
import { StudyChartSkeleton } from './study-chart-skeleton';
import { StudyChartSummary } from './study-chart-summary';

export function WeeklyStudyChart({
  heatmapData = EMPTY_HEATMAP,
  dailyGoalMinutes,
  todayStudyMinutes,
  goalHistories,
  isLoading = false,
}: WeeklyStudyChartProps) {
  const t = useTranslations(TRANSLATION_NAMESPACE);
  const locale = useLocale();
  const [period, setPeriod] = useLocalStorage<Period>(
    'lumen_study_trends_period',
    '7d',
  );
  const isWeekView = period === '7d';

  const { chartData, stats, goal } = useWeeklyStudyChart({
    heatmapData,
    dailyGoalMinutes,
    todayStudyMinutes,
    period,
    locale,
    goalHistories,
  });

  if (isLoading) return <StudyChartSkeleton />;

  return (
    <Card className="flex h-full flex-col justify-between overflow-hidden">
      <CardHeader className="flex flex-col justify-between gap-3 pb-2 sm:flex-row sm:items-center">
        <div>
          <CardTitle className="font-heading text-lg font-bold text-foreground">
            {t('studyTrends')}
          </CardTitle>
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
