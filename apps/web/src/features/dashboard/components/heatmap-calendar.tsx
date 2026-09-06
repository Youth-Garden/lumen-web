'use client';

import { HeatmapItem } from '@/services/progress/progress.types';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@lumen/uikit/components';
import { cn } from '@lumen/uikit/utils';
import {
  format,
  subDays,
  startOfDay,
  parseISO,
  differenceInDays,
} from 'date-fns';
import { useTranslations } from 'next-intl';

interface HeatmapCalendarProps {
  data: HeatmapItem[] | undefined;
  isLoading: boolean;
}

export function HeatmapCalendar({ data, isLoading }: HeatmapCalendarProps) {
  const t = useTranslations('Dashboard');

  // Generate last 365 days
  const today = startOfDay(new Date());
  const days = Array.from({ length: 365 }, (_, dayIndex) => {
    return subDays(today, 364 - dayIndex);
  });

  const heatmapMap = new Map<string, number>();
  data?.forEach((item) => {
    heatmapMap.set(item.date, item.count);
  });

  const getIntensityClass = (count: number) => {
    if (count === 0) return 'bg-muted/50';
    if (count < 5) return 'bg-emerald-200 dark:bg-emerald-900/40';
    if (count < 10) return 'bg-emerald-300 dark:bg-emerald-700/60';
    if (count < 20) return 'bg-emerald-400 dark:bg-emerald-600/80';
    return 'bg-emerald-500 dark:bg-emerald-500';
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('activityHeatmap')}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="w-full h-32 rounded-md" />
        ) : (
          <div className="flex flex-col gap-2 overflow-x-auto pb-2">
            <div
              className="grid gap-[2px] w-max"
              style={{
                gridTemplateRows: 'repeat(7, minmax(0, 1fr))',
                gridAutoFlow: 'column',
                gridAutoColumns: '12px',
              }}
            >
              {days.map((date, idx) => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const count = heatmapMap.get(dateStr) || 0;

                // Align first item with correct day of week (optional polish)
                const startOffset = idx === 0 ? date.getDay() : 0;

                return (
                  <div
                    key={dateStr}
                    title={`${dateStr}: ${count} activities`}
                    className={cn(
                      'w-[12px] h-[12px] rounded-sm transition-colors hover:ring-1 hover:ring-primary',
                      getIntensityClass(count),
                      idx === 0 &&
                        startOffset > 0 &&
                        `row-start-${startOffset + 1}`,
                    )}
                  />
                );
              })}
            </div>
            <div className="flex justify-end items-center gap-2 text-xs text-muted-foreground mt-2">
              <span>{t('less')}</span>
              <div className="w-3 h-3 rounded-sm bg-muted/50" />
              <div className="w-3 h-3 rounded-sm bg-emerald-200 dark:bg-emerald-900/40" />
              <div className="w-3 h-3 rounded-sm bg-emerald-300 dark:bg-emerald-700/60" />
              <div className="w-3 h-3 rounded-sm bg-emerald-400 dark:bg-emerald-600/80" />
              <div className="w-3 h-3 rounded-sm bg-emerald-500 dark:bg-emerald-500" />
              <span>{t('more')}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
