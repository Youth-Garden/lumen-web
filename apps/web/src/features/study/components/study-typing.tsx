'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';
import { MasteryFlowerBadge } from '@/features/vocabulary/components/mastery/mastery-flower-badge';
import type { StudyQueueItem } from '@/features/study/types/study.types';

interface StudyTypingProps {
  item: StudyQueueItem;
  masteryLevel: number;
  learningStep?: number;
  onSubmitAnswer: (input: string) => void;
  onOpenMastery: () => void;
}

export function StudyTyping({
  item,
  masteryLevel,
  learningStep = 0,
  onSubmitAnswer,
  onOpenMastery,
}: StudyTypingProps) {
  const t = useTranslations('Vocabulary.Study');
  const [value, setValue] = useState('');
  const [hintCount, setHintCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const targetTerm = item.card.term.trim();

  useEffect(() => {
    setValue('');
    setHintCount(0);
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [item.id]);

  const handleApplyHint = () => {
    if (hintCount < targetTerm.length) {
      const nextCount = hintCount + 1;
      setHintCount(nextCount);
      setValue(targetTerm.slice(0, nextCount));
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (value.trim()) {
        onSubmitAnswer(value.trim());
      }
    } else if (event.key === 'Shift' && !event.repeat) {
      handleApplyHint();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center animate-in fade-in-50 duration-200">
      <div className="w-full flex items-center justify-between mb-8 px-1">
        <div className="space-y-1">
          {item.isReviewingFailed && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 dark:text-amber-400">
              <Icons
                name="zap"
                className="w-3.5 h-3.5 text-amber-500 fill-current"
              />
              <span>{t('frequentlyMissedTag')}</span>
            </div>
          )}
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            {t('typeWord')}
          </h2>
        </div>

        <MasteryFlowerBadge
          level={masteryLevel}
          learningStep={learningStep}
          onClick={onOpenMastery}
        />
      </div>

      <div className="my-6 text-center space-y-1.5 max-w-md px-4">
        {item.partOfSpeechPrompt && (
          <span className="italic text-sm text-muted-foreground mr-1.5">
            ({item.partOfSpeechPrompt})
          </span>
        )}
        <span className="text-xl sm:text-2xl font-black text-foreground leading-snug">
          {item.meaningPrompt}
        </span>
      </div>

      <div className="w-full max-w-md mt-4 space-y-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('typePlaceholder')}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            className="w-full h-14 px-5 rounded-2xl bg-card border border-border/70 text-foreground font-bold text-lg sm:text-xl shadow-xs focus:outline-none focus:border-primary transition-all text-center tracking-wide"
          />
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="default"
            type="button"
            onClick={handleApplyHint}
            className="gap-2 font-bold cursor-pointer"
          >
            <Icons name="lightbulb" className="w-4 h-4 text-amber-500" />
            <span>
              {t('hintAction', {
                count: (targetTerm.length - hintCount).toString(),
              })}
            </span>
          </Button>

          <Button
            variant="default"
            size="default"
            type="button"
            onClick={() => value.trim() && onSubmitAnswer(value.trim())}
            disabled={!value.trim()}
            className="gap-2 font-bold cursor-pointer"
          >
            <span>{t('checkAction')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
