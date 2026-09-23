'use client';

import { WordDetailSheet } from '@/features/vocabulary/components/folder-detail/word-detail-sheet';
import type { VocabularyWord } from '@/services/vocabulary';
import { usePortal } from '@lumen/uikit/portal';
import { cn } from '@lumen/uikit/utils';
import * as React from 'react';

export interface WordDetailTriggerProps extends Omit<
  React.ComponentProps<'button'>,
  'onClick'
> {
  word: VocabularyWord;
  className?: string;
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function WordDetailTrigger({
  word,
  className,
  children,
  onClick,
  ...props
}: WordDetailTriggerProps) {
  const [presentWordDetail] = usePortal<VocabularyWord>(WordDetailSheet);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClick?.(event);
    presentWordDetail(word);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'inline-block underline decoration-dotted decoration-current/25 underline-offset-3 cursor-pointer select-text text-left',
        className,
      )}
      {...props}
    >
      {children || word.term}
    </button>
  );
}
