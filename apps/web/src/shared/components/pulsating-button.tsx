'use client';

import React, { useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { cn } from '@lumen/uikit/utils';

interface PulsatingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
  distance?: string;
  variant?: 'pulse' | 'ripple';
}

export const PulsatingButton = React.forwardRef<
  HTMLButtonElement,
  PulsatingButtonProps
>(
  (
    {
      className,
      children,
      pulseColor = 'rgba(59, 130, 246, 0.4)',
      duration = '2s',
      distance = '8px',
      variant = 'pulse',
      ...props
    },
    ref,
  ) => {
    const innerRef = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => innerRef.current!);

    useLayoutEffect(() => {
      const button = innerRef.current;
      if (!button) return;

      if (pulseColor) {
        button.style.setProperty('--pulse-color', pulseColor);
      }
    }, [pulseColor]);

    return (
      <button
        ref={innerRef}
        className={cn(
          'bg-primary text-primary-foreground relative flex cursor-pointer items-center justify-center rounded-full px-8 py-3.5 text-center font-semibold transition-all hover:opacity-95 shadow-lg',
          className,
        )}
        style={
          {
            '--pulse-color': pulseColor,
            '--duration': duration,
            '--distance': distance,
          } as React.CSSProperties
        }
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 rounded-[inherit] bg-primary opacity-40 animate-ping',
            variant === 'pulse' ? 'animate-ping' : 'animate-pulse',
          )}
        />
      </button>
    );
  },
);

PulsatingButton.displayName = 'PulsatingButton';
