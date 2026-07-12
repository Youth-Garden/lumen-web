'use client';

import { useState } from 'react';
import { useTranslateText } from '../hooks';
import { Icons } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@lumen/uikit/components';
import { useTranslations } from 'next-intl';

export interface TranslationPopoverProps {
  /** Text to translate */
  text: string;
  /** Optional callback when user adds to flashcards */
  onAddToFlashcard?: (word: string, translation: string) => void;
  /** Optional custom trigger label (defaults to showing the text) */
  triggerLabel?: string;
  /** Whether to show the trigger as a compact icon-only button */
  compact?: boolean;
}

export const TranslationPopover = ({
  text,
  onAddToFlashcard,
  triggerLabel,
  compact = false,
}: TranslationPopoverProps) => {
  const t = useTranslations('Reading');
  const {
    data: translationResult,
    isLoading,
    isError,
  } = useTranslateText(text);
  const [added, setAdded] = useState(false);

  if (!text) return null;

  const handleAdd = () => {
    if (translationResult?.translation) {
      onAddToFlashcard?.(text, translationResult.translation);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const displayText = triggerLabel || text;
  const truncatedText =
    displayText.length > 30 ? displayText.slice(0, 30) + '…' : displayText;

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          variant={compact ? 'ghost' : 'outline'}
          size={compact ? 'icon' : 'sm'}
          className={
            compact ? 'h-8 w-8 p-0 rounded-full' : 'gap-1.5 whitespace-nowrap'
          }
          aria-label={t('translateText')}
        >
          {compact ? (
            <Icons
              name="languages"
              className="h-4 w-4 text-teal-600 dark:text-teal-400"
            />
          ) : (
            <>
              <Icons
                name="languages"
                className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 shrink-0"
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {t('translate')}: "{truncatedText}"
              </span>
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="center"
        side="top"
        sideOffset={10}
        className="w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95"
      >
        <div className="mb-3 border-b border-slate-100 pb-2 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            <Icons name="languages" className="h-4 w-4" /> {t('translation')}
          </div>
          <div className="mt-1 line-clamp-2 text-sm font-medium text-slate-800 dark:text-slate-200">
            "{text}"
          </div>
        </div>

        <div className="min-h-[60px]">
          {isLoading ? (
            <div className="flex h-full items-center justify-center space-x-2 text-slate-400">
              <Icons name="loader-2" className="h-5 w-5 animate-spin" />
              <span className="text-sm">{t('translating')}</span>
            </div>
          ) : isError ? (
            <div className="text-sm text-red-500">{t('failedTranslation')}</div>
          ) : (
            <div className="space-y-4">
              <p className="text-base text-slate-700 dark:text-slate-300">
                {translationResult?.translation || t('noTranslation')}
              </p>

              <Button
                onClick={handleAdd}
                variant={added ? 'secondary' : 'default'}
                size="sm"
                className={`w-full font-medium ${
                  added
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                {added ? (
                  <>
                    <Icons name="check" className="mr-2 h-4 w-4" />{' '}
                    {t('addedToDecks')}
                  </>
                ) : (
                  <>
                    <Icons name="plus" className="mr-2 h-4 w-4" />{' '}
                    {t('addToFlashcards')}
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
