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

  const currentTheme = theme || 'system';

  const renderTriggerIcon = () => {
    if (currentTheme === 'light') {
      return <Icons name="sun" />;
    }
    if (currentTheme === 'dark') {
      return <Icons name="moon" />;
    }
    return <Icons name="monitor" />;
  };

  const renderTriggerLabel = () => {
    if (currentTheme === 'light') return 'Light';
    if (currentTheme === 'dark') return 'Dark';
    return 'System';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" className="gap-1.5 font-medium" />
        }
      >
        {renderTriggerIcon()}
        <span className="capitalize">{renderTriggerLabel()}</span>
        <Icons name="chevron-down" className="h-3 w-3 opacity-60 ml-0.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32 rounded-xl">
        <DropdownMenuRadioGroup value={currentTheme} onValueChange={setTheme}>
          <DropdownMenuRadioItem value="light" className="gap-2 text-xs py-2">
            <Icons name="sun" className="h-3.5 w-3.5 shrink-0 " />
            Light
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark" className="gap-2 text-xs py-2">
            <Icons name="moon" className="h-3.5 w-3.5 shrink-0" />
            Dark
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system" className="gap-2 text-xs py-2">
            <Icons
              name="monitor"
              className="h-3.5 w-3.5 shrink-0 text-foreground"
            />
            System
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
