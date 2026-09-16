'use client';

import { cn } from '@lumen/uikit/utils';
import React from 'react';
import { ResponsiveContainer } from 'recharts';

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: React.ComponentProps<typeof ResponsiveContainer>['width'];
  height?: React.ComponentProps<typeof ResponsiveContainer>['height'];
  minHeight?: string | number;
  aspect?: number;
  children: React.ReactElement;
}

export function ChartContainer({
  width = '100%',
  height = '100%',
  minHeight,
  aspect,
  className,
  style,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <div
      className={cn('relative w-full overflow-visible z-10', className)}
      style={{ minHeight, ...style }}
      {...props}
    >
      <ResponsiveContainer
        width={width}
        height={height}
        aspect={aspect}
        className="overflow-visible relative z-10"
      >
        {children}
      </ResponsiveContainer>
    </div>
  );
}
