import type { IconProps } from '../types';

export const MenuIcon = ({
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
    <path d="M4 6h16" />
    <path d="M4 12h16" />
    <path d="M4 18h16" />
  </svg>
);
