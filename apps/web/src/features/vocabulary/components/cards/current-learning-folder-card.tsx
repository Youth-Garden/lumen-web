'use client';

import { useTranslations } from 'next-intl';

import type { Folder } from '@/services/vocabulary';
import { useDragScroll, useLocale } from '@/shared/hooks';
import { i18nText } from '@/shared/utils';
import { Button, Card, IconButton } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';

interface CurrentLearningFolderCardProps {
  activeFolder: Folder | null;
  dueCount: number;
  learnedCount?: number;
  onSwitchFolder: () => void;
  onStudyNow: () => void;
  onPractice?: () => void;
  onFlashcards?: () => void;
  onViewFolder?: () => void;
  isLoading?: boolean;
}

export function CurrentLearningFolderCard({
  activeFolder,
  dueCount,
  learnedCount = 0,
  onSwitchFolder,
  onStudyNow,
  onPractice,
  onFlashcards,
  onViewFolder,
}: CurrentLearningFolderCardProps) {
  const t = useTranslations('Vocabulary.Folders');
  const tStudy = useTranslations('Vocabulary.Study');
  const locale = useLocale();
  const scrollRef = useDragScroll<HTMLDivElement>();
  if (!activeFolder) {
    return null;
  }

  const wordCount = activeFolder.wordCount;
  const displayName = i18nText(activeFolder.name, locale);
  const learnedApprox = Math.min(wordCount, Math.max(0, learnedCount));

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-bold tracking-tight text-foreground">
          {t('pinnedFolder')}
        </h3>

        <Button variant="outline" size="sm" onClick={onSwitchFolder}>
          <Icons name="refresh-cw" />
          <span>{t('switchFolder')}</span>
        </Button>
      </div>

      {/* Main Card */}
      <Card className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0 flex-1 text-left">
            <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-xs shadow-primary/20">
              <Icons name="folder" className="h-6 w-6 text-white" />
            </div>

            <div className="space-y-0.5 min-w-0 flex-1">
              <h4 className="text-base font-bold text-foreground truncate">
                {displayName}
              </h4>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground flex-wrap leading-tight">
                <span className="flex items-center gap-1 font-semibold text-primary">
                  <Icons name="check" className="h-3 w-3" />
                  <span>
                    {t('learnedCountSummary', {
                      learned: learnedApprox,
                      total: wordCount,
                    })}
                  </span>
                </span>
                {dueCount > 0 && (
                  <>
                    <span className="text-muted-foreground/60">•</span>
                    <span className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Icons name="clock" className="h-3 w-3" />
                      <span>{t('dueCountSummary', { count: dueCount })}</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {onViewFolder && (
            <IconButton onClick={onViewFolder} aria-label={t('viewFolder')}>
              <Icons name="chevron-right" className="h-4 w-4" />
            </IconButton>
          )}
        </div>

        {/* Action Controls - Horizontally scrollable row */}
        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5 -mx-1 px-1 cursor-grab active:cursor-grabbing select-none"
        >
          {dueCount > 0 ? (
            <>
              <Button
                variant="default"
                size="sm"
                onClick={onPractice || onStudyNow}
                disabled={wordCount === 0}
              >
                <Icons name="sparkles" />
                <span>{tStudy('practice')}</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={onStudyNow}
                disabled={wordCount === 0}
              >
                <Icons name="play" className="fill-current" />
                <span>{tStudy('learnNew')}</span>
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={onStudyNow}
              disabled={wordCount === 0}
            >
              <Icons name="play" className="fill-current" />
              <span>{tStudy('learnNew')}</span>
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={onFlashcards || onStudyNow}
            disabled={wordCount === 0}
          >
            <Icons name="layers" />
            <span>{tStudy('flashcards')}</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
