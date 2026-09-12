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
import { CommandPaletteShortcutListener } from '../command-palette';

import { GoogleOAuthProvider } from '@react-oauth/google';

export function Providers({ children }: PropsWithChildren) {
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'dummy-client-id'}
    >
      <ThemeProvider>
        <TooltipProvider>
          <QueryProvider>
            <NextTopLoader color="var(--primary)" showSpinner={false} />
            {children}
            <Updater />
            <PortalRenderer />
            <CommandPaletteShortcutListener />
            <Toaster position="top-right" />
          </QueryProvider>
        </TooltipProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
