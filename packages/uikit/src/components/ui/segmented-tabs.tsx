'use client';

import { cn } from '@lumen/uikit/utils';
import { motion } from 'framer-motion';
import React, { useId } from 'react';

export interface SegmentedTabOption<T extends string = string> {
  value: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedTabsProps<T extends string = string> {
  value: T;
  onValueChange: (value: T) => void;
  options: SegmentedTabOption<T>[];
  className?: string;
  size?: 'sm' | 'default';
  layoutId?: string;
}

export function SegmentedTabs<T extends string = string>({
  value,
  onValueChange,
  options,
  className,
  size = 'sm',
  layoutId: customLayoutId,
}: SegmentedTabsProps<T>) {
  const autoId = useId();
  const layoutId = customLayoutId || `segmented-tabs-indicator-${autoId}`;

  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex items-center rounded-2xl bg-muted/60 dark:bg-muted/30 p-1 select-none shadow-inner border border-border/30 dark:border-border/50',
        size === 'sm' ? 'h-8' : 'h-10',
        className,
      )}
    >
      {options.map((option, index) => {
        const isActive = option.value === value;
        const showDivider = index > 0;

        return (
          <React.Fragment key={option.value}>
            {showDivider && (
              <span className="h-3.5 w-px bg-border/80 dark:bg-border/60 shrink-0 self-center mx-1 sm:mx-1.5 opacity-75" />
            )}
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={option.disabled}
              onClick={() => onValueChange(option.value)}
              className={cn(
                'relative inline-flex items-center justify-center gap-1.5 rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50',
                size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm',
                isActive
                  ? 'text-primary-foreground font-semibold'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId={layoutId}
                  className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary to-[color-mix(in_oklch,var(--primary),#000_7%)] shadow-xs shadow-primary/25"
                  transition={{
                    type: 'spring',
                    stiffness: 450,
                    damping: 35,
                  }}
                />
              )}
              {option.icon && (
                <span className="relative z-10 shrink-0">{option.icon}</span>
              )}
              <span className="relative z-10 whitespace-nowrap">
                {option.label}
              </span>
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
