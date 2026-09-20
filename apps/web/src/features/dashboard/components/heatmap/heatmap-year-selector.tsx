'use client';

import { Button } from '@lumen/uikit/components';
import React from 'react';

import type { HeatmapYearSelectorProps } from '../../types/heatmap.types';

export function HeatmapYearSelector({
  availableYears,
  activeYear,
  onSelectYear,
}: HeatmapYearSelectorProps) {
  return (
    <div className="flex flex-row lg:flex-col gap-1.5 shrink-0 border-t lg:border-t-0 lg:border-l border-border/40 pt-3 lg:pt-0 lg:pl-5 justify-start">
      {availableYears.map((year) => {
        const isSelected = activeYear === year;
        return (
          <Button
            key={year}
            variant={isSelected ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onSelectYear(year)}
            className="font-semibold text-xs h-8 px-3"
          >
            {year}
          </Button>
        );
      })}
    </div>
  );
}
