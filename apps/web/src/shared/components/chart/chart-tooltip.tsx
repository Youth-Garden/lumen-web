'use client';

import { cn } from '@lumen/uikit/utils';
import React from 'react';
import { Tooltip } from 'recharts';

export interface ChartTooltipCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ChartTooltipCard({
  className,
  children,
  ...props
}: ChartTooltipCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border-none bg-popover/95 backdrop-blur-md p-3 shadow-lg shadow-black/5 dark:shadow-black/30 text-popover-foreground text-xs min-w-[130px] space-y-1.5 transition-all duration-150 ease-out origin-bottom pointer-events-none',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface ChartTooltipTitleProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function ChartTooltipTitle({
  className,
  children,
  ...props
}: ChartTooltipTitleProps) {
  return (
    <p
      className={cn('text-[11px] font-bold text-muted-foreground', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export interface ChartTooltipRowProps {
  color?: string;
  indicator?: 'dot' | 'square' | 'line';
  label: React.ReactNode;
  value: React.ReactNode;
  subValue?: React.ReactNode;
  className?: string;
}

export function ChartTooltipRow({
  color,
  indicator = 'dot',
  label,
  value,
  subValue,
  className,
}: ChartTooltipRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 text-xs',
        className,
      )}
    >
      <div className="flex items-center gap-1.5 min-w-0">
        {color && (
          <span
            className={cn(
              'shrink-0',
              indicator === 'dot' && 'h-2 w-2 rounded-full',
              indicator === 'square' && 'h-2 w-2 rounded-xs',
              indicator === 'line' && 'h-0.5 w-3 rounded-full',
            )}
            style={{ backgroundColor: color }}
          />
        )}
        <span className="truncate text-muted-foreground text-[11px] font-medium">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <span className="font-bold text-foreground text-right">{value}</span>
        {subValue && (
          <span className="text-[11px] font-normal text-muted-foreground">
            {subValue}
          </span>
        )}
      </div>
    </div>
  );
}

export type ChartTooltipSeparatorProps = React.HTMLAttributes<HTMLDivElement>;

export function ChartTooltipSeparator({
  className,
  ...props
}: ChartTooltipSeparatorProps) {
  return (
    <div
      className={cn('h-px bg-muted/40 my-1', className)}
      {...props}
    />
  );
}

export interface ChartTooltipContentProps {
  active?: boolean;
  payload?: any[];
  label?: any;
  hideLabel?: boolean;
  indicator?: 'dot' | 'square' | 'line';
  labelFormatter?: (label: any, payload: any[]) => React.ReactNode;
  formatter?: (
    value: any,
    name: any,
    item: any,
    index: number,
    payload: any[],
  ) => React.ReactNode;
  extraContent?: (payload: any[]) => React.ReactNode;
  className?: string;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  hideLabel = false,
  indicator = 'dot',
  labelFormatter,
  formatter,
  extraContent,
  className,
}: ChartTooltipContentProps) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const titleNode = labelFormatter ? labelFormatter(label, payload) : label;

  return (
    <ChartTooltipCard className={className}>
      {!hideLabel && titleNode && (
        <ChartTooltipTitle>{titleNode}</ChartTooltipTitle>
      )}

      {payload.map((item: any, index: number) => {
        if (formatter) {
          const customFormatted = formatter(
            item.value,
            item.name,
            item,
            index,
            payload,
          );
          if (React.isValidElement(customFormatted)) {
            return (
              <React.Fragment key={item.dataKey || index}>
                {customFormatted}
              </React.Fragment>
            );
          }
          if (Array.isArray(customFormatted)) {
            const [val, lbl] = customFormatted;
            return (
              <ChartTooltipRow
                key={item.dataKey || index}
                color={item.color || item.fill || item.payload?.fill}
                indicator={indicator}
                label={lbl ?? item.name}
                value={val}
              />
            );
          }
        }

        const color = item.color || item.fill || item.payload?.fill;
        const name = item.name ?? item.dataKey;
        const value = item.value;

        return (
          <ChartTooltipRow
            key={item.dataKey || index}
            color={color}
            indicator={indicator}
            label={name}
            value={value}
          />
        );
      })}

      {extraContent?.(payload)}
    </ChartTooltipCard>
  );
}

export type ChartTooltipProps = React.ComponentProps<typeof Tooltip>;

export function ChartTooltip({
  cursor = { fill: 'var(--muted)', opacity: 0.15 },
  allowEscapeViewBox = { x: false, y: false },
  isAnimationActive = true,
  animationDuration = 150,
  animationEasing = 'ease-out',
  offset = 12,
  wrapperStyle,
  ...props
}: ChartTooltipProps) {
  return (
    <Tooltip
      cursor={cursor}
      offset={offset}
      allowEscapeViewBox={allowEscapeViewBox}
      isAnimationActive={isAnimationActive}
      animationDuration={animationDuration}
      animationEasing={animationEasing}
      wrapperStyle={{
        zIndex: 100,
        pointerEvents: 'none',
        outline: 'none',
        ...wrapperStyle,
      }}
      {...props}
    />
  );
}
