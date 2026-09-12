'use client';

import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';
import { MasteryFlowerBadge } from '@/features/vocabulary/components/mastery/mastery-flower-badge';
import type { StudyQueueItem } from '@/features/study/types/study.types';

interface StudyChoiceTermProps {
  item: StudyQueueItem;
  masteryLevel: number;
  learningStep?: number;
  selectedIndex: number | null;
  onSelectOption: (index: number) => void;
  onOpenMastery: () => void;
}

export function StudyChoiceTerm({
  item,
  masteryLevel,
  learningStep = 0,
  selectedIndex,
  onSelectOption,
  onOpenMastery,
}: StudyChoiceTermProps) {
  const t = useTranslations('Vocabulary.Study');
  const options = item.options || [];

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center animate-in fade-in-50 duration-200">
      <div className="w-full flex items-center justify-between mb-8 px-1">
        <div className="space-y-1">
          {item.isReviewingFailed && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 dark:text-amber-400">
              <Icons name="refresh-cw" className="w-3.5 h-3.5" />
              <span>{t('previousMistake')}</span>
            </div>
          )}
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            {t('chooseTerm')}
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

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;

          return (
            <button
              key={option.id + '_' + index}
              type="button"
              onClick={() => onSelectOption(index)}
              className={
                'relative flex flex-col justify-between p-5 rounded-2xl text-left transition-colors cursor-pointer min-h-[100px] sm:min-h-[110px] select-none ' +
                (isSelected
                  ? 'bg-primary/15 text-primary'
                  : 'bg-card hover:bg-muted/70 active:scale-[0.99]')
              }
            >
              <span className="text-base sm:text-lg font-bold text-foreground">
                {option.label}
              </span>

              <span className="text-[11px] font-semibold text-muted-foreground mt-3">
                {t('pressKeyHint', { key: (index + 1).toString() })}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
