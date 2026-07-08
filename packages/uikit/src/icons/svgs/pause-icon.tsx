import React from 'react';
import type { IconProps } from '../types';

const PauseIcon = ({
  size = 24,
  color = 'currentColor',
  viewBox = '0 0 24 24',
  style,
  testID,
  ...props
}: IconProps) => {
  return (
    <svg width={size} height={size} viewBox={viewBox} color={color} style={style} data-testid={testID} fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/>
    </svg>
  );
};

export { PauseIcon };
