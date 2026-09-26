import { forwardRef } from 'react';
import { cn } from '../../utils';

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  showText?: boolean;
  iconSize?: number;
  textClassName?: string;
  iconClassName?: string;
  src?: string;
}

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    {
      className,
      showText = true,
      iconSize = 32,
      textClassName,
      iconClassName,
      src = '/logo.png',
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2', className)}
        {...props}
      >
        <img
          src={src}
          alt="Lumen Logo"
          width={iconSize}
          height={iconSize}
          className={cn('rounded-md', iconClassName)}
        />
        {showText && (
          <span
            className={cn('font-bold text-xl tracking-tight', textClassName)}
          >
            Lumen
          </span>
        )}
      </div>
    );
  },
);

Logo.displayName = 'Logo';
