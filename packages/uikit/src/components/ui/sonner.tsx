'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { Icons } from '@lumen/uikit/icons';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      position="top-right"
      gap={6}
      icons={{
        success: <Icons name="check" className="h-4 w-4 text-emerald-500 shrink-0" />,
        info: <Icons name="info" className="h-4 w-4 text-primary shrink-0" />,
        warning: <Icons name="alert-triangle" className="h-4 w-4 text-amber-500 shrink-0" />,
        error: <Icons name="close" className="h-4 w-4 text-destructive shrink-0" />,
        loading: <Icons name="loader-2" className="h-4 w-4 text-muted-foreground animate-spin shrink-0" />,
      }}
      toastOptions={{
        style: {
          background: 'var(--card)',
          color: 'var(--card-foreground)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '10px 14px',
          fontSize: '13px',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.08)',
        },
        classNames: {
          toast: 'group toast !min-h-0 !w-auto !max-w-md font-sans border-border/80 shadow-md',
          title: 'font-medium text-xs text-foreground tracking-tight',
          description: 'text-muted-foreground text-[11px] leading-snug',
          actionButton: '!bg-primary !text-primary-foreground rounded-md !px-2.5 !py-1 !text-xs',
          cancelButton: '!bg-muted !text-muted-foreground rounded-md !px-2.5 !py-1 !text-xs',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
