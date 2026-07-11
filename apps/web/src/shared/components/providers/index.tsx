'use client';

import React from 'react';
import { QueryProvider } from './query-provider';
import { PortalRenderer } from '@lumen/uikit/portal';
import { Updater } from './updater';
import { ThemeProvider } from './theme-provider';
import { Toaster } from '@lumen/uikit/components';
import { TooltipProvider } from '@lumen/uikit/components';
import { PropsWithChildren } from 'react';
import NextTopLoader from 'nextjs-toploader';

export function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <QueryProvider>
          <NextTopLoader color="#6366f1" showSpinner={false} />
          {children}
          <Updater />
          <PortalRenderer />
          <Toaster position="top-right" />
        </QueryProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
