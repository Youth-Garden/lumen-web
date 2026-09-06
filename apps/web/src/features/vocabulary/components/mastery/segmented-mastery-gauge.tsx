'use client';

import React from 'react';

interface SegmentedMasteryGaugeProps {
  level: number; // 1 to 5
  count: number;
  label: string;
}

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(' ');
}

// 5 equal arc segments with clean gaps
const ARC_SEGMENTS = [
  { start: 6, end: 66 },
  { start: 78, end: 138 },
  { start: 150, end: 210 },
  { start: 222, end: 282 },
  { start: 294, end: 354 },
];

export function SegmentedMasteryGauge({
  level,
  count,
  label,
}: SegmentedMasteryGaugeProps) {
  return (
    <div className="flex flex-col items-center space-y-1">
      {/* Segmented Ring */}
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg className="w-12 h-12" viewBox="0 0 48 48">
          {ARC_SEGMENTS.map((arc, index) => {
            const isFilled = index < level;
            return (
              <path
                key={index}
                d={describeArc(24, 24, 19, arc.start, arc.end)}
                fill="none"
                strokeWidth="3.5"
                strokeLinecap="round"
                className={`transition-colors duration-200 ${
                  isFilled
                    ? 'stroke-primary'
                    : 'stroke-muted/30 dark:stroke-slate-800'
                }`}
              />
            );
          })}
        </svg>

        <span className="absolute inset-0 flex items-center justify-center font-black text-sm text-foreground select-none">
          {count}
        </span>
      </div>

      {/* Label under gauge */}
      <span className="text-[11px] font-medium text-muted-foreground text-center line-clamp-1 select-none">
        {label}
      </span>
    </div>
  );
}
