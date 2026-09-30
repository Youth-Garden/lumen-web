'use client';

import type { StudyQueueItem } from '@/features/study/types/study.types';
import { MasteryFlowerBadge } from '@/features/vocabulary/components/mastery/mastery-flower-badge';
import { useCounter, useSubmitLock } from '@lumen/hooks';
import { Badge, Button, IconButton, Input } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

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
  const targetTerm = item.card.term.trim();
  const maxHints = Math.floor(targetTerm.length / 2);
  const [hintCount, { increment: incrementHint, reset: resetHint }] =
    useCounter(0, { max: maxHints });
  const inputRef = useRef<HTMLInputElement>(null);

  const [submitLocked, { isLocked: isSubmitted, resetLock }] = useSubmitLock(
    (trimmed: string) => {
      onSubmitAnswer(trimmed);
    },
  );

  const remainingHints = Math.max(0, maxHints - hintCount);

  useEffect(() => {
    setValue('');
    resetLock();
    resetHint();
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [item.id, resetHint, resetLock]);

  const handleApplyHint = () => {
    if (remainingHints > 0 && !isSubmitted) {
      const nextCount = hintCount + 1;
      incrementHint();
      setValue(targetTerm.slice(0, nextCount));
      inputRef.current?.focus();
    }
  };

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (trimmed) {
      submitLocked(trimmed);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmit();
    } else if (event.key === 'Shift' && !event.repeat) {
      if (remainingHints > 0) {
        handleApplyHint();
      }
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center animate-in fade-in-50 duration-200">
      <div className="w-full flex items-center justify-between mb-8 px-1">
        <div className="space-y-1">
          {item.isReviewingFailed && (
            <Badge variant="warning" size="sm" className="gap-1.5 mb-1">
              <Icons name="refresh-cw" className="w-3.5 h-3.5" />
              <span>{t('frequentlyMissedTag')}</span>
            </Badge>
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
        <div className="relative group w-full">
          <Input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t('typePlaceholder')}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            className="w-full h-16 px-12 text-center font-bold text-2xl sm:text-3xl tracking-wide caret-primary bg-card text-foreground border-2 border-border rounded-2xl shadow-sm outline-none placeholder:font-medium placeholder:text-base sm:placeholder:text-lg placeholder:tracking-normal placeholder:text-muted-foreground/40 transition-all duration-200 hover:border-primary/40 hover:shadow-md focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/15 focus-visible:shadow-md"
          />

          {value.length > 0 && (
            <IconButton
              type="button"
              onClick={() => {
                setValue('');
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground/60 hover:text-foreground hover:bg-muted transition-colors"
            >
              <Icons name="x" className="w-4 h-4" />
            </IconButton>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          <Button
            variant="outline"
            size="lg"
            type="button"
            onClick={handleApplyHint}
            disabled={remainingHints === 0}
            className="w-full cursor-pointer"
          >
            <Icons name="lightbulb" className="text-amber-500 w-4 h-4" />
            <span>
              {t('hintAction', {
                count: remainingHints.toString(),
              })}
            </span>
          </Button>

          <Button
            variant="default"
            size="lg"
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitted || !value.trim()}
            className="w-full cursor-pointer"
          >
            <span>{t('checkAction')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
