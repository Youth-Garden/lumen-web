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
      <defs>
        {/* Seed Gradients */}
        <linearGradient id="seedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="60%" stopColor="#78350F" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>
        <linearGradient id="seedHighlight" x1="0%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="sproutGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#4ADE80" />
        </linearGradient>

        {/* Wilted flower gradient */}
        <linearGradient id="wiltedStem" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#4D7C0F" />
          <stop offset="100%" stopColor="#A16207" />
        </linearGradient>
      </defs>

      {/* Subtle curved soil baseline */}
      <path
        d="M16 52 C26 50 38 50 48 52"
        stroke="#854D0E"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      {/* Small soil mound */}
      <ellipse
        cx="32"
        cy="51.5"
        rx="11"
        ry="2.2"
        fill="#713F12"
        opacity="0.3"
      />

      {/* Stage 0: Cute, organic seed with tiny green sprout popping out */}
      {clampedStage === 0 && (
        <g transform="translate(0, 1)">
          {/* Soil cleft where seed rests */}
          <path
            d="M24 51 Q32 53 40 51"
            stroke="#542F0C"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Seed body - charming teardrop/almond seed shape */}
          <g transform="rotate(-15 32 44)">
            {/* Outer seed shell */}
            <path
              d="M32 30 C37 30 42 37 40 44 C38 49 34 51 31 51 C26 51 23 47 24 41 C25 35 28 30 32 30 Z"
              fill="url(#seedGrad)"
            />
            {/* Natural seed seam / stripe */}
            <path
              d="M32 32 C35 36 36 43 33 49"
              stroke="#D97706"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.8"
            />
            {/* Soft specular highlight */}
            <path
              d="M26 38 C26 34 29 32 31 32"
              stroke="url(#seedHighlight)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />

            {/* Tiny fresh green sprout leaf cracking out of top */}
            <path
              d="M32 30 C33 24 37 22 39 21 C39 25 36 28 32 30 Z"
              fill="url(#sproutGrad)"
            />
            <path
              d="M32 30 C29 25 28 22 30 20 C32 23 33 27 32 30 Z"
              fill="#22C55E"
            />
          </g>
        </g>
      )}

      {/* Stage 1: Tiny sprout popping up */}
      {clampedStage === 1 && (
        <g>
          <path
            d="M32 51 Q32 41 32 36"
            stroke="#16A34A"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M32 38 C38 35 40 30 38 27 C34 27 33 32 32 38 Z"
            fill="#4ADE80"
          />
          <path
            d="M32 39 C26 36 24 31 26 28 C30 28 31 33 32 39 Z"
            fill="#22C55E"
          />
        </g>
      )}

      {/* Stage 2: Seedling with 2 larger leaves */}
      {clampedStage === 2 && (
        <g>
          <path
            d="M32 51 Q32 38 32 30"
            stroke="#16A34A"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          <path
            d="M32 36 C22 33 19 26 22 23 C27 23 30 29 32 36 Z"
            fill="#4ADE80"
          />
          <path
            d="M32 34 C42 31 45 24 42 21 C37 21 34 27 32 34 Z"
            fill="#22C55E"
          />
        </g>
      )}

      {/* Stage 3: Young taller plant with multiple leaves */}
      {clampedStage === 3 && (
        <g>
          <path
            d="M32 51 Q32 34 32 21"
            stroke="#16A34A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M32 40 C21 38 18 32 21 29 C26 29 29 35 32 40 Z"
            fill="#22C55E"
          />
          <path
            d="M32 36 C43 34 46 28 43 25 C38 25 35 31 32 36 Z"
            fill="#16A34A"
          />
          <path
            d="M32 26 C24 23 23 17 26 15 C30 15 31 21 32 26 Z"
            fill="#4ADE80"
          />
          <path
            d="M32 24 C40 21 41 15 38 13 C34 13 33 19 32 24 Z"
            fill="#22C55E"
          />
        </g>
      )}

      {/* Stage 4: Elegant Flower Bud ready to bloom */}
      {clampedStage === 4 && (
        <g>
          <path
            d="M32 51 Q32 34 32 22"
            stroke="#16A34A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Lower leaves */}
          <path
            d="M32 40 C21 38 18 32 21 29 C26 29 29 35 32 40 Z"
            fill="#22C55E"
          />
          <path
            d="M32 36 C43 34 46 28 43 25 C38 25 35 31 32 36 Z"
            fill="#16A34A"
          />
          {/* Flower Bud Petals & Sepals */}
          <path
            d="M32 14 C27 17 27 24 32 25 C37 24 37 17 32 14 Z"
            fill="#F59E0B"
          />
          <path
            d="M32 16 C29 18 29 23 32 24 C35 23 35 18 32 16 Z"
            fill="#FBBF24"
          />
          <path
            d="M27 22 C29 26 35 26 37 22 C34 25 30 25 27 22 Z"
            fill="#15803D"
          />
        </g>
      )}

      {/* Stage 5: Full Sunflower (Healthy vs Wilted) */}
      {clampedStage === 5 && !isWilted && (
        <g>
          <path
            d="M32 51 Q32 34 32 22"
            stroke="#16A34A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M32 40 C20 38 17 31 20 28 C26 28 29 34 32 40 Z"
            fill="#22C55E"
          />
          <path
            d="M32 36 C44 34 47 27 44 24 C38 24 35 31 32 36 Z"
            fill="#16A34A"
          />

          {/* Healthy Blooming Sunflower Petals */}
          <g transform="translate(32, 18)">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
              (angle) => (
                <ellipse
                  key={angle}
                  cx="0"
                  cy="-10"
                  rx="3"
                  ry="4.8"
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
                  cy="-8.5"
                  rx="2.3"
                  ry="3.8"
                  fill="#FBBF24"
                  transform={`rotate(${angle})`}
                />
              ),
            )}
            <circle cx="0" cy="0" r="6" fill="#78350F" />
            <circle cx="0" cy="0" r="4.2" fill="#92400E" />
          </g>
        </g>
      )}

      {/* Stage 5 (Wilted): Thirsty, gracefully drooping flower needing review/water */}
      {clampedStage === 5 && isWilted && (
        <g>
          {/* Smooth gracefully arched stem leaning to the right without kinks */}
          <path
            d="M30 51 C31 38 36 26 44 23"
            stroke="url(#wiltedStem)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Softly drooping leaves attached naturally to the stem */}
          <path
            d="M31 43 C23 44 19 49 21 52 C26 51 29 46 31 43 Z"
            fill="#65A30D"
          />
          <path
            d="M36 36 C42 39 44 45 42 48 C39 46 38 41 36 36 Z"
            fill="#4D7C0F"
          />

          {/* Drooping flower head bowed naturally */}
          <g transform="translate(44, 23) rotate(52)">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
              (angle) => (
                <ellipse
                  key={angle}
                  cx="0"
                  cy="-7.5"
                  rx="2.2"
                  ry="3.6"
                  fill={angle % 60 === 0 ? '#B45309' : '#D97706'}
                  transform={`rotate(${angle})`}
                  opacity="0.9"
                />
              ),
            )}
            <circle cx="0" cy="0" r="5" fill="#542F0C" />
            <circle cx="0" cy="0" r="3.5" fill="#78350F" />
          </g>
        </g>
      )}
    </svg>
  );
}
