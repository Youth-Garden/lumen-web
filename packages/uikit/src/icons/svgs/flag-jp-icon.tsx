import type { IconProps } from '../types';

export const FlagJpIcon = ({
  size = 24,
  style,
  testID,
  className,
  ...props
}: IconProps) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 20"
      fill="none"
      style={style}
      className={className}
      data-testid={testID}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="28" height="20" rx="3" fill="#F8FAFC" />
      <circle cx="14" cy="10" r="5" fill="#BC002D" />
    </svg>
  );
};
