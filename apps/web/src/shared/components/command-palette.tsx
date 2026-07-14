'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Suggestions">
          <CommandItem
            onSelect={() => runCommand(() => router.push(RouteEnum.DASHBOARD))}
          >
            <Icons name="home" />
            <span>Overview Dashboard</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => router.push(`${RouteEnum.VOCABULARY}/study`))
            }
          >
            <Icons name="book-open" />
            <span>Study Vocabulary</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push(RouteEnum.TOEIC))}
          >
            <Icons name="file-text" />
            <span>Take TOEIC Test</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Settings">
          <CommandItem
            onSelect={() => runCommand(() => router.push(RouteEnum.SETTINGS))}
          >
            <Icons name="user" />
            <span>Profile Settings</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push(RouteEnum.SETTINGS))}
          >
            <Icons name="flag" />
            <span>Learning Goals</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              runCommand(async () => {
                await logout();
                router.push(RouteEnum.LOGIN);
              });
            }}
          >
            <Icons name="log-out" />
            <span>Log out</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
