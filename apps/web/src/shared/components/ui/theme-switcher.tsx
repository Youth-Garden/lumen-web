'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';

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
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="h-10 px-3 py-2 bg-background border border-input rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {themes.map((t) => (
        <option key={t} value={t}>
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </option>
      ))}
    </select>
  );
}
