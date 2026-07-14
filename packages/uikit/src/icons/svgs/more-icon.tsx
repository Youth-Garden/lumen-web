import type { IconProps } from '../types';

const MoreIcon = ({
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
      <path
        d="M5 14.75c-1.52 0-2.75-1.23-2.75-2.75S3.48 9.25 5 9.25 7.75 10.48 7.75 12 6.52 14.75 5 14.75Zm0-4a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5ZM19 14.75c-1.52 0-2.75-1.23-2.75-2.75S17.48 9.25 19 9.25s2.75 1.23 2.75 2.75-1.23 2.75-2.75 2.75Zm0-4a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5ZM12 14.75c-1.52 0-2.75-1.23-2.75-2.75S10.48 9.25 12 9.25s2.75 1.23 2.75 2.75-1.23 2.75-2.75 2.75Zm0-4a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"
        fill="currentColor"
      ></path>
    </svg>
  );
};

export { MoreIcon };
