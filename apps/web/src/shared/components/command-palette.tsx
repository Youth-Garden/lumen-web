'use client';

import { useLogout } from '@/features/auth/hooks';
import { WordDetailSheet } from '@/features/vocabulary/components/folder-detail/word-detail-sheet';
import {
  useVocabularyFolders,
  useVocabularyWords,
} from '@/features/vocabulary/hooks/use-vocabulary';
import {
  vocabularyKeys,
  vocabularyService,
  type FolderTopic,
  type VocabularyWord,
} from '@/services/vocabulary';
import { HighlightText } from '@/shared/components/highlight-text';
import { RouteEnum } from '@/shared/constants';
import { useLocale } from '@/shared/hooks';
import { Locale } from '@/shared/types';
import { i18nText, includesI18n } from '@/shared/utils';
import { useAuthStore } from '@/store/auth.store';
import { useDebounce } from '@lumen/hooks';
import { formatUrl } from '@lumen/shared-api';
import {
  Badge,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@lumen/uikit/components';
import { Icons, type IconName } from '@lumen/uikit/icons';
import { usePortal, type PortalProps } from '@lumen/uikit/portal';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';

interface NavPageItem {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  href: string;
  iconName: IconName;
}

const NAV_PAGES: NavPageItem[] = [
  {
    id: 'dashboard',
    name: { en: 'Dashboard & Overview', vi: 'Tổng quan hệ thống' },
    description: {
      en: 'Daily goals, streak, and learning stats',
      vi: 'Mục tiêu hàng ngày, chuỗi học và thống kê',
    },
    href: RouteEnum.DASHBOARD,
    iconName: 'home',
  },
  {
    id: 'vocabulary',
    name: { en: 'Vocabulary Decks', vi: 'Thư mục từ vựng' },
    description: {
      en: 'Explore vocabulary folders and topics',
      vi: 'Khám phá các bộ từ vựng và chủ đề',
    },
    href: RouteEnum.VOCABULARY,
    iconName: 'book-open',
  },
  {
    id: 'vocabulary-due',
    name: { en: 'Due Reviews & SRS', vi: 'Từ vựng cần ôn tập' },
    description: {
      en: 'Spaced repetition flashcard review queue',
      vi: 'Hàng chờ ôn tập thuật toán lặp lại ngắt quãng FSRS',
    },
    href: RouteEnum.VOCABULARY_DUE,
    iconName: 'clock',
  },
  {
    id: 'settings',
    name: { en: 'Account & Settings', vi: 'Cài đặt tài khoản' },
    description: {
      en: 'Profile settings, native language, and preferences',
      vi: 'Quản lý thông tin tài khoản và tùy chọn',
    },
    href: RouteEnum.SETTINGS,
    iconName: 'user',
  },
];

export function CommandPalette({ isOpen, onDismiss }: PortalProps) {
  const t = useTranslations('CommandPalette');
  const locale = useLocale();
  const router = useRouter();
  const { logout } = useLogout();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [presentWordDetail] = usePortal<VocabularyWord>(WordDetailSheet);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  // Auto dismiss if unauthenticated
  useEffect(() => {
    if (!isAuthenticated && isOpen) {
      onDismiss?.();
    }
  }, [isAuthenticated, isOpen, onDismiss]);

  // 1. System & Custom Folders
  const { data: foldersData } = useVocabularyFolders({
    enabled: Boolean(isOpen) && isAuthenticated,
  });
  const allFolders = foldersData?.data || [];

  const filteredFolders = useMemo(() => {
    if (!debouncedSearch.trim()) return [];
    return allFolders.filter(
      (folder) =>
        includesI18n(folder.name, debouncedSearch) ||
        includesI18n(folder.description, debouncedSearch) ||
        includesI18n(folder.category, debouncedSearch),
    );
  }, [allFolders, debouncedSearch]);

  // 2. Search topics across folders via single endpoint
  const isSearchActive =
    Boolean(isOpen) && isAuthenticated && debouncedSearch.trim().length > 0;

  const { data: topicsRes } = useQuery({
    queryKey: ['vocabulary', 'topics', 'search', debouncedSearch.trim()],
    queryFn: () =>
      vocabularyService
        .getAllTopics({ search: debouncedSearch.trim(), limit: 10 })
        .then((res) => res?.data ?? []),
    enabled: isSearchActive,
    staleTime: 5 * 60 * 1000,
  });

  const filteredTopics: FolderTopic[] = useMemo(() => {
    if (!debouncedSearch.trim()) return [];
    return topicsRes ?? [];
  }, [debouncedSearch, topicsRes]);

  // 3. Vocabulary Master Words (Triggers GET /vocabulary/words?search=... API call)
  const vocabWords = useVocabularyWords(
    { search: debouncedSearch.trim(), limit: 10 },
    {
      enabled: isSearchActive,
    },
  );

  const isSearching = isSearchActive && vocabWords.isFetching;

  // 4. Navigation Pages & Tabs
  const filteredNavPages = useMemo(() => {
    if (!debouncedSearch.trim()) return NAV_PAGES;
    return NAV_PAGES.filter(
      (page) =>
        includesI18n(page.name, debouncedSearch) ||
        includesI18n(page.description, debouncedSearch),
    );
  }, [debouncedSearch]);

  const runCommand = React.useCallback(
    (command: () => void) => {
      onDismiss?.();
      setSearch('');
      command();
    },
    [onDismiss],
  );

  if (!isAuthenticated) return null;

  return (
    <CommandDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onDismiss?.();
          setSearch('');
        }
      }}
    >
      <CommandInput
        placeholder={t('placeholder')}
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>{t('empty')}</CommandEmpty>

        {isSearching && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {t('searching')}
          </div>
        )}

        {/* PRIORITY 1: Thư mục từ vựng (Folders) */}
        {debouncedSearch && filteredFolders.length > 0 && (
          <CommandGroup heading={t('folders')}>
            {filteredFolders.slice(0, 5).map((folder) => (
              <CommandItem
                key={folder.id}
                onSelect={() =>
                  runCommand(() =>
                    router.push(
                      formatUrl(RouteEnum.FOLDER_DETAIL, { id: folder.id }),
                    ),
                  )
                }
              >
                <Icons name="folder" className="mr-2 h-4 w-4" />
                <span>
                  <HighlightText
                    text={i18nText(folder.name, locale)}
                    query={debouncedSearch}
                  />
                </span>
                {folder.category && (
                  <Badge
                    variant="subtle"
                    size="sm"
                    className="ml-auto shrink-0 font-medium"
                  >
                    {i18nText(folder.category, locale)}
                  </Badge>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* PRIORITY 2: Chủ đề từ vựng (Sub-Topics) */}
        {debouncedSearch && filteredTopics.length > 0 && (
          <CommandGroup heading={t('topics')}>
            {filteredTopics.slice(0, 6).map((item, idx) => {
              const topicTitle = i18nText(item.name || item.topic, locale);
              const folderTitle = item.folderName
                ? i18nText(item.folderName, locale)
                : '';
              const topicParamEn =
                i18nText(item.name || item.topic, Locale.EN) || topicTitle;

              return (
                <CommandItem
                  key={`${item.folderId ?? 'topic'}-${item.id || idx}`}
                  onSelect={() =>
                    runCommand(() => {
                      if (item.folderId) {
                        router.push(
                          formatUrl(RouteEnum.FOLDER_TOPIC_DETAIL, {
                            id: item.folderId,
                            topic: encodeURIComponent(topicParamEn),
                          }),
                        );
                      }
                    })
                  }
                >
                  <Icons name="book-open" className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>
                      <HighlightText
                        text={topicTitle}
                        query={debouncedSearch}
                      />
                    </span>
                    {folderTitle && (
                      <span className="text-[11px] text-muted-foreground">
                        {folderTitle}
                      </span>
                    )}
                  </div>
                  <Badge
                    variant="secondary"
                    size="sm"
                    className="ml-auto shrink-0 font-medium"
                  >
                    {t('wordsCount', { count: item.count })}
                  </Badge>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {/* PRIORITY 3: Từ vựng (Vocabulary Master Words) */}
        {debouncedSearch &&
          vocabWords?.data?.items &&
          vocabWords.data.items.length > 0 && (
            <CommandGroup heading={t('vocabulary')}>
              {vocabWords.data.items.slice(0, 6).map((word) => (
                <CommandItem
                  key={word.id}
                  onSelect={() => runCommand(() => presentWordDetail(word))}
                >
                  <Icons name="file-text" className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>
                      <HighlightText text={word.term} query={debouncedSearch} />
                    </span>
                    {word.definitions?.[0]?.definition && (
                      <span className="text-[11px] text-muted-foreground line-clamp-1">
                        {i18nText(word.definitions[0].definition, locale)}
                      </span>
                    )}
                  </div>
                  {word.cefrLevel && (
                    <Badge
                      variant="subtle"
                      size="sm"
                      className="ml-auto shrink-0 font-medium"
                    >
                      {word.cefrLevel}
                    </Badge>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

        {/* PRIORITY 4: Trang & Tính năng hệ thống */}
        {filteredNavPages.length > 0 && (
          <CommandGroup
            heading={!debouncedSearch ? t('suggestions') : t('pages')}
          >
            {filteredNavPages.map((page) => (
              <CommandItem
                key={page.id}
                onSelect={() => runCommand(() => router.push(page.href))}
              >
                <Icons name={page.iconName} className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>
                    <HighlightText
                      text={i18nText(page.name, locale)}
                      query={debouncedSearch}
                    />
                  </span>
                  {debouncedSearch && (
                    <span className="text-[11px] text-muted-foreground line-clamp-1">
                      {i18nText(page.description, locale)}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* PRIORITY 5: Quick Actions (Settings & Logout) */}
        {(!debouncedSearch ||
          includesI18n(
            { en: 'Settings Profile', vi: 'Cài đặt Tài khoản' },
            debouncedSearch,
          ) ||
          includesI18n(
            { en: 'Logout Sign out', vi: 'Đăng xuất Thoát' },
            debouncedSearch,
          )) && (
          <>
            <CommandSeparator />
            <CommandGroup heading={t('quickActions')}>
              <CommandItem
                onSelect={() =>
                  runCommand(() => router.push(RouteEnum.SETTINGS))
                }
              >
                <Icons name="user" className="mr-2 h-4 w-4" />
                <span>{t('profileSettings')}</span>
              </CommandItem>
              {isAuthenticated && (
                <CommandItem
                  variant="destructive"
                  onSelect={() => {
                    runCommand(async () => {
                      await logout();
                    });
                  }}
                >
                  <Icons name="log-out" className="mr-2 h-4 w-4" />
                  <span>{t('logout')}</span>
                </CommandItem>
              )}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
