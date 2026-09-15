'use client';

import { usePathname } from '@/shared/i18n/routing';
import { PropsWithChildren } from 'react';
import { Header } from '../components/header';
import { Sidebar } from '../components/sidebar';

export function DashboardLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isVocabDashboard = pathname === '/vocabulary';

  return (
    <div
      id="main-layout"
      className="relative flex h-screen overflow-hidden bg-sidebar gap-2"
    >
      <div className="absolute top-0 left-0 -z-10 h-125 w-125 rounded-full bg-primary/20 opacity-40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 -z-10 h-150 w-150 rounded-full bg-blue-500/10 opacity-30 blur-[100px] pointer-events-none" />

      <div id="sidebar-wrapper" className="my-2 ml-2 flex h-[calc(100vh-1rem)]">
        <Sidebar />
      </div>

      <div
        id="main-content-wrapper"
        className="relative flex flex-col flex-1 overflow-hidden z-10 bg-background my-2 mr-2 rounded-2xl md:rounded-4xl"
      >
        <Header />
        <main
          id="main-content"
          className={`flex-1 px-6 md:px-10 min-h-0 ${
            isVocabDashboard
              ? 'overflow-hidden pt-1 pb-2 md:pb-2.5 flex flex-col'
              : 'overflow-y-auto pt-1 pb-10'
          }`}
        >
          <div className="mx-auto w-full max-w-[1600px] h-full flex flex-col flex-1 min-h-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
