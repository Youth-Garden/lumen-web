import type { IconProps } from '../types';

export const PenToolIcon = ({
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
    <path d="m12 19 7-7 3 3-7 7-3-3z" />
    <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
    <path d="m2 2 7.586 7.586" />
    <circle cx="11" cy="11" r="2" />
  </svg>
);
