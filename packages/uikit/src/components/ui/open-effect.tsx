import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@lumen/uikit/utils';

const openEffectVariants = cva('animate-in fade-in fill-mode-both', {
  variants: {
    variant: {
      grow: 'zoom-in-95',
      shrink: 'zoom-in-105',
      'slide-up': 'slide-in-from-bottom-6',
      'slide-down': 'slide-in-from-top-6',
      'slide-left': 'slide-in-from-right-6',
      'slide-right': 'slide-in-from-left-6',
      fade: '',
    },
    duration: {
      fast: 'duration-200',
      normal: 'duration-500',
      slow: 'duration-700',
      xslow: 'duration-1000',
    },
    delay: {
      none: 'delay-0',
      short: 'delay-100',
      medium: 'delay-300',
      long: 'delay-500',
    },
  },
  defaultVariants: {
    variant: 'grow',
    duration: 'normal',
    delay: 'none',
  },
});

export interface OpenEffectProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof openEffectVariants> {}

export function OpenEffect({
  className,
  variant,
  duration,
  delay,
  children,
  ...props
}: OpenEffectProps) {
  return (
    <div
      className={cn(
        openEffectVariants({ variant, duration, delay }),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
