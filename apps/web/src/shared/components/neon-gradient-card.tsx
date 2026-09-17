'use client';

import React, { CSSProperties, ReactNode } from 'react';
import { useMeasure } from '@lumen/hooks';
import { cn } from '@lumen/uikit/utils';

interface NeonColorsProps {
  firstColor: string;
  secondColor: string;
}

interface NeonGradientCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: ReactNode;
  borderSize?: number;
  borderRadius?: number;
  neonColors?: NeonColorsProps;
}

export const NeonGradientCard: React.FC<NeonGradientCardProps> = ({
  className,
  children,
  borderSize = 2,
  borderRadius = 20,
  neonColors = {
    firstColor: '#3b82f6',
    secondColor: '#06b6d4',
  },
  ...props
}) => {
  const [containerRef, dimensions] = useMeasure<HTMLDivElement>();
  const width = dimensions.width || 0;
  const height = dimensions.height || 0;

  return (
    <div
      ref={containerRef}
      style={
        {
          '--border-size': `${borderSize}px`,
          '--border-radius': `${borderRadius}px`,
          '--neon-first-color': neonColors.firstColor,
          '--neon-second-color': neonColors.secondColor,
          '--card-width': `${width}px`,
          '--card-height': `${height}px`,
          '--card-content-radius': `${borderRadius - borderSize}px`,
          '--pseudo-element-background-image': `linear-gradient(0deg, ${neonColors.firstColor}, ${neonColors.secondColor})`,
          '--pseudo-element-width': `${width + borderSize * 2}px`,
          '--pseudo-element-height': `${height + borderSize * 2}px`,
          '--after-blur': `${width / 3}px`,
        } as CSSProperties
      }
      className={cn(
        'relative z-10 size-full rounded-[var(--border-radius)]',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'relative size-full min-h-[inherit] rounded-[var(--card-content-radius)] bg-card p-6',
          'before:absolute before:-top-[var(--border-size)] before:-left-[var(--border-size)] before:-z-10 before:block',
          'before:h-[var(--pseudo-element-height)] before:w-[var(--pseudo-element-width)] before:rounded-[var(--border-radius)] before:content-[""]',
          'before:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))] before:bg-[size:100%_200%]',
          'before:animate-pulse',
          'after:absolute after:-top-[var(--border-size)] after:-left-[var(--border-size)] after:-z-10 after:block',
          'after:h-[var(--pseudo-element-height)] after:w-[var(--pseudo-element-width)] after:rounded-[var(--border-radius)] after:blur-[var(--after-blur)] after:content-[""]',
          'after:bg-[linear-gradient(0deg,var(--neon-first-color),var(--neon-second-color))] after:bg-[size:100%_200%] after:opacity-50',
          'after:animate-pulse',
          'wrap-break-word',
        )}
      >
        {children}
      </div>
    </div>
  );
};
