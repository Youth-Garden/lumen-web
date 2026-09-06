'use client';

import { useTranslations } from 'next-intl';
import { Button, Card } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import type { Folder } from '@/services/vocabulary/vocabulary.types';

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
  const displayDescription = activeFolder.description;
  const folderCategoryLabel = activeFolder.category || t('myFolders');

  return (
    <Card className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 p-6 shadow-xs hover:border-primary/50 transition-all duration-300">
      {/* Top row: Status badges & Switch folder */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold tracking-wide">
            <Icons name="sparkles" className="h-3.5 w-3.5" />
            <span>{t('currentLearningFolder')}</span>
          </span>
          <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-medium border border-border/60">
            {folderCategoryLabel}
          </span>
        </div>

        {/* Switch Folder Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSwitchFolder}
          className="gap-1.5 rounded-2xl text-xs text-muted-foreground hover:text-foreground h-8 px-3"
        >
          <Icons name="refresh-cw" className="h-3.5 w-3.5" />
          <span>{t('switchFolder')}</span>
        </Button>
      </div>

      {/* Main content: Folder details & Action buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4 min-w-0">
          <div className="w-14 h-14 rounded-2xl bg-primary/15 border border-primary/25 text-primary flex items-center justify-center shrink-0 shadow-xs">
            <Icons name="folder" className="h-7 w-7" />
          </div>

          <div className="space-y-1.5 min-w-0">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-foreground truncate">
              {displayName}
            </h3>
            {displayDescription && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {displayDescription}
              </p>
            )}

            {/* Badges / Stats */}
            <div className="flex items-center gap-2 flex-wrap pt-0.5">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-muted/80 text-muted-foreground">
                <Icons name="book-open" className="h-3 w-3" />
                {t('wordsCount', { count: wordCount })}
              </span>

              {dueCount > 0 ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                  <span className="text-sm select-none leading-none">🔥</span>
                  {t('needsReview', { count: dueCount })}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  <Icons name="check-circle" className="h-3 w-3" />
                  {t('allMastered')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto w-full sm:w-auto">
          <Button
            onClick={onStudyNow}
            disabled={wordCount === 0}
            className="flex-1 sm:flex-initial gap-2 rounded-2xl font-bold shadow-sm px-6 py-2.5"
          >
            <Icons name="play" className="h-4 w-4 fill-current" />
            <span>{t('studyNow')}</span>
          </Button>

          <Button
            variant="outline"
            onClick={onViewFolder}
            className="flex-1 sm:flex-initial gap-1.5 rounded-2xl font-semibold border-border/80 hover:border-primary/40 px-4 py-2.5"
          >
            <Icons name="eye" className="h-4 w-4 text-muted-foreground" />
            <span>{t('viewFolder')}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
