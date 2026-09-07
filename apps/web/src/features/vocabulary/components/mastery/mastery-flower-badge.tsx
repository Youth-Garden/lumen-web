'use client';

import { useTranslations } from 'next-intl';

import React from 'react';
import { PlantGrowthIcon } from '@lumen/uikit/icons';

interface MasteryFlowerBadgeProps {
  level: number; // 0 to 5
  onClick?: () => void;
  className?: string;
}

export function MasteryFlowerBadge({
  level = 0,
  onClick,
  className = '',
}: MasteryFlowerBadgeProps) {
  const t = useTranslations('Vocabulary.Mastery');
  // 5 circular arc segments around the center
  // Center is (24, 24), radius = 21
  const segments = [
    { startAngle: 270, endAngle: 330 }, // top right
    { startAngle: 342, endAngle: 402 }, // right bottom
    { startAngle: 414, endAngle: 474 }, // bottom left
    { startAngle: 486, endAngle: 546 }, // left top
    { startAngle: 558, endAngle: 618 }, // top
  ];

  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number,
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
  ) => {
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
  };

  const currentLevel = Math.max(0, Math.min(5, Math.round(level)));

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center justify-center p-1 rounded-full hover:bg-muted/60 transition-transform active:scale-95 cursor-pointer outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 select-none ${className}`}
      title={
        currentLevel === 0
          ? t('seedBadgeTooltip')
          : t('levelBadgeTooltip', { level: currentLevel })
      }
    >
      <div className="relative w-11 h-11 flex items-center justify-center">
        {/* SVG Segmented Ring (5 segments: green when filled, muted when unfilled) */}
        <svg className="w-11 h-11 -rotate-90 absolute inset-0" viewBox="0 0 48 48">
          {segments.map((seg, idx) => {
            const isFilled = idx < currentLevel;
            return (
              <path
                key={idx}
                d={describeArc(24, 24, 21, seg.startAngle, seg.endAngle)}
                fill="none"
                stroke={isFilled ? '#22c55e' : 'currentColor'}
                strokeWidth="3.2"
                strokeLinecap="round"
                className={`transition-colors duration-300 ${
                  isFilled ? 'opacity-100' : 'opacity-20'
                }`}
              />
            );
          })}
        </svg>

        {/* Center Plant Growth Stage (0: seed -> 1: sprout -> 2: leaves -> 3: seedling -> 4: bud -> 5: flower) */}
        <div className="w-8 h-8 flex items-center justify-center pointer-events-none">
          <PlantGrowthIcon stage={currentLevel} className="w-8 h-8" />
        </div>
      </div>
    </button>
  );
}
