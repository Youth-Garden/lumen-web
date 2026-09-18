'use client';

import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';

import { cn } from '@lumen/uikit/utils';

function TooltipProvider({
  delay = 0,
  ...props
}: TooltipPrimitive.Provider.Props) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delay={delay}
      {...props}
    />
  );
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />;
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

export interface TooltipContentProps
  extends TooltipPrimitive.Popup.Props,
    Pick<
      TooltipPrimitive.Positioner.Props,
      'align' | 'alignOffset' | 'side' | 'sideOffset'
    > {
  variant?: 'default' | 'card';
  arrowClassName?: string;
}

function TooltipContent({
  className,
  side = 'top',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  variant = 'default',
  arrowClassName,
  children,
  ...props
}: TooltipContentProps) {
  const isCard = variant === 'card';

  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-50"
      >
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            'z-50 origin-(--transform-origin) transition-all duration-150 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
            !isCard &&
              'inline-flex w-fit max-w-xs items-center gap-1.5 rounded-lg bg-foreground px-2.5 py-1.5 text-xs text-background drop-shadow-md has-data-[slot=kbd]:pr-1.5 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm',
            isCard &&
              'flex w-fit flex-col rounded-2xl border-none bg-popover/95 backdrop-blur-md text-popover-foreground drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_12px_28px_rgba(0,0,0,0.5)]',
            className,
          )}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow
            className={cn(
              'z-50 size-2 rotate-45 rounded-[0.5px] pointer-events-none',
              'data-[side=top]:bottom-0 data-[side=top]:translate-y-1/2',
              'data-[side=bottom]:top-0 data-[side=bottom]:-translate-y-1/2',
              'data-[side=left]:right-0 data-[side=left]:translate-x-1/2',
              'data-[side=right]:left-0 data-[side=right]:-translate-x-1/2',
              !isCard && 'bg-foreground fill-foreground',
              isCard && 'size-2.5 bg-popover fill-popover',
              arrowClassName,
            )}
          />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
