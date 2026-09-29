'use client';

import { Command as CommandPrimitive } from 'cmdk';
import { motion } from 'framer-motion';
import * as React from 'react';

import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import { Dialog } from './dialog';

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps extends React.ComponentPropsWithoutRef<
  typeof Dialog
> {
  children: React.ReactNode;
}

const CommandDialog = ({
  children,
  open,
  onOpenChange,
  ...props
}: CommandDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} {...props}>
      <div
        role="dialog"
        aria-modal="true"
        data-slot="dialog-content"
        data-state="open"
        className={cn(
          'fixed top-1/2 left-1/2 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover text-sm text-popover-foreground ring-1 ring-foreground/10 duration-300 outline-none sm:max-w-xl pointer-events-auto data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 overflow-hidden shadow-2xl transition-[height,max-height,transform,opacity] duration-300 ease-out',
        )}
      >
        <Command
          shouldFilter={false}
          className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
        >
          {children}
        </Command>
      </div>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className="flex items-center border-b border-border/60 px-3"
    cmdk-input-wrapper=""
  >
    <Icons name="search" className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, children, ...props }, ref) => {
  const innerRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | 'auto'>('auto');

  React.useEffect(() => {
    if (!innerRef.current) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setHeight(entry.contentRect.height);
      }
    });
    observer.observe(innerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      animate={{ height }}
      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
      className="overflow-hidden"
    >
      <div ref={innerRef}>
        <CommandPrimitive.List
          ref={ref}
          className={cn(
            'max-h-[min(80vh,600px)] overflow-y-auto overflow-x-hidden',
            className,
          )}
          {...props}
        >
          {children}
        </CommandPrimitive.List>
      </div>
    </motion.div>
  );
});

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm text-muted-foreground"
    {...props}
  />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
      className,
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn('-mx-1 h-px bg-border/60', className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

export interface CommandItemProps extends React.ComponentPropsWithoutRef<
  typeof CommandPrimitive.Item
> {
  variant?: 'default' | 'destructive';
}

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  CommandItemProps
>(({ className, variant = 'default', ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      'relative flex cursor-pointer gap-2 select-none items-center rounded-xl px-3 py-2.5 text-sm outline-none transition-colors data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
      variant === 'destructive'
        ? 'text-destructive font-medium data-[selected=true]:bg-destructive/10 data-[selected=true]:text-destructive'
        : 'text-foreground data-[selected=true]:bg-muted/70 data-[selected=true]:text-foreground',
      className,
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        'ml-auto text-xs tracking-widest text-muted-foreground',
        className,
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = 'CommandShortcut';

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
