'use client';

import { Button } from '@lumen/uikit/components';
import { cn } from '@lumen/uikit/utils';
import React from 'react';

export type StudyRatingSentiment = 'positive' | 'neutral' | 'negative';
export type StudyRatingFill = 'soft' | 'solid';

export interface StudyRatingButtonProps extends Omit<
  React.ComponentProps<typeof Button>,
  'variant'
> {
  sentiment: StudyRatingSentiment;
  fill?: StudyRatingFill;
  shortcut?: string;
}

const sentimentStyles: Record<
  StudyRatingSentiment,
  Record<StudyRatingFill, string>
> = {
  positive: {
    soft: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/30 active:bg-emerald-500/25',
    solid:
      'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white border border-emerald-600/30 shadow-xs shadow-emerald-500/25 hover:brightness-105 active:brightness-95',
  },
  neutral: {
    soft: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/30 active:bg-amber-500/25',
    solid:
      'bg-gradient-to-b from-amber-500 to-amber-600 text-white border border-amber-600/30 shadow-xs shadow-amber-500/25 hover:brightness-105 active:brightness-95',
  },
  negative: {
    soft: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/30 active:bg-rose-500/25',
    solid:
      'bg-gradient-to-b from-rose-500 to-rose-600 text-white border border-rose-600/30 shadow-xs shadow-rose-500/25 hover:brightness-105 active:brightness-95',
  },
};

export function StudyRatingButton({
  sentiment,
  fill = 'soft',
  shortcut,
  className,
  children,
  ...props
}: StudyRatingButtonProps) {
  const sentimentClass = sentimentStyles[sentiment][fill];

  return (
    <Button variant="none" className={cn(sentimentClass, className)} {...props}>
      {typeof children === 'string' ? <span>{children}</span> : children}
      {shortcut && (
        <span className="text-xs font-normal opacity-80 ml-1">
          - {shortcut}
        </span>
      )}
    </Button>
  );
}
