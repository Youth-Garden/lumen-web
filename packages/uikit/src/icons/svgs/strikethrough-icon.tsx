import type { IconProps } from '../types';

export const StrikethroughIcon = ({
  size = 24,
  color = 'currentColor',
  viewBox = '0 0 24 24',
  variant = 'linear',
  style,
  testID,
  ...props
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox={viewBox}
    color={color}
    style={style}
    data-testid={testID}
    fill={variant === 'bold' ? color : 'none'}
    xmlns="http://www.w3.org/2000/svg"
    stroke={variant === 'linear' ? color : 'none'}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 4H9a3 3 0 0 0-2.83 4" />
    <path d="M14 12a4 4 0 0 1 0 8H6" />
    <line x1="4" x2="20" y1="12" y2="12" />
  </svg>
);
