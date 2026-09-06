'use client';

import type { Folder } from '@/services/vocabulary/vocabulary.types';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';

interface FolderSelectionViewProps {
  activeFolderId: string | null;
  allFolders: Folder[];
  isLoading: boolean;
  onSelectFolder: (folderId: string) => void;
  onBackToDashboard?: () => void;
  onCreateFolder: () => void;
  onViewFolderWords: (folderId: string) => void;
}

export function FolderSelectionView({
  activeFolderId,
  allFolders,
  isLoading,
  onSelectFolder,
  onBackToDashboard,
  onCreateFolder,
  onViewFolderWords,
}: FolderSelectionViewProps) {
  const t = useTranslations('Vocabulary.Folders');

  const systemFolders = allFolders.filter((folder) => Boolean(folder.category));
  const customFolders = allFolders.filter((folder) => !folder.category);

  return (
    <div className="flex flex-col space-y-8 p-1 sm:p-2">
      {/* 1. Header Section */}
      <div className="flex flex-col space-y-3">
        {onBackToDashboard && (
          <div>
            <Button
              variant="subtle"
              size="sm"
              onClick={onBackToDashboard}
              className="gap-1.5 -ml-2.5 w-fit text-muted-foreground hover:text-foreground"
            >
              <Icons name="arrow-left" className="h-4 w-4" />
              <span>{t('backToActiveFolder')}</span>
            </Button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl font-heading">
              {t('selectFolderTitle')}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {t('selectFolderSubtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* 2. System Folders Section */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-2">
          <Icons name="sparkles" className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            {t('systemFolders')}
          </h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-primary">
            {systemFolders.length}
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-44 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {systemFolders.map((folder) => {
              const isActive = folder.id === activeFolderId;

              return (
                <Card
                  key={folder.id}
                  className={`group relative flex flex-col justify-between border rounded-2xl overflow-hidden transition-all duration-200 ${
                    isActive
                      ? 'border-primary shadow-sm bg-primary/5 ring-1 ring-primary/30'
                      : 'border-border/60 hover:border-primary/50 bg-card hover:shadow-xs'
                  }`}
                >
                  <CardHeader className="space-y-2 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-primary">
                        {folder.category || 'TOEIC'}
                      </span>
                      {isActive && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {t('activeBadge')}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {folder.name}
                    </CardTitle>
                    {folder.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {folder.description}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="pb-3 pt-0">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <Icons
                        name="book-open"
                        className="h-3.5 w-3.5 text-primary"
                      />
                      <span>
                        {folder.flashcardCount || 0} {t('cards')}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="border-t border-border/40 bg-muted/20 pt-2.5 pb-2.5 px-4 flex items-center justify-between gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewFolderWords(folder.id)}
                      className="text-xs font-semibold h-8 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      {t('viewWords')}
                    </Button>
                    <Button
                      variant={isActive ? 'subtle' : 'default'}
                      size="sm"
                      onClick={() => onSelectFolder(folder.id)}
                      className="text-xs font-bold h-8 px-3 rounded-xl"
                    >
                      {isActive ? t('activeBadge') : t('selectToLearn')}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. My Custom Folders Section */}
      <div className="flex flex-col space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <Icons name="folder" className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            {t('customFolders')}
          </h3>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border border-border/60 bg-muted text-muted-foreground">
            {customFolders.length}
          </span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-44 w-full rounded-2xl" />
            ))}
          </div>
        ) : customFolders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-border/70 rounded-2xl bg-muted/10 space-y-3">
            <Icons
              name="folder"
              className="h-10 w-10 text-muted-foreground/40"
            />
            <p className="text-sm font-medium text-muted-foreground">
              {t('noCustomFolders')}
            </p>
            <Button size="sm" className="gap-2" onClick={onCreateFolder}>
              <Icons name="plus" className="h-4 w-4" />
              <span>{t('createNewFolder')}</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {customFolders.map((folder) => {
              const isActive = folder.id === activeFolderId;

              return (
                <Card
                  key={folder.id}
                  className={`group relative flex flex-col justify-between border rounded-2xl overflow-hidden transition-all duration-200 ${
                    isActive
                      ? 'border-primary shadow-sm bg-primary/5 ring-1 ring-primary/30'
                      : 'border-border/60 hover:border-primary/50 bg-card hover:shadow-xs'
                  }`}
                >
                  <CardHeader className="space-y-2 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-border/60 bg-muted text-muted-foreground">
                        {t('myFolders')}
                      </span>
                      {isActive && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          {t('activeBadge')}
                        </span>
                      )}
                    </div>
                    <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {folder.name}
                    </CardTitle>
                    {folder.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {folder.description}
                      </p>
                    )}
                  </CardHeader>

                  <CardContent className="pb-3 pt-0">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                      <Icons
                        name="book-open"
                        className="h-3.5 w-3.5 text-primary"
                      />
                      <span>
                        {folder.flashcardCount || 0} {t('cards')}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter className="border-t border-border/40 bg-muted/20 pt-2.5 pb-2.5 px-4 flex items-center justify-between gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewFolderWords(folder.id)}
                      className="text-xs font-semibold h-8 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      {t('viewWords')}
                    </Button>
                    <Button
                      variant={isActive ? 'subtle' : 'default'}
                      size="sm"
                      onClick={() => onSelectFolder(folder.id)}
                      className="text-xs font-bold h-8 px-3 rounded-xl"
                    >
                      {isActive ? t('activeBadge') : t('selectToLearn')}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
