import type { IconProps } from '../types';

const ItalicIcon = ({
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
      <path d="M18.879 3.75h-9.26c-.41 0-.74-.34-.74-.75s.34-.75.75-.75h9.25c.41 0 .75.34.75.75s-.34.75-.75.75ZM14.381 21.75h-9.26c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h9.25c.41 0 .75.34.75.75s-.33.75-.74.75Z" fill="currentColor"></path><path d="M9.748 21.748c-.06 0-.12-.01-.18-.02-.4-.1-.65-.51-.55-.91l4.5-18a.75.75 0 1 1 1.46.36l-4.5 18c-.09.34-.39.57-.73.57Z" fill="currentColor"></path>
    </svg>
  );
};

export { ItalicIcon };
