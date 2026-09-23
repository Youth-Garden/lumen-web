'use client';

import * as React from 'react';

import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import { IconButton } from './button';

interface SheetContextValue {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDismiss?: () => void;
}

const SheetContext = React.createContext<SheetContextValue | null>(null);

function Sheet({
  children,
  open,
  onOpenChange,
}: {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const handleDismiss = React.useCallback(() => {
    onOpenChange?.(false);
  }, [onOpenChange]);

  const value = React.useMemo(
    () => ({ open, onOpenChange, onDismiss: handleDismiss }),
    [open, onOpenChange, handleDismiss],
  );

  return (
    <SheetContext.Provider value={value}>{children}</SheetContext.Provider>
  );
}

interface TriggerProps extends React.ComponentProps<'button'> {
  render?: React.ReactElement;
}

function SheetTrigger({ children, onClick, render, ...props }: TriggerProps) {
  if (render && React.isValidElement(render)) {
    return React.cloneElement(render as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        (render.props as any).onClick?.(e);
        onClick?.(e);
      },
      children: (render.props as any).children ?? children,
    });
  }

  return (
    <button
      type="button"
      data-slot="sheet-trigger"
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

function SheetClose({
  children,
  onClick,
  render,
  className,
  ...props
}: TriggerProps) {
  const context = React.useContext(SheetContext);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    context?.onDismiss?.();
  };

  if (render && React.isValidElement(render)) {
    return React.cloneElement(render as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        (render.props as any).onClick?.(e);
        handleClick(e);
      },
      children: (render.props as any).children ?? children,
    });
  }

  if (children) {
    return (
      <button
        type="button"
        data-slot="sheet-close"
        onClick={handleClick}
        className={className}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <IconButton
      type="button"
      data-slot="sheet-close"
      className={cn('shrink-0', className)}
      onClick={handleClick}
      {...props}
    >
      <Icons name="close" className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </IconButton>
  );
}

interface SheetContentProps extends React.ComponentProps<'div'> {
  side?: 'top' | 'right' | 'bottom' | 'left';
  showCloseButton?: boolean;
  centered?: boolean;
  onDismiss?: () => void;
}

function SheetContent({
  className,
  children,
  side = 'right',
  showCloseButton = true,
  centered = false,
  onDismiss,
  ...props
}: SheetContentProps) {
  const context = React.useContext(SheetContext);
  const handleClose = onDismiss ?? context?.onDismiss;

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-slot="sheet-content"
      data-side={side}
      data-state="open"
      className={cn(
        'fixed flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground duration-200 ease-out outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        'data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:data-[state=open]:slide-in-from-bottom data-[side=bottom]:data-[state=closed]:slide-out-to-bottom',
        'data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:data-[state=open]:slide-in-from-left data-[side=left]:data-[state=closed]:slide-out-to-left data-[side=left]:sm:max-w-sm',
        'data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:data-[state=open]:slide-in-from-right data-[side=right]:data-[state=closed]:slide-out-to-right data-[side=right]:sm:max-w-sm',
        'data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:data-[state=open]:slide-in-from-top data-[side=top]:data-[state=closed]:slide-out-to-top',
        centered &&
          side === 'bottom' &&
          'sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-lg sm:rounded-3xl sm:border sm:border-border/60 sm:data-[side=bottom]:data-[state=open]:slide-in-from-bottom-0 sm:data-[side=bottom]:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=open]:zoom-in-95 sm:data-[state=closed]:zoom-out-95',
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <IconButton className="absolute top-3 right-3" onClick={handleClose}>
          <Icons name="close" />
          <span className="sr-only">Close</span>
        </IconButton>
      )}
    </div>
  );
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn('flex flex-col gap-0.5 p-4', className)}
      {...props}
    />
  );
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  );
}

function SheetTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2
      data-slot="sheet-title"
      className={cn(
        'font-heading text-base font-medium text-foreground',
        className,
      )}
      {...props}
    />
  );
}

function SheetDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="sheet-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
};
