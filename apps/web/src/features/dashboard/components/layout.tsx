'use client';

import React, { PropsWithChildren } from 'react';
import Link from 'next/link';
import { usePathname } from '@/shared/i18n/routing';
import { BreadcrumbProvider, useBreadcrumb } from '@/shared/hooks';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@lumen/uikit/components';
import { Header } from '../components/header';
import { Sidebar } from '../components/sidebar';

const LEVEL_1_PATHS = new Set([
  '/',
  '/dashboard',
  '/vocabulary',
  '/analytics',
  '/settings',
]);

function DashboardContent({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { breadcrumbs } = useBreadcrumb();
  const isVocabDashboard = pathname === '/vocabulary';
  const isLevel1Page = LEVEL_1_PATHS.has(pathname);

  const showBreadcrumbs = breadcrumbs.length > 0 && !isLevel1Page;

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
            {showBreadcrumbs && (
              <div className="pt-2 pb-6 mb-2">
                <Breadcrumb>
                  <BreadcrumbList className="gap-1 sm:gap-1.5">
                    {breadcrumbs.map((item, index) => {
                      const isLast = index === breadcrumbs.length - 1;
                      return (
                        <React.Fragment key={index}>
                          <BreadcrumbItem>
                            {isLast ? (
                              <BreadcrumbPage className="px-2.5 py-1 rounded-lg text-xs font-bold text-primary bg-primary/10 select-none">
                                {item.label}
                              </BreadcrumbPage>
                            ) : item.href ? (
                              <BreadcrumbLink asChild>
                                <Link
                                  href={item.href}
                                  className="px-2.5 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                                >
                                  {item.label}
                                </Link>
                              </BreadcrumbLink>
                            ) : (
                              <button
                                type="button"
                                onClick={item.onClick}
                                className="px-2.5 py-1 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                              >
                                {item.label}
                              </button>
                            )}
                          </BreadcrumbItem>
                          {!isLast && (
                            <BreadcrumbSeparator className="text-muted-foreground/40" />
                          )}
                        </React.Fragment>
                      );
                    })}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <BreadcrumbProvider>
      <DashboardContent>{children}</DashboardContent>
    </BreadcrumbProvider>
  );
}
