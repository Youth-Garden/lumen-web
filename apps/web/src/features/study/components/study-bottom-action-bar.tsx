'use client';

import { useTranslations } from 'next-intl';

import { Icons } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';

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
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-card/95 backdrop-blur-xl border border-border/80 px-4 py-2.5 rounded-full shadow-2xl animate-in slide-in-from-bottom duration-200 flex items-center gap-2.5 max-w-fit">
      {/* Button 1: Learn New */}
      <Button variant="default" size="sm" onClick={onLearnNew}>
        <Icons name="sparkles" className="w-3.5 h-3.5" />
        <span>{t('learnNew')}</span>
      </Button>

      {/* Button 2: Practice */}
      <Button variant="outline" size="sm" onClick={onPractice}>
        <Icons name="droplet" className="w-3.5 h-3.5 text-primary" />
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
