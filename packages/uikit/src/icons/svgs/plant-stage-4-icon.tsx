import React from 'react';
import type { IconProps } from '../types';

export const PlantStage4Icon = ({
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
          d="M32 40 C21 38 18 32 21 29 C26 29 29 35 32 40 Z"
          fill="#22C55E"
        />
        <path
          d="M32 36 C43 34 46 28 43 25 C38 25 35 31 32 36 Z"
          fill="#16A34A"
        />
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
    </svg>
  );
};
