'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@lumen/uikit/components';
import { cn } from '@lumen/uikit/utils';
import { format, isSameDay } from 'date-fns';
import { useTranslations } from 'next-intl';

import {
  ChartTooltipRow,
  ChartTooltipTitle,
} from '@/shared/components/chart/chart-tooltip';
import type { HeatmapGridProps } from '../../types/heatmap.types';
import {
  getIntensityClass,
  getIntensityDotClass,
} from '../../utils/heatmap.utils';

export function HeatmapGrid({
  weeks,
  monthLabels,
  today,
  scrollContainerRef,
}: HeatmapGridProps) {
  const t = useTranslations('Dashboard');
  const tOverview = useTranslations('Dashboard.Overview');

  return (
    <div
      ref={scrollContainerRef}
      className="overflow-x-auto pb-1 scrollbar-thin scroll-smooth"
    >
      <div className="flex gap-2.5 w-max py-1">
        {/* Day-of-week labels */}
        <div className="flex flex-col gap-1 text-[10px] font-medium text-muted-foreground/70 select-none pt-5 shrink-0">
          <span className="h-3 leading-3" />
          <span className="h-3 leading-3">{t('dayMon')}</span>
          <span className="h-3 leading-3" />
          <span className="h-3 leading-3">{t('dayWed')}</span>
          <span className="h-3 leading-3" />
          <span className="h-3 leading-3">{t('dayFri')}</span>
          <span className="h-3 leading-3" />
        </div>

        <div className="flex flex-col gap-1.5">
          {/* Month labels */}
          <div className="flex gap-1 h-3.5 text-[10px] font-medium text-muted-foreground/70 select-none">
            {weeks.map((_, weekIndex) => {
              const monthItem = monthLabels.find(
                (item) => item.weekIndex === weekIndex,
              );
              return (
                <div
                  key={weekIndex}
                  className="w-3 shrink-0 text-left overflow-visible"
                >
                  {monthItem?.label && (
                    <span className="whitespace-nowrap">{monthItem.label}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Matrix of days */}
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1 shrink-0">
                {week.map((day, dayIndex) => {
                  if (!day)
                    return (
                      <div
                        key={`empty-${weekIndex}-${dayIndex}`}
                        className="w-3 h-3 rounded-full shrink-0 bg-transparent"
                      />
                    );

                  if (day.isFuture) {
                    return (
                      <div
                        key={day.dateStr}
                        className="w-3 h-3 rounded-full shrink-0 bg-muted/40 dark:bg-muted/30"
                      />
                    );
                  }

                  const formattedDate = format(day.date, 'dd/MM/yyyy');
                  const isToday = isSameDay(day.date, today);
                  const safeCount = day.count || 0;

                  return (
                    <Tooltip key={day.dateStr}>
                      <TooltipTrigger
                        render={
                          <div
                            tabIndex={0}
                            className={cn(
                              'w-3 h-3 rounded-full shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-1 focus-visible:ring-offset-card animate-in fade-in zoom-in-90',
                              getIntensityClass(safeCount),
                            )}
                            style={{
                              animationDelay: `${(weekIndex + dayIndex) % 500}ms`,
                            }}
                          />
                        }
                      />
                      <TooltipContent
                        variant="card"
                        side="top"
                        align="center"
                        sideOffset={6}
                        className="p-3 min-w-[140px] space-y-1.5 pointer-events-none"
                      >
                        <ChartTooltipTitle>
                          {formattedDate} {isToday && `• ${tOverview('today')}`}
                        </ChartTooltipTitle>
                        <ChartTooltipRow
                          label={t('totalActivities')}
                          value={
                            safeCount > 0
                              ? t('activitiesValue', {
                                  count: safeCount,
                                })
                              : 0
                          }
                        />
                        {safeCount > 0 && (
                          <div className="w-full h-1.5 rounded-full bg-muted/50 mt-0.5 overflow-hidden">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all',
                                getIntensityDotClass(Math.min(safeCount, 30)),
                              )}
                              style={{
                                width: `${Math.min((safeCount / 30) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
