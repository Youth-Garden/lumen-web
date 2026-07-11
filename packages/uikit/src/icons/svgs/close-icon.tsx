import type { IconProps } from '../types';

const CloseIcon = ({
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
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export { CloseIcon };
