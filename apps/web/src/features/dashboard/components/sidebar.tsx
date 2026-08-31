'use client';

import { Link, usePathname } from '@/shared/i18n/routing';
import { useTranslations } from 'next-intl';

import { Button, Logo, ScrollArea } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';

import { RouteEnum } from '@/shared/constants';
import { useUiStore } from '@/store/ui.store';

const navigationGroups = [
  {
    group: 'Main',
    items: [
      { key: 'overview', href: RouteEnum.DASHBOARD, icon: 'overview' },
      { key: 'vocabulary', href: RouteEnum.VOCABULARY, icon: 'vocabulary' },
    ],
  },
  {
    group: 'System',
    items: [{ key: 'settings', href: RouteEnum.SETTINGS, icon: 'settings' }],
  },
];

export function Sidebar() {
  const t = useTranslations('Dashboard.Sidebar');
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();

  return (
    <nav
      id="sidebar"
      className={cn(
        'relative flex h-full flex-col bg-background text-card-foreground transition-all duration-300 ease-in-out z-20',
        sidebarCollapsed ? 'w-[88px]' : 'w-64',
      )}
    >
      {/* Top Header Logo */}
      <div className="relative flex h-20 shrink-0 items-center justify-between px-6">
        <Link
          href={RouteEnum.DASHBOARD}
          className="flex items-center gap-2 group"
          onClick={(e) => {
            if (sidebarCollapsed) {
              e.preventDefault();
              toggleSidebar();
            }
          }}
        >
          <Logo showText={!sidebarCollapsed} iconSize={28} />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 rounded-full"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Icons name={sidebarCollapsed ? 'panel-left-open' : 'panel-left-close'} className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation List */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="flex flex-col gap-4">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="flex flex-col gap-1.5">
              {!sidebarCollapsed && (
                <span className="px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
                  {group.group}
                </span>
              )}

              <ul className="flex flex-col gap-1 w-full">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== RouteEnum.DASHBOARD &&
                      pathname.startsWith(item.href));

                  return (
                    <li key={item.key}>
                      <Link href={item.href} className="block w-full">
                        <Button
                          variant="ghost"
                          className={cn(
                            'flex items-center h-11 w-full justify-start rounded-xl transition-all duration-200 gap-3 px-3.5',
                            sidebarCollapsed && 'justify-center px-0 w-11 mx-auto',
                            isActive
                              ? 'bg-primary/15 text-primary font-semibold shadow-xs border border-primary/20'
                              : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
                          )}
                        >
                          <Icons
                            name={item.icon as any}
                            className={cn('h-5 w-5 shrink-0', isActive && 'text-primary')}
                          />
                          {!sidebarCollapsed && (
                            <span className="whitespace-nowrap text-sm truncate">
                              {t(item.key)}
                            </span>
                          )}
                        </Button>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </ScrollArea>
    </nav>
  );
}
