'use client';

import { useTranslations } from 'next-intl';

import type { Folder } from '@/services/vocabulary/vocabulary.types';
import { Button, Card } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';

interface CurrentLearningFolderCardProps {
  activeFolder: Folder | null;
  dueCount: number;
  onSwitchFolder: () => void;
  onStudyNow: () => void;
  onViewFolder?: () => void;
  isLoading?: boolean;
}

export function CurrentLearningFolderCard({
  activeFolder,
  dueCount,
  onSwitchFolder,
  onStudyNow,
  onViewFolder,
}: CurrentLearningFolderCardProps) {
  const t = useTranslations('Vocabulary.Folders');
  if (!activeFolder) {
    return null;
  }

  const wordCount = activeFolder.flashcardCount || 0;
  const displayName = activeFolder.name;
  const learnedApprox = Math.min(
    wordCount,
    Math.max(dueCount * 4, Math.round(wordCount * 0.42)),
  );

  return (
    <div className="space-y-2.5">
      {/* Top Header outside card: Label and Switch folder button */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-bold tracking-tight text-foreground">
          {t('pinnedFolder')}
        </h3>

        <Button
          variant="subtle"
          size="sm"
          onClick={onSwitchFolder}
          className="gap-1.5 font-semibold h-8 px-2.5"
        >
          <Icons name="refresh-cw" className="h-3.5 w-3.5 text-primary" />
          <span>{t('switchFolder')}</span>
        </Button>
      </div>

      {/* Main Card */}
      <Card className="rounded-3xl border-none bg-card p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-primary/15 text-primary flex items-center justify-center shrink-0 shadow-xs">
            <Icons name="folder" className="h-6 w-6" />
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <h4 className="text-base font-bold text-foreground truncate">
              {displayName}
            </h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1 font-semibold text-primary">
                <Icons name="check" className="h-3.5 w-3.5" />
                <span>
                  {t('learnedCountSummary', { learned: learnedApprox, total: wordCount })}
                </span>
              </span>
              {dueCount > 0 && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-500 font-semibold">
                    <Icons name="clock" className="h-3.5 w-3.5" />
                    <span>{t('dueCountSummary', { count: dueCount })}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-2.5 pt-0.5">
          <Button
            variant="default"
            onClick={onStudyNow}
            disabled={wordCount === 0}
            className="gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Icons name="play" className="h-3.5 w-3.5 fill-current" />
            <span>{t('learnNewWords')}</span>
          </Button>

          <Button
            variant="outline"
            onClick={onViewFolder}
            className="gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <Icons name="eye" className="h-3.5 w-3.5" />
            <span>{t('viewFolder')}</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
