'use client';

import { cn } from '@lumen/uikit/utils';
import React from 'react';
import { ResponsiveContainer } from 'recharts';

export type ChartContainerProps = React.ComponentProps<
  typeof ResponsiveContainer
>;

export function ChartContainer({
  width = '100%',
  height = '100%',
  className,
  children,
  ...props
}: ChartContainerProps) {
  return (
    <ResponsiveContainer
      width={width}
      height={height}
      className={cn('overflow-visible relative z-10', className)}
      {...props}
    >
      {children}
    </ResponsiveContainer>
  );
}
