'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@lumen/hooks';
import { HighlightText } from '@/shared/components/highlight-text';
import {
  useVocabularyFolders,
  useVocabularyWords,
} from '@/features/vocabulary/hooks/use-vocabulary';
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
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';
import { useLogout } from '@/features/auth/hooks';
import { RouteEnum } from '@/shared/constants';
import { formatUrl } from '@lumen/shared-api';

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUiStore();
  const { logout } = useLogout();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 400);

  const { data: foldersData } = useVocabularyFolders({
    enabled: commandPaletteOpen && isAuthenticated,
  });
  const allFolders = foldersData?.data || [];
  const filteredFolders = debouncedSearch
    ? allFolders.filter((folder) =>
        folder.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
      )
    : [];

  const vocabWords = useVocabularyWords(
    { search: debouncedSearch },
    {
      enabled:
        commandPaletteOpen && isAuthenticated && debouncedSearch.length > 1,
    },
  );

  const isSearching = debouncedSearch.length > 1 && vocabWords.isFetching;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const runCommand = React.useCallback(
    (command: () => void) => {
      setCommandPaletteOpen(false);
      setSearch('');
      command();
    },
    [setCommandPaletteOpen],
  );

  return (
    <CommandDialog
      open={commandPaletteOpen}
      onOpenChange={setCommandPaletteOpen}
    >
      <CommandInput
        placeholder="Search folders, words, or commands... (Ctrl + K)"
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {isSearching && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            Searching...
          </div>
        )}

        {!debouncedSearch && (
          <CommandGroup heading="Suggestions">
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push(RouteEnum.DASHBOARD))
              }
            >
              <Icons name="home" className="mr-2 h-4 w-4" />
              <span>Overview Dashboard</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push(RouteEnum.VOCABULARY))
              }
            >
              <Icons name="book-open" className="mr-2 h-4 w-4" />
              <span>Vocabulary Folders</span>
            </CommandItem>
          </CommandGroup>
        )}

        {debouncedSearch && (
          <>
            {filteredFolders.length > 0 && (
              <CommandGroup heading="Folders">
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
                        text={folder.name}
                        query={debouncedSearch}
                      />
                    </span>
                    {folder.category && (
                      <span className="ml-auto rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                        {folder.category}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {vocabWords?.data?.items && vocabWords.data.items.length > 0 && (
              <CommandGroup heading="Vocabulary Words">
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

        <CommandGroup heading="Quick Actions">
          <CommandItem
            onSelect={() => runCommand(() => router.push(RouteEnum.SETTINGS))}
          >
            <Icons name="user" className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              runCommand(async () => {
                await logout();
              });
            }}
          >
            <Icons name="log-out" className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
