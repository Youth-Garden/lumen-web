import type { IconProps } from '../types';

export const BoldIcon = ({
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

  <path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" />

  </svg>
);
