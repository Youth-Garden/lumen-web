'use client';

import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';
import * as React from 'react';
import { Button } from './button';

interface DialogContextValue {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDismiss?: () => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function Dialog({
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
    <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
  );
}

interface TriggerProps extends React.ComponentProps<'button'> {
  render?: React.ReactElement;
}

function DialogTrigger({ children, onClick, render, ...props }: TriggerProps) {
  if (render && React.isValidElement(render)) {
    return React.cloneElement(render as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => {
        (render.props as any).onClick?.(e);
        onClick?.(e);
      },
    });
  }

  return (
    <button
      type="button"
      data-slot="dialog-trigger"
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

function DialogClose({ children, onClick, render, ...props }: TriggerProps) {
  const context = React.useContext(DialogContext);

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
    });
  }

  return (
    <button
      type="button"
      data-slot="dialog-close"
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

interface DialogContentProps extends React.ComponentProps<'div'> {
  showCloseButton?: boolean;
  variant?: 'default' | 'fullscreen';
  onDismiss?: () => void;
}

function DialogContent({
  className,
  children,
  showCloseButton,
  variant = 'default',
  onDismiss,
  ...props
}: DialogContentProps) {
  const context = React.useContext(DialogContext);
  const handleClose = onDismiss ?? context?.onDismiss;
  const isFullscreen = variant === 'fullscreen';
  const shouldShowClose = showCloseButton ?? !isFullscreen;

  return (
    <div
      role="dialog"
      aria-modal="true"
      data-slot="dialog-content"
      data-state="open"
      className={cn(
        isFullscreen
          ? 'fixed inset-0 flex h-screen w-screen max-w-none flex-col justify-between overflow-hidden bg-popover p-0 select-none outline-none duration-200 pointer-events-auto data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0'
          : 'fixed top-1/2 left-1/2 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-3xl bg-popover p-6 text-sm text-foreground shadow-lg transition-all duration-200 outline-none sm:max-w-md pointer-events-auto data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        className,
      )}
      {...props}
    >
      {children}
      {shouldShowClose && (
        <Button
          variant="ghost"
          size="icon-sm"
          className="absolute top-3.5 right-3.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80"
          onClick={handleClose}
        >
          <Icons name="close" className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      )}
    </div>
  );
}

export interface DialogHeaderProps extends React.ComponentProps<'div'> {
  align?: 'left' | 'center';
}

function DialogHeader({
  className,
  align = 'left',
  ...props
}: DialogHeaderProps) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        'flex flex-col gap-1.5',
        align === 'center'
          ? 'text-center items-center justify-center'
          : 'text-left items-start',
        className,
      )}
      {...props}
    />
  );
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  onDismiss,
  ...props
}: React.ComponentProps<'div'> & {
  showCloseButton?: boolean;
  onDismiss?: () => void;
}) {
  const context = React.useContext(DialogContext);
  const handleClose = onDismiss ?? context?.onDismiss;

  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-3 pt-2',
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <Button variant="outline" onClick={handleClose}>
          Close
        </Button>
      )}
    </div>
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<'h2'>) {
  return (
    <h2
      data-slot="dialog-title"
      className={cn(
        'font-heading text-lg leading-tight font-semibold tracking-tight text-foreground',
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="dialog-description"
      className={cn(
        'text-sm text-muted-foreground leading-relaxed *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground',
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  type DialogContentProps,
};
