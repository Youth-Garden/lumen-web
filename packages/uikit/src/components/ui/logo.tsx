import { Icons } from '../../icons';
import { cn } from '../../utils';
import { forwardRef } from 'react';

export interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  showText?: boolean;
  iconSize?: number;
  textClassName?: string;
  iconClassName?: string;
}

export const Logo = forwardRef<HTMLDivElement, LogoProps>(
  (
    {
      className,
      showText = true,
      iconSize = 32,
      textClassName,
      iconClassName,
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
          src="/logo.png"
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
