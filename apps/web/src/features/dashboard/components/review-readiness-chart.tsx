'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

import { ChartContainer } from '@/shared/components/chart/chart-container';
import {
  ChartTooltip,
  ChartTooltipCard,
  ChartTooltipRow,
  ChartTooltipTitle,
} from '@/shared/components/chart/chart-tooltip';

interface ReviewReadinessChartProps {
  dueCount: number;
  totalLearnedWords: number;
  masteredCount: number;
  isLoading?: boolean;
}

export function ReviewReadinessChart({
  dueCount,
  totalLearnedWords,
  masteredCount,
  isLoading = false,
}: ReviewReadinessChartProps) {
  const t = useTranslations('Dashboard.Overview');

  const safeTotal = Math.max(totalLearnedWords, 1);
  const learningCount = Math.max(0, totalLearnedWords - masteredCount);

  const chartData = useMemo(() => {
    if (totalLearnedWords === 0 && dueCount === 0) {
      return [
        {
          name: t('noWordsYet'),
          value: 1,
          count: 0,
          percent: 0,
          fill: 'var(--muted)',
        },
      ];
    }

    return [
      {
        name: t('dueReviewCards'),
        value: Math.max(dueCount, 0.001),
        count: dueCount,
        percent: Math.round((dueCount / safeTotal) * 100),
        fill: 'var(--warning)',
      },
      {
        name: t('inLearningWords'),
        value: Math.max(learningCount, 0.001),
        count: learningCount,
        percent: Math.round((learningCount / safeTotal) * 100),
        fill: 'var(--primary)',
      },
      {
        name: t('masteredWords'),
        value: Math.max(masteredCount, 0.001),
        count: masteredCount,
        percent: Math.round((masteredCount / safeTotal) * 100),
        fill: 'var(--success)',
      },
    ];
  }, [dueCount, totalLearnedWords, masteredCount, safeTotal, learningCount, t]);

  if (isLoading) {
    return (
      <Card className="rounded-3xl border-none bg-card shadow-xs p-6 space-y-4">
        <Skeleton className="h-6 w-40 rounded-lg" />
        <Skeleton className="h-44 w-full rounded-2xl" />
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-none bg-card shadow-xs overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <CardTitle className="text-base font-bold font-heading text-foreground">
              {t('readinessTitle')}
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              {t('readinessDesc')}
            </CardDescription>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">
            {totalLearnedWords} {t('cards')}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-1">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Donut Chart */}
          <div className="w-36 h-36 relative flex items-center justify-center shrink-0">
            <ChartContainer width="100%" height="100%">
              <PieChart>
                <ChartTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const item = payload[0].payload;
                    return (
                      <ChartTooltipCard>
                        <ChartTooltipTitle>{item.name}</ChartTooltipTitle>
                        <ChartTooltipRow
                          color={item.fill}
                          label={t('cards')}
                          value={item.count}
                          subValue={`(${item.percent}%)`}
                        />
                      </ChartTooltipCard>
                    );
                  }}
                />
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="65%"
                  outerRadius="90%"
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`readiness-${index}`}
                      fill={entry.fill}
                      opacity={
                        totalLearnedWords === 0 && dueCount === 0 ? 0.3 : 1
                      }
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-heading font-black text-foreground">
                {totalLearnedWords}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {t('total')}
              </span>
            </div>
          </div>

          {/* Breakdown Legend with clean progress bars */}
          <div className="flex-1 w-full space-y-2.5">
            {chartData.map((item, index) => (
              <div key={`legend-${index}`} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-muted-foreground text-[11px] font-medium">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-bold text-foreground text-[11px]">
                    {item.count}{' '}
                    <span className="font-normal text-muted-foreground">
                      ({item.percent}%)
                    </span>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-muted/30 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.max(item.count > 0 ? 5 : 0, item.percent)}%`,
                      backgroundColor: item.fill,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
