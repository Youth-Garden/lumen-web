'use client';

import React from 'react';
import { QueryProvider } from './query-provider';
import { PortalRenderer } from './portal-renderer';
import { Updater } from './updater';
import { ThemeProvider } from './theme-provider';
import { Toaster } from '@/shared/components/ui/sonner';
import { TooltipProvider } from '@/shared/components/ui/tooltip';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
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
