import React from 'react';
import type { IconProps } from '../types';

export interface SidebarToggleIconProps extends IconProps {
  direction?: 'open' | 'close';
}

export const SidebarToggleIcon: React.FC<SidebarToggleIconProps> = ({
  size = 24,
  style,
  testID,
  className,
  color = 'currentColor',
  strokeWidth = 2,
  direction = 'open',
  ...props
}) => {
  const isClose = direction === 'close';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={style}
      className={className}
      data-testid={testID}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M21.97 15V9C21.97 4 19.97 2 14.97 2H8.96997C3.96997 2 1.96997 4 1.96997 9V15C1.96997 20 3.96997 22 8.96997 22H14.97C19.97 22 21.97 20 21.97 15Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.97 2V22"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {isClose ? (
        <path
          d="M10.53 9.43945L7.96997 11.9995L10.53 14.5595"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M7.96997 9.43945L10.53 11.9995L7.96997 14.5595"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
};

export const SidebarOpenIcon: React.FC<IconProps> = ({
  direction: _dir,
  ...props
}) => <SidebarToggleIcon direction="open" {...props} />;

export const SidebarCloseIcon: React.FC<IconProps> = ({
  direction: _dir,
  ...props
}) => <SidebarToggleIcon direction="close" {...props} />;
