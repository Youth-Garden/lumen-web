'use client';

import React from 'react';
import { PlantMasteryRing } from './plant-mastery-ring';

interface SegmentedMasteryGaugeProps {
  level: number; // 1 to 5
  count: number;
  label: string;
}

export function SegmentedMasteryGauge({
  level,
  count,
  label,
}: SegmentedMasteryGaugeProps) {
  return (
    <div className="flex flex-col items-center space-y-1">
      <PlantMasteryRing level={level} size={44} showInnerIcon={false}>
        <span className="font-black text-sm text-foreground select-none">
          {count}
        </span>
      </PlantMasteryRing>

      <span className="text-[11px] font-medium text-muted-foreground text-center line-clamp-1 select-none">
        {label}
      </span>
    </div>
  );
}
