'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@lumen/hooks';
import { HighlightText } from '@/shared/components/highlight-text';
import { useVocabularyWords } from '@/features/vocabulary/hooks/use-vocabulary';
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
import { useUiStore } from '@/store/ui.store';
import { useLogout } from '@/features/auth/hooks';
import { RouteEnum } from '@/shared/constants';

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, setCommandPaletteOpen } = useUiStore();
  const { logout } = useLogout();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  const vocabWords = useVocabularyWords(
    { search: debouncedSearch },
    { enabled: debouncedSearch.length > 2 },
  );

  const isSearching = debouncedSearch.length > 2 && vocabWords.isFetching;

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
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
        placeholder="Type a command or search..."
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
              <span>Vocabulary Decks</span>
            </CommandItem>
          </CommandGroup>
        )}

        {debouncedSearch && (
          <>
            {vocabWords?.data?.items && vocabWords.data.items.length > 0 && (
              <CommandGroup heading="Vocabulary">
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
                      <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground">
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

        <CommandGroup heading="Settings">
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
                router.push(RouteEnum.LOGIN);
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
