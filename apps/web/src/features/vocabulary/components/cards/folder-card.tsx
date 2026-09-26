'use client';

import { useTranslations } from 'next-intl';

import { getFolderCoverUrl } from '@/features/vocabulary/utils';
import { useLocale } from '@/shared/hooks';
import { i18nText } from '@/shared/utils';
import type { Folder } from '@/services/vocabulary';
import { Badge } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import Image from 'next/image';

interface FolderCardProps {
  folder: Folder;
  isActive: boolean;
  isUserFolder?: boolean;
  onSelectFolder?: (folderId: string) => void;
  onViewFolderWords?: (folderId: string) => void;
}

export function FolderCard({
  folder,
  isActive,
  isUserFolder = false,
  onSelectFolder,
  onViewFolderWords,
}: FolderCardProps) {
  const t = useTranslations('Vocabulary.Folders');
  const locale = useLocale();
  const folderDisplayName = i18nText(folder.name, locale);

  const coverUrl = folder.imageUrl || getFolderCoverUrl(folder.id);

  const totalWords = folder.flashcardCount || 0;
  const learnedCount = folder.learnedCount ?? 0;
  const dueCount = folder.dueCount ?? 0;

  const handleClick = () => {
    if (onSelectFolder) {
      onSelectFolder(folder.id);
    } else if (onViewFolderWords) {
      onViewFolderWords(folder.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-2xl h-36 sm:h-40 p-3.5 flex flex-col justify-between select-none cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl border-none max-w-sm ${
        isActive ? 'shadow-md scale-[1.01]' : ''
      }`}
    >
      {/* Background Cover Image with Gradient Overlay */}
      <div className="absolute inset-0 w-full h-full bg-muted overflow-hidden pointer-events-none">
        <Image
          src={coverUrl}
          alt={folderDisplayName}
          fill
          sizes="(max-width: 640px) 100vw, 260px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Dark gradient overlay for readable text */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
      </div>

      {/* TOP: Active indicator badge on top right (Type removed as requested) */}
      <div className="relative z-10 flex items-start justify-end pointer-events-none w-full min-h-[22px]">
        {isActive && (
          <Badge variant="default" size="sm">
            {t('activeBadge')}
          </Badge>
        )}
      </div>

      {/* BOTTOM: Folder Name & Stats Pill */}
      <div className="relative z-10 space-y-1.5 pointer-events-none">
        <h4 className="text-white font-extrabold text-sm sm:text-base leading-snug line-clamp-1 drop-shadow-md">
          {folderDisplayName}
        </h4>

        {/* Stats Pill: [✓] learned/total   [clock] due */}
        <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold shadow-sm">
          <div className="flex items-center gap-1 text-emerald-400">
            <Icons name="check" className="w-3 h-3 stroke-[2.5]" />
            <span className="text-white">
              {learnedCount}/{totalWords}
            </span>
          </div>

          <span className="w-1 h-1 rounded-full bg-white/30" />

          <div className="flex items-center gap-1 text-amber-400">
            <Icons name="clock" className="w-3 h-3" />
            <span className="text-white">{dueCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
