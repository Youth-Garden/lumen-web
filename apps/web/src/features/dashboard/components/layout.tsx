'use client';

import { BreadcrumbProvider, useBreadcrumb } from '@/shared/hooks';
import { usePathname } from '@/shared/i18n/routing';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Skeleton,
} from '@lumen/uikit/components';
import Link from 'next/link';
import React, { PropsWithChildren } from 'react';
import { Header } from '../components/header';
import { Sidebar } from '../components/sidebar';

const LEVEL_1_PATHS = new Set([
  '/',
  '/dashboard',
  '/vocabulary',
  '/analytics',
  '/settings',
]);

interface DashboardLayoutProps extends PropsWithChildren {
  defaultCollapsed?: boolean;
}

function DashboardContent({
  children,
  defaultCollapsed,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const { breadcrumbs } = useBreadcrumb();
  const isVocabDashboard = pathname === '/vocabulary';
  const isLevel1Page = LEVEL_1_PATHS.has(pathname);
  const showBreadcrumbs = !isLevel1Page;

  return (
    <div
      id="main-layout"
      className="relative flex h-screen overflow-hidden bg-layout gap-2"
    >
      <div className="absolute top-0 left-0 -z-10 h-125 w-125 rounded-full bg-primary/20 opacity-40 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 -z-10 h-150 w-150 rounded-full bg-blue-500/10 opacity-30 blur-[100px] pointer-events-none" />

      <div id="sidebar-wrapper" className="my-2 ml-2 flex h-[calc(100vh-1rem)]">
        <Sidebar defaultCollapsed={defaultCollapsed} />
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
              <div className="pt-2 pb-5 mb-2 min-h-[2.25rem]">
                <Breadcrumb>
                  <BreadcrumbList className="gap-0.5 sm:gap-1">
                    {breadcrumbs.length > 0 ? (
                       breadcrumbs.map((item, index) => {
                        const isLast = index === breadcrumbs.length - 1;
                        return (
                          <React.Fragment key={index}>
                            <BreadcrumbItem>
                              {item.isLoading ? (
                                <Skeleton className="h-4 w-16 sm:w-20 rounded-md" />
                              ) : isLast ? (
                                <BreadcrumbPage className="text-xs font-bold text-foreground select-none">
                                  {item.label}
                                </BreadcrumbPage>
                              ) : item.href ? (
                                <BreadcrumbLink asChild>
                                  <Link
                                    href={item.href}
                                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                  >
                                    {item.label}
                                  </Link>
                                </BreadcrumbLink>
                              ) : (
                                <button
                                  type="button"
                                  onClick={item.onClick}
                                  className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                                >
                                  {item.label}
                                </button>
                              )}
                            </BreadcrumbItem>
                            {!isLast && (
                              <BreadcrumbSeparator className="text-muted-foreground/40 [&>svg]:size-3 mx-0 px-0" />
                            )}
                          </React.Fragment>
                        );
                      })
                    ) : (
                      <>
                        <BreadcrumbItem>
                          <Skeleton className="h-4 w-14 rounded-md" />
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="text-muted-foreground/40 [&>svg]:size-3 mx-0 px-0" />
                        <BreadcrumbItem>
                          <Skeleton className="h-4 w-24 rounded-md" />
                        </BreadcrumbItem>
                      </>
                    )}
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

export function DashboardLayout({
  children,
  defaultCollapsed,
}: DashboardLayoutProps) {
  return (
    <BreadcrumbProvider>
      <DashboardContent defaultCollapsed={defaultCollapsed}>
        {children}
      </DashboardContent>
    </BreadcrumbProvider>
  );
}
