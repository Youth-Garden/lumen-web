'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useDebounce } from '@lumen/hooks';
import { HighlightText } from '@/shared/components/highlight-text';
import {
  useVocabularyFolders,
  useVocabularyWords,
} from '@/features/vocabulary/hooks/use-vocabulary';
import { getLocalizedText } from '@/features/vocabulary/utils';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { type PortalProps } from '@lumen/uikit/portal';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/features/auth/hooks';
import { RouteEnum } from '@/shared/constants';
import { formatUrl } from '@lumen/shared-api';

export function CommandPalette({ isOpen, onDismiss }: PortalProps) {
  const t = useTranslations('CommandPalette');
  const locale = useLocale();
  const router = useRouter();
  const { logout } = useLogout();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const { data: foldersData } = useVocabularyFolders({
    enabled: Boolean(isOpen) && isAuthenticated,
  });
  const allFolders = foldersData?.data || [];
  const filteredFolders = debouncedSearch
    ? allFolders.filter((folder) =>
        getLocalizedText(folder.name, locale)
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()),
      )
    : [];

  const vocabWords = useVocabularyWords(
    { search: debouncedSearch },
    {
      enabled: Boolean(isOpen) && isAuthenticated && debouncedSearch.length > 1,
    },
  );

  const isSearching = debouncedSearch.length > 1 && vocabWords.isFetching;

  const runCommand = React.useCallback(
    (command: () => void) => {
      onDismiss?.();
      setSearch('');
      command();
    },
    [onDismiss],
  );

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

        {!debouncedSearch && (
          <CommandGroup heading={t('suggestions')}>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push(RouteEnum.DASHBOARD))
              }
            >
              <Icons name="home" className="mr-2 h-4 w-4" />
              <span>{t('overview')}</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push(RouteEnum.VOCABULARY))
              }
            >
              <Icons name="book-open" className="mr-2 h-4 w-4" />
              <span>{t('vocabFolders')}</span>
            </CommandItem>
          </CommandGroup>
        )}

        {debouncedSearch && (
          <>
            {filteredFolders.length > 0 && (
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
                    <Icons
                      name="folder"
                      className="mr-2 h-4 w-4 text-primary"
                    />
                    <span>
                      <HighlightText
                        text={getLocalizedText(folder.name, locale)}
                        query={debouncedSearch}
                      />
                    </span>
                    {folder.category && (
                      <span className="ml-auto rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {getLocalizedText(folder.category, locale)}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {vocabWords?.data?.items && vocabWords.data.items.length > 0 && (
              <CommandGroup heading={t('vocabulary')}>
                {vocabWords.data.items.slice(0, 5).map((word) => (
                  <CommandItem
                    key={word.id}
                    onSelect={() =>
                      runCommand(() =>
                        router.push(`${RouteEnum.VOCABULARY}/${word.id}`),
                      )
                    }
                  >
                    <Icons name="book-open" className="mr-2 h-4 w-4" />
                    <span>
                      <HighlightText text={word.term} query={debouncedSearch} />
                    </span>
                    {word.cefrLevel && (
                      <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
                        {word.cefrLevel}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </>
        )}

        <CommandSeparator />

        <CommandGroup heading={t('quickActions')}>
          <CommandItem
            onSelect={() => runCommand(() => router.push(RouteEnum.SETTINGS))}
          >
            <Icons name="user" className="mr-2 h-4 w-4" />
            <span>{t('profileSettings')}</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              runCommand(async () => {
                await logout();
              });
            }}
          >
            <Icons name="log-out" className="mr-2 h-4 w-4" />
            <span>{t('logout')}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
