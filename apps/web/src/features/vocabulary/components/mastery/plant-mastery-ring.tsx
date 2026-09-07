'use client';

import React from 'react';
import { PlantGrowthIcon } from '@lumen/uikit/icons';

export interface PlantMasteryRingProps {
  /** Current progress or Spaced Repetition level (0 to 5) */
  level: number;
  /** Inner learning step (0 to 6) for level 0 */
  learningStep?: number;
  /** Whether the word is due for review / flower is wilted */
  isWilted?: boolean;
  /** Outer diameter in pixels (default: 44) */
  size?: number;
  /** Show the center plant growth icon (default: true) */
  showInnerIcon?: boolean;
  /** Custom inner content */
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

// 5 equal arc segments, 56° arc each, 16° gap between segments
// Total: 5 × 56° + 5 × 16° = 280° + 80° = 360° ✓
// Starting from top-right, going clockwise
const ARC_SEGMENTS = [
  { start: 8,   end: 64 },
  { start: 80,  end: 136 },
  { start: 152, end: 208 },
  { start: 224, end: 280 },
  { start: 296, end: 352 },
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
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 48 48"
      >
        {ARC_SEGMENTS.map((segment, index) => {
          const isGaugeMode = !showInnerIcon;
          
          let isSolidlyFilled = false;
          let isPartiallyFilled = false;
          let partialRatio = 0;

          if (isGaugeMode) {
            // Gauge Mode (Level indicator): Fills notches based on level (1 to 5)
            isSolidlyFilled = index < clampedLevel;
          } else {
            // Badge Mode (Around Plant Icon): ONLY the first notch (index 0) is ever active!
            if (index === 0) {
              if (clampedLevel === 0) {
                // Learning phase: partially fill based on learningStep (0-6)
                if (learningStep > 0) {
                  isPartiallyFilled = true;
                  partialRatio = Math.min(1, learningStep / 6);
                }
              } else {
                // Levels 1-5: first notch is fully solid
                isSolidlyFilled = true;
              }
            }
            // For index > 0, they remain completely dim.
          }

          // Compute arc length for partial fill using stroke-dasharray/offset
          // Circumference of radius 19.5 = 2 * PI * 19.5 ~ 122.5
          // Segment angle is 56 degrees, so arc length = (56 / 360) * 122.5 ~ 19.06
          const arcLength = 19.06;

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
                  d={describeArc(24, 24, 19.5, segment.start, segment.end)}
                  fill="none"
                  strokeWidth="4.5"
                  strokeLinecap="round"
                  className={
                    isWilted && isSolidlyFilled
                      ? 'stroke-amber-500 dark:stroke-amber-400'
                      : 'stroke-primary'
                  }
                  style={
                    isPartiallyFilled
                      ? {
                          strokeDasharray: arcLength,
                          strokeDashoffset: arcLength * (1 - partialRatio),
                          transition: 'stroke-dashoffset 0.3s ease-out',
                        }
                      : undefined
                  }
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
            stage={clampedLevel}
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
