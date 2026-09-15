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
        'inline-flex items-center rounded-full bg-muted/40 p-1 border border-border/40 backdrop-blur-xs select-none',
        size === 'sm' ? 'h-8' : 'h-10',
        className,
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={option.disabled}
            onClick={() => onValueChange(option.value)}
            className={cn(
              'relative inline-flex items-center justify-center gap-1.5 rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:pointer-events-none disabled:opacity-50',
              size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm',
              isActive
                ? 'text-primary-foreground font-semibold'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {isActive && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-full bg-primary shadow-xs"
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
        );
      })}
    </div>
  );
}
