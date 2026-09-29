import { useTranslations } from 'next-intl';
import { Icons } from '@lumen/uikit/icons';
import {
  ChartTooltipCard,
  ChartTooltipRow,
  ChartTooltipSeparator,
  ChartTooltipTitle,
} from '@/shared/components/chart/chart-tooltip';
import { TRANSLATION_NAMESPACE } from '../constants';
import { ChartDayItem } from '../types/weekly-study-chart.types';
import { formatDuration } from '../utils/weekly-study-chart.utils';

interface StudyChartTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: ChartDayItem }>;
  goal: number;
}

export function StudyChartTooltip({
  active,
  payload,
  goal,
}: StudyChartTooltipProps) {
  const t = useTranslations(TRANSLATION_NAMESPACE);
  const item = payload?.[0]?.payload;

  if (!active || !item) return null;

  const targetMinutes = item.targetMinutes ?? goal;
  const remaining = Math.max(0, targetMinutes - item.minutes);

  return (
    <ChartTooltipCard>
      <ChartTooltipTitle>
        {item.fullDate}
        {item.isToday && ` • ${t('today')}`}
      </ChartTooltipTitle>
      <ChartTooltipRow
        color="var(--primary)"
        label={t('studiedMinutes')}
        value={formatDuration(item.minutes)}
      />
      <ChartTooltipSeparator />
      <ChartTooltipRow
        label={t('dailyGoalLine')}
        value={formatDuration(targetMinutes)}
      />
      {item.isGoalMet ? (
        <div className="flex items-center gap-1 pt-0.5 text-[10px] font-bold text-primary">
          <Icons name="check" className="h-3 w-3" />
          <span>{t('goalsMet')}</span>
        </div>
      ) : item.minutes > 0 ? (
        <div className="pt-0.5 text-[10px] text-muted-foreground">
          {t('minutesLeft', { minutes: remaining })}
        </div>
      ) : null}
    </ChartTooltipCard>
  );
}
