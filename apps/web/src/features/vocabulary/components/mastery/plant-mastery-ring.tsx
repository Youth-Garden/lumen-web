'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useRef } from 'react';

import { PlantGrowthStage } from '@/shared/components/plant-growth-stage';

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

  const start = polarToCartesian(centerX, centerY, radius, startAngle);
  const end = polarToCartesian(centerX, centerY, radius, endAngle);
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
    1,
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

const SEGMENT_ANIM_DURATION = 0.4;

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

  // Track previous level to compute per-segment animation delay for sequential fill.
  // Initialized to clampedLevel so mount render (with initial={false}) has no delay.
  const prevLevelRef = useRef(clampedLevel);

  // Capture snapshot before the effect so delay math uses old value during this render.
  const prevLevel = prevLevelRef.current;
  const isLevelIncreasing = clampedLevel > prevLevel;

  useEffect(() => {
    prevLevelRef.current = clampedLevel;
  }, [clampedLevel]);

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

          if (isGaugeMode) {
            isSolidlyFilled = index < clampedLevel;
          } else {
            if (index < clampedLevel) {
              isSolidlyFilled = true;
            } else if (index === clampedLevel) {
              if (learningStep > 0) {
                isPartiallyFilled = true;
                partialRatio = Math.min(1, learningStep / 5);
              }
            }
          }

          // Sequential delay: only for newly-filled segments when level increases.
          // Decreasing level or partial-fill changes animate immediately (delay=0).
          const segmentDelay =
            isLevelIncreasing && index >= prevLevel && isSolidlyFilled
              ? (index - prevLevel) * SEGMENT_ANIM_DURATION
              : 0;

          return (
            <React.Fragment key={index}>
              {/* Background Dim Notch */}
              <path
                d={describeArc(24, 24, 19.5, segment.start, segment.end)}
                fill="none"
                strokeWidth="4.5"
                strokeLinecap="round"
                className="stroke-slate-300 dark:stroke-slate-700"
              />

              {/* Foreground Animated Notch */}
              <motion.path
                d={describeArc(24, 24, 19.5, segment.start, segment.end)}
                fill="none"
                strokeWidth="4.5"
                strokeLinecap="round"
                className={
                  isWilted && isSolidlyFilled
                    ? 'stroke-amber-500 dark:stroke-amber-400'
                    : 'stroke-primary'
                }
                initial={false}
                animate={{
                  pathLength: isSolidlyFilled
                    ? 1
                    : isPartiallyFilled
                      ? partialRatio
                      : 0,
                  opacity: isSolidlyFilled || isPartiallyFilled ? 1 : 0,
                }}
                transition={{
                  pathLength: {
                    duration: SEGMENT_ANIM_DURATION,
                    ease: 'easeOut',
                    delay: segmentDelay,
                  },
                  opacity: { duration: 0.2, delay: segmentDelay },
                }}
              />
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
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${clampedLevel}-${learningStep}-${isWilted ? 'wilted' : 'healthy'}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{
                scale: 0,
                opacity: 0,
                transition: { duration: 0.15, ease: 'easeIn' },
              }}
              transition={{
                type: 'spring',
                stiffness: 450,
                damping: 22,
                mass: 0.8,
              }}
              className="w-full h-full flex items-center justify-center"
            >
              <PlantGrowthStage
                stage={
                  clampedLevel >= 1 ? clampedLevel : Math.min(5, learningStep)
                }
                isWilted={isWilted}
                className="w-full h-full"
              />
            </motion.div>
          </AnimatePresence>
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
