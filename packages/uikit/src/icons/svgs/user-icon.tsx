import React from 'react';
import type { IconProps } from '../types';

const UserIcon = ({
  size = 24,
  color = 'currentColor',
  viewBox = '0 0 24 24',
  style,
  testID,
  ...props
}: IconProps) => {
  return (
    <svg width={size} height={size} viewBox={viewBox} color={color} style={style} data-testid={testID} fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
};

export { UserIcon };
