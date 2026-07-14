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
      gap={8}
      icons={{
        success: <Icons name="check" className="size-4" />,
        info: <Icons name="info" className="size-4" />,
        warning: <Icons name="danger" className="size-4" />,
        error: <Icons name="close" className="size-4" />,
        loading: <Icons name="more" className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast: [
            'group toast',
            '!bg-card !text-card-foreground',
            'border !border-border/60',
            'shadow-[0_8px_32px_-4px_rgba(0,0,0,0.18),0_2px_8px_-2px_rgba(0,0,0,0.10)]',
            'dark:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.45),0_2px_8px_-2px_rgba(0,0,0,0.25)]',
            '!rounded-xl',
            '!p-4',
            'backdrop-blur-none',
          ].join(' '),
          title: '!font-semibold !text-sm tracking-tight',
          description:
            '!text-muted-foreground !text-xs !mt-0.5 leading-relaxed',
          actionButton:
            '!bg-primary !text-primary-foreground rounded-lg !px-3 !py-1.5 !text-xs !font-semibold hover:!opacity-90 transition-opacity',
          cancelButton:
            '!bg-secondary !text-secondary-foreground rounded-lg !px-3 !py-1.5 !text-xs !font-medium hover:!bg-secondary/80 transition-colors',
          icon: [
            'group-data-[type=error]:!text-destructive',
            'group-data-[type=success]:!text-emerald-500',
            'group-data-[type=warning]:!text-amber-500',
            'group-data-[type=info]:!text-blue-500',
            'mt-0.5 shrink-0',
          ].join(' '),
          closeButton:
            '!bg-muted !border-border/50 !text-muted-foreground hover:!bg-accent hover:!text-accent-foreground !rounded-lg transition-colors',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
