'use client';

import { useLocale, useTranslations } from 'next-intl';

import { getLocalizedText } from '@/features/vocabulary/utils';
import type { Folder } from '@/services/vocabulary';
import { Icons } from '@lumen/uikit/icons';
import Image from 'next/image';

export const FOLDER_COVERS: Record<string, string> = {
  '84f92475-bee4-41ff-8372-c50593e46920':
    'https://res.cloudinary.com/dms9jruo5/image/upload/v1788521229/lumen/vocabulary/images/train.jpg',
  '600 từ vựng TOEIC':
    'https://res.cloudinary.com/dms9jruo5/image/upload/v1788521229/lumen/vocabulary/images/train.jpg',
  '600 Essential TOEIC Words':
    'https://res.cloudinary.com/dms9jruo5/image/upload/v1788521229/lumen/vocabulary/images/train.jpg',
  'Từ vựng TOEIC':
    'https://res.cloudinary.com/dms9jruo5/image/upload/v1788521229/lumen/vocabulary/images/train.jpg',
  'TOEIC Vocabulary':
    'https://res.cloudinary.com/dms9jruo5/image/upload/v1788521229/lumen/vocabulary/images/train.jpg',
  TOEIC:
    'https://res.cloudinary.com/dms9jruo5/image/upload/v1788521229/lumen/vocabulary/images/train.jpg',
  user_default:
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
};

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
  const folderDisplayName = getLocalizedText(folder.name, locale);
  const folderCategory = getLocalizedText(folder.category, locale);

  const coverUrl =
    FOLDER_COVERS[folder.id] ||
    FOLDER_COVERS[folderDisplayName] ||
    (typeof folder.name === 'object' && folder.name !== null
      ? FOLDER_COVERS[folder.name.en || ''] ||
        FOLDER_COVERS[folder.name.vi || '']
      : null) ||
    (folderCategory ? FOLDER_COVERS[folderCategory] : null) ||
    FOLDER_COVERS.user_default;

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
      className={`group relative overflow-hidden rounded-2xl h-36 sm:h-40 p-3.5 flex flex-col justify-between select-none cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-0.5 border-none max-w-sm ${
        isActive ? 'shadow-md scale-[1.01]' : ''
      }`}
    >
      {/* Background Cover Image with Gradient Overlay */}
      <div className="absolute inset-0 w-full h-full bg-muted overflow-hidden pointer-events-none">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={folderDisplayName}
            fill
            sizes="(max-width: 640px) 100vw, 260px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900" />
        )}
        {/* Smooth Dark Gradient for clear typography */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
      </div>

      {/* TOP: Active indicator badge on top right (Type removed as requested) */}
      <div className="relative z-10 flex items-start justify-end pointer-events-none w-full min-h-[22px]">
        {isActive && (
          <span className="px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-md">
            {t('activeBadge')}
          </span>
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
