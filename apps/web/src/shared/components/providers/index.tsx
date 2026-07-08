'use client';

import React from 'react';
import { QueryProvider } from './query-provider';
import { PortalRenderer } from '@lumen/uikit/portal';
import { Updater } from './updater';
import { ThemeProvider } from './theme-provider';
import { Toaster } from '@lumen/uikit/components';
import { TooltipProvider } from '@lumen/uikit/components';
import { PropsWithChildren } from 'react';

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <QueryProvider>
          {children}
          <Updater />
          <PortalRenderer />
          <Toaster position="top-right" />
        </QueryProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
