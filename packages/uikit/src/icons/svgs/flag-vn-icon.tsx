import type { IconProps } from '../types';

export const FlagVnIcon = ({
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
      <rect width="28" height="20" rx="3" fill="#DA251D" />
      <polygon
        points="14,4.2 15.68,9.36 21.11,9.36 16.71,12.56 18.39,17.72 14,14.52 9.61,17.72 11.29,12.56 6.89,9.36 12.32,9.36"
        fill="#FFEB3B"
      />
    </svg>
  );
};
