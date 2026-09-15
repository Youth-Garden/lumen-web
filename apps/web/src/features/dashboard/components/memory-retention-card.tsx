'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

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
          <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icons name="activity" className="h-4 w-4" />
            </div>
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
            <div className="w-full h-40 relative flex items-center justify-center -mb-4 overflow-visible pt-2">
              <ResponsiveContainer
                width="100%"
                height="100%"
                className="overflow-visible"
              >
                <PieChart className="overflow-visible">
                  <Tooltip
                    isAnimationActive={false}
                    allowEscapeViewBox={{ x: true, y: true }}
                    position={{ y: -16 }}
                    wrapperStyle={{ zIndex: 50, pointerEvents: 'none' }}
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const item = payload[0].payload;
                      if (totalLearnedWords === 0) {
                        return (
                          <div className="rounded-xl bg-foreground text-background px-3 py-1.5 shadow-lg text-xs font-medium pointer-events-none">
                            {t('noWordsLearnedYet')}
                          </div>
                        );
                      }
                      return (
                        <div className="rounded-xl bg-foreground text-background px-3 py-2 shadow-lg text-xs space-y-0.5 pointer-events-none min-w-[125px]">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span
                              className="h-2 w-2 rounded-full shrink-0"
                              style={{ backgroundColor: item.fill }}
                            />
                            <span>{item.name}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 opacity-90 text-[11px]">
                            <span>
                              {t('totalWordsCount', { count: item.count })}
                            </span>
                            <span className="font-extrabold text-background">
                              {item.percent}%
                            </span>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="85%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius="70%"
                    outerRadius="98%"
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
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
              </ResponsiveContainer>

              {/* Gauge Center Percentage Metric */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-3 pointer-events-none">
                <span className="text-3xl font-heading font-black tracking-tight text-foreground">
                  {retentionPercent}%
                </span>
                <span className="text-[11px] font-medium text-muted-foreground">
                  {t('masteredWordsRate')}
                </span>
              </div>
            </div>

            {/* Clean, Non-Boxy Level Breakdown List (Anti-box-in-box) */}
            <div className="w-full pt-3 border-t border-border/40 space-y-2">
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
