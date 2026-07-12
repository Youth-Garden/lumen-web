'use client';

import * as React from 'react';
import { cn } from '@lumen/uikit/utils';

interface RadialProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  valueSuffix?: string;
  valuePrefix?: string;
  colorClass?: string;
  trackColorClass?: string;
}

export function RadialProgress({
  value,
  max = 100,
  size = 120,
  strokeWidth = 12,
  showValue = true,
  valueSuffix = '',
  valuePrefix = '',
  colorClass = 'text-primary',
  trackColorClass = 'text-muted/20',
  className,
  ...props
}: RadialProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  const safeValue = Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? safeValue / max : 0;
  const offset = circumference - percent * circumference;

  return (
    <div
      className={cn('relative flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      {...props}
    >
      <svg
        className="rotate-[-90deg] transform"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Track */}
        <circle
          className={cn('transition-all duration-300 ease-in-out', trackColorClass)}
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        {/* Progress */}
        <circle
          className={cn('transition-all duration-1000 ease-out', colorClass)}
          stroke="currentColor"
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      {showValue && (
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold tracking-tighter">
            {valuePrefix}{safeValue}{valueSuffix}
          </span>
        </div>
      )}
    </div>
  );
}
