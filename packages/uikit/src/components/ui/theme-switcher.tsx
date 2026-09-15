'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTheme } from 'next-themes';
import * as React from 'react';

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-24 bg-muted rounded-xl animate-pulse" />;
  }

  const isDark = theme === 'dark';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="gap-2 font-medium" />
        }
      >
        {isDark ? (
          <Icons name="moon" className="h-4 w-4 text-primary" />
        ) : (
          <Icons name="sun" className="h-4 w-4 text-amber-500" />
        )}
        <span className="capitalize">{isDark ? 'Dark' : 'Light'}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32 rounded-xl">
        <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light" className="gap-2 text-xs py-2">
            <Icons name="sun" className="h-3.5 w-3.5 text-amber-500" />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" className="gap-2 text-xs py-2">
            <Icons name="moon" className="h-3.5 w-3.5 text-primary" />
            Dark
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
