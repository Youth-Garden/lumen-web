'use client';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@lumen/uikit/components';
import { cn } from '@lumen/uikit/utils';
import { useTranslations } from 'next-intl';
import React from 'react';

import type { HeatmapLegendProps } from '../../types/heatmap.types';
import { getIntensityDotClass } from '../../utils/heatmap.utils';

export function HeatmapLegend({
  activeDaysCount,
  averagePerDay,
  lessText,
  moreText,
}: HeatmapLegendProps) {
  const t = useTranslations('Dashboard');
  const legendItems = [
    { count: 0, label: '0' },
    { count: 1, label: '1-2' },
    { count: 5, label: '3-6' },
    { count: 12, label: '7-14' },
    { count: 25, label: '15+' },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-muted-foreground pt-2 border-t border-border/30">
      <span className="text-[10px] text-muted-foreground/80 font-medium">
        {t('activeDaysSummary', {
          activeDays: activeDaysCount,
          avg: averagePerDay,
        })}
      </span>
      <div className="flex items-center gap-1.5">
        <span className="text-muted-foreground/80">{lessText}</span>
        {legendItems.map((item) => (
          <Tooltip key={item.label}>
            <TooltipTrigger
              render={
                <div
                  className={cn(
                    'w-2.5 h-2.5 rounded-[2.5px] cursor-help',
                    getIntensityDotClass(item.count),
                  )}
                />
              }
            />
            <TooltipContent
              variant="card"
              side="top"
              align="center"
              sideOffset={6}
              className="p-2 min-w-[85px] pointer-events-none"
            >
              <span className="text-[10px] font-semibold text-foreground">
                {item.label} {t('totalActivities').toLowerCase()}
              </span>
            </TooltipContent>
          </Tooltip>
        ))}
        <span className="text-muted-foreground/80">{moreText}</span>
      </div>
    </div>
  );
}
