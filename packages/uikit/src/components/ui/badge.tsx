import { cn } from '@lumen/uikit/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

const badgeVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-1 rounded-md text-xs font-bold tracking-tight whitespace-nowrap transition-colors select-none ring-offset-background',
  {
    variants: {
      variant: {
        default: 'bg-primary/10 text-primary',
        secondary: 'bg-muted/70 text-muted-foreground',
        subtle: 'bg-muted/40 text-foreground',
        outline: 'border border-border bg-card text-foreground',
        solid: 'bg-primary text-primary-foreground shadow-2xs',
        success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        destructive: 'bg-destructive/10 text-destructive',
        info: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
      },
      size: {
        default: 'px-2.5 py-0.5 text-xs',
        sm: 'px-2 py-0.5 text-[10.5px]',
        lg: 'px-3.5 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
