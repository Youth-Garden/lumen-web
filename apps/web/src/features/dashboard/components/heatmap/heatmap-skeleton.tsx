'use client';

import { Skeleton } from '@lumen/uikit/components';
import React from 'react';

import type { HeatmapSkeletonProps } from '../../types/heatmap.types';

export function HeatmapSkeleton({ yearsCount = 1 }: HeatmapSkeletonProps) {
  const dummyWeeks = Array.from({ length: 53 });
  const dummyDays = Array.from({ length: 7 });

  return (
    <div className="flex flex-col lg:flex-row items-stretch gap-6 animate-pulse">
      {/* Grid Skeleton */}
      <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
        <div className="flex gap-2.5 items-start">
          <div className="flex flex-col gap-1 pt-5 py-1 shrink-0">
            <Skeleton className="w-4 h-3 rounded" />
            <Skeleton className="w-4 h-3 rounded" />
            <Skeleton className="w-4 h-3 rounded" />
          </div>

          <div className="flex-1 min-w-0 overflow-x-auto pb-1 scrollbar-thin">
            <div className="flex flex-col gap-1.5 w-max py-1">
              <div className="flex gap-2 h-3.5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <Skeleton key={i} className="w-8 h-3 rounded shrink-0 mr-2" />
                ))}
              </div>

              <div className="flex gap-1">
                {dummyWeeks.map((_, wIdx) => (
                  <div key={wIdx} className="flex flex-col gap-1 shrink-0">
                    {dummyDays.map((_, dIdx) => (
                      <div
                        key={dIdx}
                        className="w-3 h-3 rounded-full bg-muted/40 shrink-0"
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend Skeleton */}
        <div className="flex items-center justify-between pt-2 border-t border-border/30">
          <Skeleton className="w-48 h-3 rounded" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="w-6 h-3 rounded" />
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full bg-muted/40" />
              ))}
            </div>
            <Skeleton className="w-6 h-3 rounded" />
          </div>
        </div>
      </div>

      {/* Sidebar Skeleton */}
      <div className="hidden lg:flex flex-col justify-between w-60 xl:w-64 border-l border-border/40 pl-5 py-0.5 shrink-0 space-y-3">
        <div className="space-y-3">
          <Skeleton className="w-32 h-4 rounded" />
          <div className="space-y-2.5">
            <Skeleton className="w-full h-3 rounded" />
            <Skeleton className="w-full h-3 rounded" />
            <Skeleton className="w-full h-3 rounded" />
            <Skeleton className="w-full h-3 rounded" />
          </div>
        </div>
        <Skeleton className="w-full h-12 rounded-2xl" />
      </div>

      {/* Year Column Skeleton */}
      <div className="flex flex-row lg:flex-col gap-1.5 shrink-0 border-t lg:border-t-0 lg:border-l border-border/40 pt-3 lg:pt-0 lg:pl-5 justify-start">
        {Array.from({ length: Math.max(yearsCount, 1) }).map((_, i) => (
          <Skeleton key={i} className="w-14 h-8 rounded-lg shrink-0" />
        ))}
      </div>
    </div>
  );
}
