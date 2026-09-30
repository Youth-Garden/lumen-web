'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';

interface StudyBottomActionBarProps {
  isTopicSelected?: boolean;
  onLearnNew: () => void;
  onPractice: () => void;
  onFlashcard: () => void;
}

export function StudyBottomActionBar({
  onLearnNew,
  onPractice,
  onFlashcard,
}: StudyBottomActionBarProps) {
  const t = useTranslations('Vocabulary.Study');

  return (
    <div
      className={cn(
        'fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-card/95 backdrop-blur-xl px-2.5 py-2 rounded-3xl shadow-2xl flex items-center gap-2.5 min-w-[50vw]',
      )}
    >
      {/* Button 1: Learn New */}
      <Button
        variant="default"
        size="sm"
        onClick={onLearnNew}
        className="w-full flex-1"
      >
        <Icons name="sparkles" className="w-3.5 h-3.5" />
        <span>{t('learnNew')}</span>
      </Button>

      {/* Button 2: Practice */}
      <Button
        variant="secondary"
        size="sm"
        onClick={onPractice}
        className="w-full flex-1"
      >
        <Icons name="droplet" className="w-3.5 h-3.5" />
        <span>{t('practice')}</span>
      </Button>

      {/* Button 3: Flashcards */}
      <Button
        variant="secondary"
        size="sm"
        onClick={onFlashcard}
        className="w-full flex-1"
      >
        <Icons name="book-open" className="w-3.5 h-3.5" />
        <span>{t('flashcards')}</span>
      </Button>
    </div>
  );
}
