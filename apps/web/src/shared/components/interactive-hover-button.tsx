'use client';

import React from 'react';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';

export function InteractiveHoverButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        'group bg-background relative w-auto cursor-pointer overflow-hidden rounded-full border border-border/80 px-6 py-3.5 text-center font-semibold transition-all hover:border-primary/50 shadow-sm',
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        <div className="bg-primary h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[100]"></div>
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 text-foreground font-medium">
          {children}
        </span>
      </div>
      <div className="text-primary-foreground absolute top-0 left-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 font-medium">
        <span>{children}</span>
        <Icons name="arrow-right" className="h-4 w-4" />
      </div>
    </button>
  );
}
