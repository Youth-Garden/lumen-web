import React from 'react';
import type { IconProps } from '../types';

export interface SpinnerIconProps extends IconProps {
  /** Size of the spinner (width/height). Default: 64 */
  size?: number | string;
}

export function SpinnerIcon({
  size = 64,
  className,
  color,
  strokeWidth = 4,
  style,
  testID,
  ...props
}: SpinnerIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={style}
      data-testid={testID}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray="8 10"
        strokeLinecap="round"
      />
    </svg>
  );
}
