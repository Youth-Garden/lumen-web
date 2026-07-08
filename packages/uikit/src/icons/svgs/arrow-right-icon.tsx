import React from 'react';
import type { IconProps } from '../types';

const ArrowRightIcon = ({
  size = 24,
  color = 'currentColor',
  viewBox = '0 0 24 24',
  style,
  testID,
  ...props
}: IconProps) => {
  return (
    <svg width={size} height={size} viewBox={viewBox} color={color} style={style} data-testid={testID} fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
    </svg>
  );
};

export { ArrowRightIcon };
