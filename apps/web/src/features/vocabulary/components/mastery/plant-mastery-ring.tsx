'use client';

import React from 'react';
import { PlantGrowthIcon } from '@lumen/uikit/icons';

export interface PlantMasteryRingProps {
  level: number;
  learningStep?: number;
  isWilted?: boolean;
  size?: number;
  showInnerIcon?: boolean;
  children?: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
  title?: string;
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
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  if (Math.abs(endAngle - startAngle) < 0.1) {
    endAngle = startAngle + 0.1;
  }

  const start = polarToCartesian(centerX, centerY, radius, endAngle);
  const end = polarToCartesian(centerX, centerY, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M',
    start.x.toFixed(2),
    start.y.toFixed(2),
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x.toFixed(2),
    end.y.toFixed(2),
  ].join(' ');
}

// 5 equal arc segments.
// To account for strokeLinecap="round" adding ~13.2 degrees of extension per segment,
// we set mathematical gap to 26 degrees to get a visual gap of ~13 degrees (~4px).
// 26 degree gap, 46 degree arc. Total = 72 * 5 = 360.
// Starting from top-right, going clockwise. 0 degrees is exactly in the top gap.
const ARC_SEGMENTS = [
  { start: 13, end: 59 },
  { start: 85, end: 131 },
  { start: 157, end: 203 },
  { start: 229, end: 275 },
  { start: 301, end: 347 },
];

export function PlantMasteryRing({
  level = 0,
  learningStep = 0,
  isWilted = false,
  size = 44,
  showInnerIcon = true,
  children,
  className = '',
  onClick,
  title,
}: PlantMasteryRingProps) {
  const clampedLevel = Math.max(0, Math.min(5, Math.round(level)));
  const innerIconSize = Math.round(size * 0.68);

  const content = (
    <div
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center shrink-0"
    >
      {/* 5 segmented notch ring */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
        {ARC_SEGMENTS.map((segment, index) => {
          const isGaugeMode = !showInnerIcon;

          let isSolidlyFilled = false;
          let isPartiallyFilled = false;
          let partialRatio = 0;
          let activeEndAngle = segment.end;

          if (isGaugeMode) {
            isSolidlyFilled = index < clampedLevel;
          } else {
            if (index === 0) {
              if (clampedLevel === 0) {
                if (learningStep > 0) {
                  isPartiallyFilled = true;
                  partialRatio = Math.min(1, learningStep / 6);
                  activeEndAngle =
                    segment.start +
                    (segment.end - segment.start) * partialRatio;
                }
              } else {
                isSolidlyFilled = true;
              }
            }
          }

          return (
            <React.Fragment key={index}>
              {/* Background Dim Notch */}
              <path
                d={describeArc(24, 24, 19.5, segment.start, segment.end)}
                fill="none"
                strokeWidth="4.5"
                strokeLinecap="round"
                className="stroke-border dark:stroke-muted"
                opacity={0.35}
              />

              {/* Foreground Filled Notch */}
              {(isSolidlyFilled || isPartiallyFilled) && (
                <path
                  d={describeArc(24, 24, 19.5, segment.start, activeEndAngle)}
                  fill="none"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  className={
                    isWilted && isSolidlyFilled
                      ? 'stroke-amber-500 dark:stroke-amber-400'
                      : 'stroke-primary'
                  }
                  style={{ transition: 'd 0.3s ease-out' }}
                />
              )}
            </React.Fragment>
          );
        })}
      </svg>

      {/* Center: plant icon or custom children */}
      {children ? (
        <div className="relative z-10 flex items-center justify-center select-none pointer-events-none">
          {children}
        </div>
      ) : showInnerIcon ? (
        <div
          style={{ width: innerIconSize, height: innerIconSize }}
          className="relative z-10 flex items-center justify-center select-none pointer-events-none"
        >
          <PlantGrowthIcon
            stage={clampedLevel > 0 ? clampedLevel : Math.min(5, learningStep)}
            isWilted={isWilted}
            className="w-full h-full"
          />
        </div>
      ) : null}
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={title}
        className={`p-1 rounded-full hover:bg-muted/40 transition-transform active:scale-95 cursor-pointer outline-none focus:outline-none focus-visible:outline-none select-none ${className}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div title={title} className={`p-1 select-none ${className}`}>
      {content}
    </div>
  );
}
