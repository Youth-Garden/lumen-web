import React from 'react';
import type { IconProps } from '../types';

export interface PlantGrowthIconProps extends Omit<IconProps, 'size'> {
  stage?: number;
  isWilted?: boolean;
  size?: number | string;
}

export function PlantGrowthIcon({
  stage = 1,
  className = 'w-10 h-10',
  isWilted = false,
  size,
  style,
  testID,
  ...props
}: PlantGrowthIconProps) {
  // Clamp stage between 0 and 5
  const clampedStage = Math.max(0, Math.min(5, Math.round(stage)));

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`${className} shrink-0`}
      style={style}
      data-testid={testID}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Soil mound at bottom */}
      <path
        d="M12 50 C12 43 20 40 32 40 C44 40 52 43 52 50 C52 53 44 54 32 54 C20 54 12 53 12 50 Z"
        fill="#8B5A2B"
        opacity="0.9"
      />
      <path
        d="M16 49 C18 44 24 42 32 42 C40 42 46 44 48 49"
        stroke="#A76D38"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Stage 0: Just a seed on the soil */}
      {clampedStage === 0 && (
        <ellipse
          cx="32"
          cy="42"
          rx="3.5"
          ry="2.5"
          fill="#D97706"
          stroke="#92400E"
          strokeWidth="1"
        />
      )}

      {/* Stage 1: Tiny Sprout popping up */}
      {clampedStage === 1 && (
        <g>
          <path
            d="M32 42 Q32 36 33 33"
            stroke="#22C55E"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M33 34 Q38 31 39 35 Q35 37 33 34"
            fill="#4ADE80"
          />
          <path
            d="M32 35 Q27 33 28 37 Q31 38 32 35"
            fill="#22C55E"
          />
        </g>
      )}

      {/* Stage 2: Seedling with 2 larger leaves */}
      {clampedStage === 2 && (
        <g>
          <path
            d="M32 42 Q32 32 32 26"
            stroke="#16A34A"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M31 33 C23 31 20 26 23 23 C28 23 30 28 31 33 Z"
            fill="#4ADE80"
          />
          <path
            d="M33 30 C41 28 44 23 41 20 C36 20 34 25 33 30 Z"
            fill="#22C55E"
          />
        </g>
      )}

      {/* Stage 3: Young taller plant with multiple leaves */}
      {clampedStage === 3 && (
        <g>
          <path
            d="M32 42 Q31 28 32 19"
            stroke="#16A34A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M31 35 C21 34 18 29 21 26 C26 26 29 31 31 35 Z"
            fill="#22C55E"
          />
          <path
            d="M33 33 C43 32 46 27 43 24 C38 24 35 29 33 33 Z"
            fill="#16A34A"
          />
          <path
            d="M31 24 C25 21 24 16 27 14 C30 14 31 19 31 24 Z"
            fill="#4ADE80"
          />
          <path
            d="M33 22 C39 19 40 14 37 12 C34 12 33 17 33 22 Z"
            fill="#22C55E"
          />
        </g>
      )}

      {/* Stage 4: Plant with Flower Bud */}
      {clampedStage === 4 && (
        <g>
          <path
            d="M32 42 Q32 28 32 18"
            stroke="#16A34A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M31 34 C21 33 18 27 21 24 C26 24 29 29 31 34 Z"
            fill="#22C55E"
          />
          <path
            d="M33 30 C43 29 46 23 43 20 C38 20 35 25 33 30 Z"
            fill="#16A34A"
          />
          <path
            d="M27 18 Q32 22 37 18 Q32 15 27 18 Z"
            fill="#15803D"
          />
          <circle
            cx="32"
            cy="15"
            r="6"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="1.5"
          />
          <circle cx="32" cy="15" r="2.5" fill="#78350F" />
        </g>
      )}

      {/* Stage 5: Full Blooming Sunflower */}
      {clampedStage === 5 && (
        <g
          className={
            isWilted ? 'origin-bottom-center rotate-12 transition-transform' : ''
          }
        >
          <path
            d={isWilted ? 'M32 42 Q34 29 36 21' : 'M32 42 Q32 28 32 20'}
            stroke="#16A34A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M31 34 C20 33 17 26 20 23 C26 23 29 29 31 34 Z"
            fill="#22C55E"
          />
          <path
            d="M33 31 C44 30 47 23 44 20 C38 20 35 26 33 31 Z"
            fill="#16A34A"
          />

          {/* Sunflower Petals */}
          <g transform={isWilted ? 'translate(36, 17)' : 'translate(32, 16)'}>
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
              (angle) => (
                <ellipse
                  key={angle}
                  cx="0"
                  cy="-10.5"
                  rx="3.2"
                  ry="5"
                  fill="#F59E0B"
                  transform={`rotate(${angle})`}
                />
              ),
            )}
            {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map(
              (angle) => (
                <ellipse
                  key={angle}
                  cx="0"
                  cy="-9"
                  rx="2.5"
                  ry="4"
                  fill="#FBBF24"
                  transform={`rotate(${angle})`}
                />
              ),
            )}
            <circle cx="0" cy="0" r="6.5" fill="#78350F" />
            <circle cx="0" cy="0" r="4.5" fill="#92400E" />
            <circle cx="-1.5" cy="-1.5" r="1" fill="#B45309" opacity="0.8" />
            <circle cx="1.5" cy="1.5" r="1" fill="#B45309" opacity="0.8" />
          </g>
        </g>
      )}
    </svg>
  );
}
