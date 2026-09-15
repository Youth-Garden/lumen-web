'use client';

import { useTranslations } from 'next-intl';

import Link from 'next/link';
import { RouteEnum } from '@/shared/constants';
import { MasteryFlowerBadge } from '@/features/vocabulary/components/mastery/mastery-flower-badge';
import { type VocabularyWord } from '@/services/vocabulary';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Card,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { usePortal } from '@lumen/uikit/portal';
import { WordDetailSheet } from './word-detail-sheet';

export interface TopicWordsListProps {
  folderName?: string;
  topicName: string;
  topicViName?: string;
  flashcards: VocabularyWord[];
  onBackToTopics: () => void;
}

export function TopicWordsList({
  folderName,
  topicName,
  topicViName,
  flashcards,
  onBackToTopics,
}: TopicWordsListProps) {
  const t = useTranslations('Vocabulary.Folders');
  const [presentWordDetail] = usePortal<VocabularyWord>(WordDetailSheet);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border-b border-border/60 pb-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={RouteEnum.VOCABULARY}>{t('title')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {folderName && (
              <>
                <BreadcrumbItem>
                  <button
                    type="button"
                    onClick={onBackToTopics}
                    className="font-medium text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
                  >
                    {folderName}
                  </button>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>{topicViName || topicName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            {topicViName || topicName}
          </h1>
          <span className="text-sm font-semibold text-muted-foreground">
            ({topicName})
          </span>
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary">
            {t('wordsCount', { count: flashcards.length })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {flashcards.map((flashcard) => {
          const primaryDef = flashcard.definitions?.[0];
          const meaningVi =
            primaryDef?.translationVi || primaryDef?.definition?.vi || '';
          const partOfSpeech = primaryDef?.partOfSpeech || '';

          return (
            <Card
              key={flashcard.id}
              role="button"
              tabIndex={0}
              onClick={() => presentWordDetail(flashcard)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  presentWordDetail(flashcard);
                }
              }}
              className="flex items-center gap-3 p-3.5 rounded-2xl text-left bg-card hover:bg-muted/40 transition-colors cursor-pointer group border-none shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <div className="shrink-0">
                <MasteryFlowerBadge
                  level={flashcard.level ?? 0}
                  learningStep={flashcard.learningStep ?? 0}
                  isWilted={flashcard.isWilted ?? false}
                  size={36}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-primary truncate group-hover:underline">
                  {flashcard.term}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {partOfSpeech && (
                    <span className="italic mr-1">{partOfSpeech}</span>
                  )}
                  {meaningVi}
                </p>
              </div>

              <Icons
                name="chevron-right"
                className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground shrink-0 transition-colors"
              />
            </Card>
          );
        })}
      </div>
    </div>
  );
}
