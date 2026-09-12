import React from 'react';
import type { IconProps } from '../types';

export const PlantWiltedIcon = ({
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
      <defs>
        <linearGradient id="pw-wiltedStem" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#4D7C0F" />
          <stop offset="100%" stopColor="#A16207" />
        </linearGradient>
      </defs>

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
          d="M30 51 C31 38 36 26 44 23"
          stroke="url(#pw-wiltedStem)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        <path
          d="M31 43 C23 44 19 49 21 52 C26 51 29 46 31 43 Z"
          fill="#65A30D"
        />
        <path
          d="M36 36 C42 39 44 45 42 48 C39 46 38 41 36 36 Z"
          fill="#4D7C0F"
        />

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
    </svg>
  );
};
