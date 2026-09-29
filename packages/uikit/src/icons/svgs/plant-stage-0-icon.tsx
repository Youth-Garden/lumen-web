import type { IconProps } from '../types';

export const PlantStage0Icon = ({
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
        <linearGradient id="p0-seedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="60%" stopColor="#78350F" />
          <stop offset="100%" stopColor="#451A03" />
        </linearGradient>
        <linearGradient
          id="p0-seedHighlight"
          x1="0%"
          y1="0%"
          x2="50%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.1" />
        </linearGradient>
        <linearGradient id="p0-sproutGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#16A34A" />
          <stop offset="100%" stopColor="#4ADE80" />
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

      <g transform="translate(0, 1)">
        <path
          d="M24 51 Q32 53 40 51"
          stroke="#542F0C"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <g transform="rotate(-15 32 44)">
          <path
            d="M32 30 C37 30 42 37 40 44 C38 49 34 51 31 51 C26 51 23 47 24 41 C25 35 28 30 32 30 Z"
            fill="url(#p0-seedGrad)"
          />
          <path
            d="M32 32 C35 36 36 43 33 49"
            stroke="#D97706"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.8"
          />
          <path
            d="M26 38 C26 34 29 32 31 32"
            stroke="url(#p0-seedHighlight)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M32 30 C33 24 37 22 39 21 C39 25 36 28 32 30 Z"
            fill="url(#p0-sproutGrad)"
          />
          <path
            d="M32 30 C29 25 28 22 30 20 C32 23 33 27 32 30 Z"
            fill="#22C55E"
          />
        </g>
      </g>
    </svg>
  );
};
