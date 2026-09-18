import React from 'react';
import { cn } from '@lumen/uikit/utils';
import { PlantMasteryRing } from './plant-mastery-ring';

interface SegmentedMasteryGaugeProps {
  level: number; // 1 to 5
  count: number;
  label: string;
  onClick?: () => void;
}

export function SegmentedMasteryGauge({
  level,
  count,
  label,
  onClick,
}: SegmentedMasteryGaugeProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={cn(
        'flex flex-col items-center space-y-1 outline-none focus:outline-none focus-visible:outline-none',
        onClick && 'cursor-pointer hover:opacity-80 transition-opacity'
      )}
    >
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

