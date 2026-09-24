import React from 'react';
import type { IconProps } from '../types';

export interface ProgressRingIconProps extends IconProps {
  /** Completion percentage (0 - 100). Default: 0 */
  percent?: number;
  /** Stroke width of the ring circles. Default: 2.5 */
  strokeWidth?: number;
}

export function ProgressRingIcon({
  size = 24,
  percent = 0,
  strokeWidth = 2.5,
  className,
  style,
  testID,
  ...props
}: ProgressRingIconProps) {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const safePercent = Math.min(100, Math.max(0, percent));
  const strokeDashoffset = circumference - (safePercent / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      style={style}
      data-testid={testID}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Background Track Circle */}
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        opacity={0.2}
      />
      {/* Active Arc Circle */}
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        className="transform -rotate-90 origin-center transition-all duration-500 ease-out"
      />
    </svg>
  );
}
