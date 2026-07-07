import React from 'react';
import type { IconProps } from '../types';

const HomeIcon = ({
  size = 24,
  color = 'currentColor',
  viewBox = '0 0 24 24',
  variant = 'linear',
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
      fill={variant === 'bold' ? color : 'none'}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.02 2.84001L3.63 7.04001C2.73 7.74001 2 9.23001 2 10.36V17.77C2 20.09 3.89 21.99 6.21 21.99H17.79C20.11 21.99 22 20.09 22 17.78V10.5C22 9.29001 21.19 7.74001 20.2 7.05001L14.02 2.72001C12.62 1.74001 10.37 1.79001 9.02 2.84001Z"
        stroke={variant === 'linear' ? color : 'none'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export { HomeIcon };
