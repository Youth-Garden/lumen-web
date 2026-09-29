'use client';

import Image from 'next/image';
import React from 'react';

export interface PlantGrowthStageProps {
  stage?: number;
  isWilted?: boolean;
  size?: number | string;
  className?: string;
  alt?: string;
}

export function PlantGrowthStage({
  stage = 1,
  isWilted = false,
  size,
  className = '',
  alt,
}: PlantGrowthStageProps) {
  const clampedStage = Math.max(0, Math.min(5, Math.round(stage)));

  let imagePath = `/images/plants/step-${clampedStage}.png`;
  let defaultAlt = `Plant Stage ${clampedStage}`;

  if (isWilted) {
    imagePath = '/images/plants/wilted.png';
    defaultAlt = 'Wilted Plant';
  } else if (clampedStage === 0) {
    imagePath = '/images/plants/seed.png';
    defaultAlt = 'Plant Seed';
  }

  const dimensionStyle: React.CSSProperties = size
    ? {
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
      }
    : {};

  return (
    <div
      style={dimensionStyle}
      className={`relative inline-block shrink-0 select-none ${size ? '' : 'w-full h-full'} ${className}`.trim()}
    >
      <Image
        src={imagePath}
        alt={alt ?? defaultAlt}
        fill
        sizes="(max-width: 768px) 120px, 200px"
        className="object-contain"
      />
    </div>
  );
}
