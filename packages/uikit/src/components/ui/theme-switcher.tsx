'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { Icons } from '@lumen/uikit/icons';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '@lumen/uikit/components';
import { buttonVariants } from './button';

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
        className={buttonVariants({
          variant: 'ghost',
          size: 'icon',
          className: 'relative h-9 w-9',
        })}
      >
        <Icons
          name="sun"
          className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <Icons
          name="moon"
          className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-40">
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="ocean-light">
            <div className="flex -space-x-1 mr-2 shrink-0">
              <div className="h-3 w-3 rounded-full bg-[#66abff] ring-1 ring-background" />
              <div className="h-3 w-3 rounded-full bg-[#ffffff] ring-1 ring-background" />
              <div className="h-3 w-3 rounded-full bg-[#f2f0f0] ring-1 ring-background" />
            </div>
            <span className="whitespace-nowrap">Ocean Day</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ocean-dark">
            <div className="flex -space-x-1 mr-2 shrink-0">
              <div className="h-3 w-3 rounded-full bg-[#8dc8ff] ring-1 ring-background" />
              <div className="h-3 w-3 rounded-full bg-[#201919] ring-1 ring-background" />
              <div className="h-3 w-3 rounded-full bg-[#3e3535] ring-1 ring-background" />
            </div>
            <span className="whitespace-nowrap">Ocean Night</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="forest-light">
            <div className="flex -space-x-1 mr-2 shrink-0">
              <div className="h-3 w-3 rounded-full bg-[#00a33d] ring-1 ring-background" />
              <div className="h-3 w-3 rounded-full bg-[#f3faff] ring-1 ring-background" />
              <div className="h-3 w-3 rounded-full bg-[#e0edf8] ring-1 ring-background" />
            </div>
            <span className="whitespace-nowrap">Forest Day</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="forest-dark">
            <div className="flex -space-x-1 mr-2 shrink-0">
              <div className="h-3 w-3 rounded-full bg-[#2fbc5b] ring-1 ring-background" />
              <div className="h-3 w-3 rounded-full bg-[#02080e] ring-1 ring-background" />
              <div className="h-3 w-3 rounded-full bg-[#172128] ring-1 ring-background" />
            </div>
            <span className="whitespace-nowrap">Forest Night</span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
