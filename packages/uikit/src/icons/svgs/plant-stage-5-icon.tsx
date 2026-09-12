import React from 'react';
import type { IconProps } from '../types';

export const PlantStage5Icon = ({
  size = 24,
  className = 'shrink-0',
  style,
  testID,
  ...props
}: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      style={style}
      data-testid={testID}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M16 52 C26 50 38 50 48 52"
        stroke="#854D0E"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <ellipse
        cx="32"
        cy="51.5"
        rx="11"
        ry="2.2"
        fill="#713F12"
        opacity="0.3"
      />
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
    </svg>
  );
};
