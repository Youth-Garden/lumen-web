import type { IconProps } from '../types';

const DeckIcon = ({
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
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="16" height="12" x="2" y="10" rx="2" />
      <path d="M6 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2" />
      <line x1="6" y1="14" x2="10" y2="14" />
      <line x1="6" y1="17" x2="14" y2="17" />
    </svg>
  );
};

export { DeckIcon };
