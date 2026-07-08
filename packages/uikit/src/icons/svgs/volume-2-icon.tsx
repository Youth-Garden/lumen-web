import React from 'react';
import type { IconProps } from '../types';

const Volume2Icon = ({
  size = 24,
  color = 'currentColor',
  viewBox = '0 0 24 24',
  style,
  testID,
  ...props
}: IconProps) => {
  return (
    <svg width={size} height={size} viewBox={viewBox} color={color} style={style} data-testid={testID} fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
    </svg>
  );
};

export { Volume2Icon };
