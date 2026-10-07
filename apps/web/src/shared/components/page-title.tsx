import { cn } from '@lumen/uikit/utils';
import React from 'react';

export interface PageTitleProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  description?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  as?: 'h1' | 'h2' | 'h3';
}

export function PageTitle({
  title,
  subtitle,
  description,
  badge,
  actions,
  children,
  className,
  titleClassName,
  as: Component = 'h1',
}: PageTitleProps) {
  const descText = description || subtitle;

  return (
    <div
      className={cn(
        'flex flex-col md:flex-row md:items-center justify-between gap-4',
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
        <div>
          <div className="flex items-center gap-2.5">
            <Component
              className={cn(
                'text-2xl sm:text-3xl font-black font-heading tracking-tight text-foreground',
                titleClassName,
              )}
            >
              {title}
            </Component>
            {badge}
          </div>
          {descText && (
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              {descText}
            </p>
          )}
        </div>
        {children}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
}
