import { useTranslations } from 'next-intl';
import { Card } from '@lumen/uikit/components';
import { TRANSLATION_NAMESPACE } from '../constants';
import { StudyStats } from '../types/weekly-study-chart.types';
import { formatDuration } from '../utils/weekly-study-chart.utils';

interface StudyChartSummaryProps {
  stats: StudyStats;
  dayCount: number;
  isWeekView: boolean;
}

export function StudyChartSummary({
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
