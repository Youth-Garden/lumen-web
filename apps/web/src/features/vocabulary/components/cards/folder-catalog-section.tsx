'use client';

import { useMemo } from 'react';
import { Icons } from '@lumen/uikit/icons';
import { Button } from '@lumen/uikit/components';
import type { Folder } from '@/services/vocabulary/vocabulary.types';
import { FolderCard } from './folder-card';

interface FolderCatalogSectionProps {
  folders: Folder[];
  activeFolderId: string | null;
  onViewFolder: (folderId: string) => void;
  onCreateFolder?: () => void;
}

export function FolderCatalogSection({
  folders,
  activeFolderId,
  onViewFolder,
  onCreateFolder,
}: FolderCatalogSectionProps) {
  // 1. Separate User folders (displayed first) and Categorized folders
  const { userFolders, categorizedGroups } = useMemo(() => {
    const userList: Folder[] = [];
    const catMap = new Map<string, Folder[]>();

    folders.forEach((f) => {
      if (!f.category || f.category.trim() === '' || f.category === 'Cá nhân') {
        userList.push(f);
      } else {
        const cat = f.category.trim();
        if (!catMap.has(cat)) catMap.set(cat, []);
        catMap.get(cat)!.push(f);
      }
    });

    return {
      userFolders: userList,
      categorizedGroups: Array.from(catMap.entries()),
    };
  }, [folders]);

  return (
    <div className="space-y-6 w-full relative">
      {/* 1. User Folders (Thư mục của tôi) - Displayed First */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold tracking-tight text-foreground">
              Thư mục của tôi
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Các thư mục từ vựng do bạn tự tạo
            </p>
          </div>

          {onCreateFolder && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCreateFolder}
              className="gap-1.5 text-xs font-semibold cursor-pointer"
            >
              <Icons name="plus" className="h-3.5 w-3.5" />
              <span>Tạo thư mục</span>
            </Button>
          )}
        </div>

        {userFolders.length === 0 ? (
          <div className="p-5 rounded-2xl bg-card shadow-sm text-center text-xs text-muted-foreground">
            Bạn chưa tạo thư mục cá nhân nào. Hãy bấm &quot;Tạo thư mục&quot; để bắt đầu!
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {userFolders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                isActive={folder.id === activeFolderId}
                isUserFolder={true}
                onViewFolderWords={onViewFolder}
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. Categorized Folders (e.g. Từ vựng TOEIC, Từ vựng IELTS, v.v.) */}
      {categorizedGroups.map(([categoryName, groupFolders]) => (
        <div key={categoryName} className="space-y-3">
          <div>
            <h3 className="text-base font-bold tracking-tight text-foreground">
              {categoryName}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Kho từ vựng chuyên đề tiêu biểu
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3.5">
            {groupFolders.map((folder) => (
              <FolderCard
                key={folder.id}
                folder={folder}
                isActive={folder.id === activeFolderId}
                isUserFolder={false}
                onViewFolderWords={onViewFolder}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
