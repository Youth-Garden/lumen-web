'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="ocean-light"
      enableSystem={false}
      themes={['ocean-light', 'ocean-dark', 'forest-light', 'forest-dark']}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
