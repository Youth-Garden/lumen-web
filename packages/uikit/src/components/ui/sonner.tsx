'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import { Icons } from '@lumen/uikit/icons';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      icons={{
        success: <Icons name="check" className="size-4" />,
        info: <Icons name="info" className="size-4" />,
        warning: <Icons name="danger" className="size-4" />,
        error: <Icons name="close" className="size-4" />,
        loading: <Icons name="more" className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground border border-border shadow-xl shadow-black/5 rounded-xl p-4',
          title: 'font-semibold text-base',
          description: 'group-[.toast]:text-muted-foreground text-sm mt-1',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground rounded-md px-3 py-1.5 text-sm font-medium',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground rounded-md px-3 py-1.5 text-sm font-medium',
          icon: 'group-data-[type=error]:text-destructive group-data-[type=success]:text-emerald-500 group-data-[type=warning]:text-amber-500 group-data-[type=info]:text-blue-500 mt-0.5',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
