import type { IconProps } from '../types';

export const FlagUsIcon = ({
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
      <defs>
        <clipPath id="lumen-us-clip">
          <rect width="28" height="20" rx="3" />
        </clipPath>
      </defs>
      <g clipPath="url(#lumen-us-clip)">
        <rect width="28" height="20" fill="#B22234" />
        <path
          d="M0 1.54h28v1.54H0zM0 4.62h28v1.54H0zM0 7.7h28v1.54H0zM0 10.77h28v1.54H0zM0 13.85h28v1.54H0zM0 16.92h28v1.54H0z"
          fill="#FFFFFF"
        />
        <rect width="11.2" height="10.77" fill="#3C3B6E" />
        <circle cx="2.8" cy="2.7" r="0.7" fill="#FFFFFF" />
        <circle cx="5.6" cy="2.7" r="0.7" fill="#FFFFFF" />
        <circle cx="8.4" cy="2.7" r="0.7" fill="#FFFFFF" />
        <circle cx="4.2" cy="5.4" r="0.7" fill="#FFFFFF" />
        <circle cx="7.0" cy="5.4" r="0.7" fill="#FFFFFF" />
        <circle cx="2.8" cy="8.1" r="0.7" fill="#FFFFFF" />
        <circle cx="5.6" cy="8.1" r="0.7" fill="#FFFFFF" />
        <circle cx="8.4" cy="8.1" r="0.7" fill="#FFFFFF" />
      </g>
    </svg>
  );
};
