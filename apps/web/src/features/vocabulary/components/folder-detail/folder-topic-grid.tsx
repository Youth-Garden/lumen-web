'use client';

import { useTranslations } from 'next-intl';

import Link from 'next/link';
import Image from 'next/image';
import { RouteEnum } from '@/shared/constants';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';

export interface TopicStatItem {
  name: string;
  viName: string;
  imageUrl?: string;
  count: number;
  learnedCount: number;
  dueCount: number;
}

export interface FolderTopicGridProps {
  folderName: string;
  category?: string;
  description?: string;
  selectedTopic: string | null;
  topicStats: TopicStatItem[];
  onSelectTopic: (topicName: string) => void;
  onGoBack?: () => void;
}

export function FolderTopicGrid({
  folderName,
  category,
  description,
  selectedTopic,
  topicStats,
  onSelectTopic,
}: FolderTopicGridProps) {
  const t = useTranslations('Vocabulary.Folders');
  const radius = 37;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={RouteEnum.VOCABULARY}>{t('title')}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{folderName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
            {folderName}
          </h1>
          {category && (
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-primary/10 text-primary">
              {category}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground mt-1">
          {description || t('defaultFolderDescription')}
        </p>
      </div>

      {/* Grid of Circular Topic Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 justify-items-center">
        {topicStats.map((topicItem) => {
          const topicImg = topicItem.imageUrl;
          const isSelected = selectedTopic === topicItem.name;

          const learnedCount = topicItem.learnedCount ?? 0;
          const dueCount = topicItem.dueCount ?? 0;
          const progressRatio =
            topicItem.count > 0
              ? Math.min(1, learnedCount / topicItem.count)
              : 0;
          const strokeDashoffset = circumference * (1 - progressRatio);
          const progressStroke = progressRatio >= 1 ? '#10b981' : '#0ea5e9';

          return (
            <div
              key={topicItem.name}
              onClick={() => onSelectTopic(topicItem.name)}
              className={`group flex flex-col items-center justify-between text-center select-none cursor-pointer transition-all duration-200 p-2.5 rounded-2xl w-36 sm:w-40 ${
                isSelected
                  ? 'bg-primary/10 shadow-sm scale-105'
                  : 'hover:bg-muted/40 hover:scale-102'
              }`}
            >
              {/* Circular Avatar with Circular Progress Ring */}
              <div className="relative w-22 h-22 sm:w-24 sm:h-24 flex items-center justify-center">
                <svg
                  className="w-22 h-22 sm:w-24 sm:h-24 -rotate-90 absolute inset-0 pointer-events-none"
                  viewBox="0 0 88 88"
                >
                  <circle
                    cx="44"
                    cy="44"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="2.5"
                    className="text-black/[0.06] dark:text-white/[0.08]"
                    fill="none"
                  />
                  {progressRatio > 0 && (
                    <circle
                      cx="44"
                      cy="44"
                      r={radius}
                      stroke={progressStroke}
                      strokeWidth="3"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                      fill="none"
                    />
                  )}
                </svg>

                <div className="w-16 h-16 sm:w-17 sm:h-17 rounded-full overflow-hidden relative bg-muted/40 transition-transform group-hover:scale-105">
                  {topicImg ? (
                    <Image
                      src={topicImg}
                      alt={topicItem.name}
                      fill
                      sizes="72px"
                      className="object-cover"
                      unoptimized
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
                <h4 className="text-xs sm:text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {topicItem.viName}
                </h4>
                <p className="text-[10px] sm:text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                  {topicItem.name}
                </p>
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
