'use client';

import { useLocale } from '@/shared/hooks';
import { useTranslations } from 'next-intl';

import { PageTitle } from '@/shared/components/page-title';
import type { FolderTopic } from '@/services/vocabulary';
import { Locale } from '@/shared/types';
import { i18nText } from '@/shared/utils';
import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import Image from 'next/image';

export interface FolderTopicGridProps {
  folderName: string;
  category?: string;
  description?: string;
  selectedTopic: string | null;
  topics?: FolderTopic[];
  topicStats?: FolderTopic[];
  onSelectTopic: (topicName: string) => void;
  onGoBack?: () => void;
  onDeleteFolder?: () => void;
}

export function FolderTopicGrid({
  folderName,
  category,
  description,
  selectedTopic,
  topics,
  topicStats,
  onSelectTopic,
  onDeleteFolder,
}: FolderTopicGridProps) {
  const t = useTranslations('Vocabulary.Folders');
  const locale = useLocale();
  const topicList = topics ?? topicStats ?? [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageTitle
        title={folderName}
        badge={
          category ? (
            <Badge variant="subtle" size="sm">
              {category}
            </Badge>
          ) : undefined
        }
        description={description || t('defaultFolderDescription')}
        actions={
          onDeleteFolder && (
            <DropdownMenu>
              <DropdownMenuTrigger
                className="flex items-center justify-center size-9 rounded-2xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                aria-label={t('folderActions')}
              >
                <Icons name="more-horizontal" className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-40">
                <DropdownMenuItem
                  variant="destructive"
                  onClick={onDeleteFolder}
                  className="cursor-pointer"
                >
                  <Icons name="trash-2" className="mr-2 h-4 w-4" />
                  <span>{t('deleteFolder')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }
      />

      {/* Grid of Circular Topic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 justify-items-center">
        {topicList.map((topicItem) => {
          const topicImg = topicItem.imageUrl || topicItem.topicImageUrl;
          const topicRawEn = i18nText(
            topicItem.name || topicItem.topic,
            Locale.EN,
          );
          const isSelected =
            selectedTopic === topicItem.id || selectedTopic === topicRawEn;
          const title = i18nText(topicItem.name || topicItem.topic, locale);

          const learnedCount = topicItem.learnedCount ?? 0;
          const dueCount = topicItem.dueCount ?? 0;
          const progressRatio =
            topicItem.count > 0
              ? Math.min(1, learnedCount / topicItem.count)
              : 0;

          return (
            <div
              key={topicItem.id}
              onClick={() => onSelectTopic(topicItem.id || topicRawEn)}
              className={`flex flex-col items-center justify-between text-center select-none cursor-pointer transition-all duration-200 p-2.5 rounded-2xl w-36 sm:w-40 ${
                isSelected ? 'bg-primary/10 shadow-sm' : 'hover:bg-muted/40'
              }`}
            >
              {/* Circular Avatar with Circular Progress Ring */}
              <div className="relative w-22 h-22 sm:w-24 sm:h-24 flex items-center justify-center">
                <Icons
                  name="progress-ring"
                  percent={Math.round(progressRatio * 100)}
                  className="w-22 h-22 sm:w-24 sm:h-24 absolute inset-0 pointer-events-none text-primary"
                />

                <div className="w-16 h-16 sm:w-17 sm:h-17 rounded-full overflow-hidden relative bg-muted/40">
                  {topicImg ? (
                    <Image
                      src={topicImg}
                      alt={title}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                      <Icons name="layers" className="w-7 h-7" />
                    </div>
                  )}
                </div>
              </div>

              {/* Topic Title */}
              <div className="mt-2.5 w-full px-1">
                <h4 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1">
                  {title}
                </h4>
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-center gap-2.5 mt-2 text-[11px] sm:text-xs font-bold">
                <div className="flex items-center gap-1 text-[#22c55e]">
                  <Icons name="check" className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>
                    {learnedCount}/{topicItem.count}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-[#f59e0b]">
                  <Icons name="clock" className="w-3.5 h-3.5" />
                  <span>{dueCount}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
