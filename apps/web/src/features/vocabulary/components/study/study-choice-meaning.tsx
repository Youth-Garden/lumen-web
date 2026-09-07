'use client';

import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';
import { MasteryFlowerBadge } from '../mastery/mastery-flower-badge';
import type { StudyQueueItem } from './study.types';

interface StudyChoiceMeaningProps {
  item: StudyQueueItem;
  masteryLevel: number;
  learningStep?: number;
  selectedIndex: number | null;
  isPlayingAudio: boolean;
  onPlayAudio: () => void;
  onSelectOption: (index: number) => void;
  onOpenMastery: () => void;
}

export function StudyChoiceMeaning({
  item,
  masteryLevel,
  learningStep = 0,
  selectedIndex,
  isPlayingAudio,
  onPlayAudio,
  onSelectOption,
  onOpenMastery,
}: StudyChoiceMeaningProps) {
  const t = useTranslations('Vocabulary.Study');
  const options = item.options || [];

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center animate-in fade-in-50 duration-200">
      <div className="w-full flex items-center justify-between mb-6 px-1">
        <div className="space-y-1">
          {item.isReviewingFailed && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500 dark:text-amber-400">
              <Icons name="refresh-cw" className="w-3.5 h-3.5" />
              <span>{t('previousMistake')}</span>
            </div>
          )}
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            {t('chooseMeaning')}
          </h2>
        </div>

        <MasteryFlowerBadge
          level={masteryLevel}
          learningStep={learningStep}
          onClick={onOpenMastery}
        />
      </div>

      <div className="my-6 flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={onPlayAudio}
          className={
            'w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center transition-transform active:scale-95 cursor-pointer ' +
            (isPlayingAudio
              ? 'bg-primary text-primary-foreground scale-105 ring-4 ring-primary/30'
              : 'bg-primary text-primary-foreground hover:bg-primary/90')
          }
          title={t('audioListenHint')}
        >
          <Icons name="volume-2" className="w-10 h-10" />
        </button>

        <span className="text-xs text-muted-foreground font-medium">
          {t('audioListenHint')}
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
                  ? 'bg-primary/15 ring-2 ring-primary text-primary'
                  : 'bg-card hover:bg-muted/70 active:scale-[0.99]')
              }
            >
              <div>
                {option.subLabel && (
                  <span className="italic text-xs text-muted-foreground mr-1">
                    {option.subLabel}
                  </span>
                )}
                <span className="text-sm sm:text-base font-bold text-foreground line-clamp-2">
                  {option.label}
                </span>
              </div>

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
