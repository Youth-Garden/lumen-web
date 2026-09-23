import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@lumen/uikit/utils';

const buttonVariants = cva(
  'group/button !cursor-pointer inline-flex shrink-0 items-center justify-center rounded-2xl bg-clip-padding text-sm font-medium tracking-tight whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 active:not-aria-[haspopup]:scale-[0.985] disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-b from-primary to-[color-mix(in_oklch,var(--primary),#000_7%)] text-primary-foreground shadow-xs shadow-primary/25 border border-primary/20 hover:shadow-md hover:shadow-primary/30 hover:brightness-105 active:brightness-95',
        outline:
          'border border-border bg-card text-foreground shadow-2xs hover:bg-muted/40 hover:border-border/90 active:bg-muted/60 active:shadow-none aria-expanded:bg-muted aria-expanded:text-foreground dark:border-border dark:bg-card/60 dark:hover:bg-muted/40 dark:hover:border-border/80',
        secondary:
          'bg-muted/70 text-foreground hover:bg-muted active:bg-muted/90 aria-expanded:bg-muted aria-expanded:text-foreground',
        ghost:
          'hover:bg-muted/80 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50',
        destructive:
          'bg-gradient-to-b from-[#ff529e] to-[#e62678] text-white shadow-xs shadow-[#ff4395]/30 hover:shadow-md hover:shadow-[#ff4395]/40 hover:brightness-105 active:brightness-95 focus-visible:ring-destructive/40',
        text: 'bg-transparent text-muted-foreground',
      },
      size: {
        default:
          'h-10 gap-2 px-4 py-2 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        xs: "h-7 gap-1 px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-9 gap-1.5 px-3 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: 'h-11.5 gap-2.5 px-6 text-sm font-semibold shadow-xs has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5',
        icon: 'size-7 rounded-full in-data-[slot=button-group]:rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  variant = 'default',
  size = 'default',
  className,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export type IconButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants>;

function IconButton({
  variant = 'ghost',
  size = 'icon',
  className,
  ...props
}: IconButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="icon-button"
      className={cn(
        buttonVariants({ variant, size }),
        'text-muted-foreground hover:text-foreground',
        className,
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants, IconButton };
