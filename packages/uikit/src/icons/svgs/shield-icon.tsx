import React from 'react';
import type { IconProps } from '../types';

const ShieldIcon = ({
  size = 24,
  color = 'currentColor',
  viewBox = '0 0 24 24',
  style,
  testID,
  ...props
}: IconProps) => {
  return (
    <svg width={size} height={size} viewBox={viewBox} color={color} style={style} data-testid={testID} fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  );
};

export { ShieldIcon };
