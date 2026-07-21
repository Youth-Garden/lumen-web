'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@lumen/uikit/components';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { buttonVariants } from './button';

// Single source of truth: theme -> 3 swatch colors (matches the menu items)
const THEME_SWATCHES: Record<string, [string, string, string]> = {
  'ocean-light': ['#66abff', '#ffffff', '#f2f0f0'],
  'ocean-dark': ['#8dc8ff', '#201919', '#3e3535'],
  'forest-light': ['#00a33d', '#f3faff', '#e0edf8'],
  'forest-dark': ['#2fbc5b', '#02080e', '#172128'],
};

function Swatch({ theme }: { theme: string }) {
  const colors = THEME_SWATCHES[theme] ?? THEME_SWATCHES['ocean-light'];
  return (
    <div className="flex -space-x-1">
      {colors.map((c) => (
        <div
          key={c}
          className="h-3.5 w-3.5 rounded-full ring-1 ring-background"
          style={{ backgroundColor: c }}
        />
      ))}
    </div>
  );
}

export function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid Hydration Mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-10 w-32 bg-muted rounded-md animate-pulse" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex h-9 items-center justify-center rounded-full border border-border/60 bg-background/80 px-3 transition-all hover:border-primary/40 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 shadow-sm"
        aria-label="Change theme"
      >
        <Swatch theme={theme ?? 'ocean-light'} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          {themes.map((t) => (
            <DropdownMenuRadioItem key={t} value={t}>
              <Swatch theme={t} />
              <span className="ml-2 whitespace-nowrap capitalize">
                {t.replace('-', ' ')}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
