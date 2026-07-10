import React from 'react';
import type { IconProps } from '../types';

const TrophyIcon = ({
  size = 24,
  color = 'currentColor',
  viewBox = '0 0 24 24',
  style,
  testID,
  ...props
}: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox={viewBox}
      color={color}
      style={style}
      data-testid={testID}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 9H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-2" />
      <path d="M12 17v5" />
      <path d="M7 22h10" />
      <path d="M18 9c0 4.4-3.6 8-8 8s-8-3.6-8-8" />
    </svg>
  );
};

export { TrophyIcon };
