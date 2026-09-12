import React from 'react';
import type { IconProps } from '../types';

export const PlantStage1Icon = ({
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
    </svg>
  );
};
