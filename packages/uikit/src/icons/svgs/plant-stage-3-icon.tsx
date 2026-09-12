import React from 'react';
import type { IconProps } from '../types';

export const PlantStage3Icon = ({
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
    </svg>
  );
};
