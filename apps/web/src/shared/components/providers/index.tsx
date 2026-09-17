'use client';

import { Toaster, TooltipProvider } from '@lumen/uikit/components';
import { PortalRenderer } from '@lumen/uikit/portal';
import { GoogleOAuthProvider } from '@react-oauth/google';
import NextTopLoader from 'nextjs-toploader';
import { PropsWithChildren } from 'react';

import { QueryProvider } from './query-provider';
import { ThemeProvider } from './theme-provider';
import { Updater } from './updater';

export function Providers({ children }: PropsWithChildren) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <ThemeProvider>
        <TooltipProvider>
          <QueryProvider>
            <NextTopLoader color="var(--primary)" showSpinner={false} />
            {children}

            <Updater />
            <PortalRenderer />
            <Toaster position="top-right" />
          </QueryProvider>
        </TooltipProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
