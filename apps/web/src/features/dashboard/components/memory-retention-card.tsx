'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@lumen/uikit/components';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { Cell, Pie, PieChart } from 'recharts';

import { ChartContainer } from '@/shared/components/chart/chart-container';
import {
  ChartTooltip,
  ChartTooltipCard,
  ChartTooltipRow,
  ChartTooltipTitle,
} from '@/shared/components/chart/chart-tooltip';

export interface MemoryLevelItem {
  level: number;
  label: string;
  count: number;
  colorClass?: string;
  badgeBg?: string;
}

interface MemoryRetentionCardProps {
  levels: MemoryLevelItem[];
  totalLearnedWords: number;
  dueCount: number;
  isLoading: boolean;
}

const LEVEL_TOKENS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

export function MemoryRetentionCard({
  levels,
  totalLearnedWords,
  isLoading,
}: MemoryRetentionCardProps) {
  const t = useTranslations('Dashboard.Overview');

  const safeTotal = Math.max(totalLearnedWords, 1);

  const masteredCount = useMemo(() => {
    return levels
      .filter((lvl) => lvl.level >= 4)
      .reduce((acc, cur) => acc + cur.count, 0);
  }, [levels]);

  const retentionPercent = Math.min(
    Math.round((masteredCount / safeTotal) * 100),
    100,
  );

  const chartData = useMemo(() => {
    if (totalLearnedWords === 0) {
      return [
        {
          name: t('stageLevel1'),
          level: 1,
          value: 1,
          count: 0,
          percent: 0,
          fill: 'var(--muted)',
        },
      ];
    }
    return levels.map((lvl, index) => {
      const percent = Math.round((lvl.count / safeTotal) * 100);
      return {
        name: lvl.label,
        level: lvl.level,
        value: Math.max(lvl.count, 0.001),
        count: lvl.count,
        percent,
        fill: LEVEL_TOKENS[index % LEVEL_TOKENS.length],
      };
    });
  }, [levels, totalLearnedWords, safeTotal, t]);

  return (
    <Card className="rounded-3xl border-none bg-card shadow-xs overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-foreground">
            {t('memoryDistribution')}
          </CardTitle>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary w-fit">
            {isLoading ? (
              <Skeleton className="h-3 w-12 rounded" />
            ) : (
              t('totalWordsCount', { count: totalLearnedWords })
            )}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1 flex-1 flex flex-col justify-between">
        {isLoading ? (
          <div className="h-44 w-full flex items-center justify-center">
            <Skeleton className="h-32 w-32 rounded-full" />
          </div>
        ) : (
          <div className="flex flex-col items-center flex-1 justify-between">
            {/* Semicircle Gauge (180 deg) */}
            <div className="w-full h-40 relative flex items-center justify-center -mb-2 overflow-visible pt-1 z-10">
              <ChartContainer width="100%" height="100%">
                <PieChart className="overflow-visible">
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const item = payload[0].payload;
                      return (
                        <ChartTooltipCard>
                          <ChartTooltipTitle>{item.name}</ChartTooltipTitle>
                          {totalLearnedWords === 0 ? (
                            <p className="text-muted-foreground">
                              {t('noWordsLearnedYet')}
                            </p>
                          ) : (
                            <ChartTooltipRow
                              color={item.fill}
                              label={t('cards')}
                              value={item.count}
                              subValue={`(${item.percent}%)`}
                            />
                          )}
                        </ChartTooltipCard>
                      );
                    }}
                  />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="85%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius="68%"
                    outerRadius="92%"
                    paddingAngle={1.5}
                    dataKey="value"
                    stroke="var(--card)"
                    strokeWidth={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`gauge-cell-${index}`}
                        fill={entry.fill}
                        opacity={totalLearnedWords === 0 ? 0.3 : 1}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>

              {/* Gauge Center Percentage Metric */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-0">
                <span className="text-3xl font-heading font-black tracking-tight text-foreground select-none">
                  {retentionPercent}%
                </span>
                <span className="text-[11px] font-medium text-muted-foreground select-none">
                  {t('masteredWordsRate')}
                </span>
              </div>
            </div>

            {/* Clean, Non-Boxy Level Breakdown List (Anti-box-in-box) */}
            <div className="w-full pt-3 border-t border-border/40 space-y-2 relative z-0">
              {levels.slice(0, 5).map((lvl, index) => {
                const token = LEVEL_TOKENS[index % LEVEL_TOKENS.length];
                const count = lvl.count;
                const percent = Math.round((count / safeTotal) * 100);

                return (
                  <div
                    key={lvl.level}
                    className="flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-[90px]">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: token }}
                      />
                      <span className="text-muted-foreground text-[11px] font-medium">
                        {lvl.label}
                      </span>
                    </div>

                    <div className="flex-1 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.max(count > 0 ? 6 : 0, percent)}%`,
                          backgroundColor: token,
                        }}
                      />
                    </div>

                    <span className="text-[11px] font-bold text-foreground text-right min-w-[50px]">
                      {count}{' '}
                      <span className="font-normal text-muted-foreground">
                        ({percent}%)
                      </span>
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
