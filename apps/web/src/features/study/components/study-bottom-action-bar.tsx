'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useEffect } from 'react';

import { Icons } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';
import { cn } from '@lumen/uikit/utils';

interface StudyBottomActionBarProps {
  isTopicSelected?: boolean;
  onLearnNew: () => void;
  onPractice: () => void;
  onFlashcard: () => void;
}

let lastActionBarTimestamp = 0;

export function StudyBottomActionBar({
  onLearnNew,
  onPractice,
  onFlashcard,
}: StudyBottomActionBarProps) {
  const t = useTranslations('Vocabulary.Study');

  const shouldAnimate = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const now = Date.now();
    const isRecent = now - lastActionBarTimestamp < 600;
    lastActionBarTimestamp = now;
    return !isRecent;
  }, []);

  useEffect(() => {
    lastActionBarTimestamp = Date.now();
    return () => {
      lastActionBarTimestamp = Date.now();
    };
  }, []);

  return (
    <div
      className={cn(
        'fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-card/95 backdrop-blur-xl border border-border/80 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 max-w-fit',
        shouldAnimate && 'animate-in slide-in-from-bottom duration-200',
      )}
    >
      {/* Button 1: Learn New */}
      <Button variant="default" size="sm" onClick={onLearnNew}>
        <Icons name="sparkles" className="w-3.5 h-3.5" />
        <span>{t('learnNew')}</span>
      </Button>

      {/* Button 2: Practice */}
      <Button variant="secondary" size="sm" onClick={onPractice}>
        <Icons name="droplet" className="w-3.5 h-3.5" />
        <span>{t('practice')}</span>
      </Button>

      {/* Button 3: Flashcards */}
      <Button variant="secondary" size="sm" onClick={onFlashcard}>
        <Icons name="book-open" className="w-3.5 h-3.5" />
        <span>{t('flashcards')}</span>
      </Button>
    </div>
  );
}
