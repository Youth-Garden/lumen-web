'use client';

import { Link, usePathname } from '@/shared/i18n/routing';
import { useTranslations } from 'next-intl';

import {
  Button,
  Logo,
  ScrollArea,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@lumen/uikit/components';
import { Icons, type IconName } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';

import { RouteEnum } from '@/shared/constants';
import { useUiStore } from '@/store/ui.store';

interface NavItem {
  key: string;
  href: string;
  icon: IconName;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const navigationGroups: NavGroup[] = [
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
        'relative flex h-full flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out z-20',
        sidebarCollapsed ? 'w-[88px]' : 'w-64',
      )}
    >
      {/* Top Header Logo */}
      <div
        className={cn(
          'relative flex h-20 shrink-0 items-center',
          sidebarCollapsed ? 'justify-center px-0' : 'justify-between px-6',
        )}
      >
        {!sidebarCollapsed && (
          <Link
            href={RouteEnum.DASHBOARD}
            className="flex items-center gap-2 group"
          >
            <Logo showText iconSize={28} />
          </Link>
        )}
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 rounded-full cursor-pointer"
                aria-label={
                  sidebarCollapsed ? t('expandSidebar') : t('collapseSidebar')
                }
              >
                <Icons
                  name={
                    sidebarCollapsed ? 'panel-left-open' : 'panel-left-close'
                  }
                  className="h-5 w-5"
                />
              </Button>
            }
          />
          <TooltipContent side="right" sideOffset={10}>
            {sidebarCollapsed ? t('expandSidebar') : t('collapseSidebar')}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Navigation List */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div
          className={cn('flex flex-col', sidebarCollapsed ? 'gap-1' : 'gap-4')}
        >
          {navigationGroups.map((group, groupIdx) => (
            <div
              key={groupIdx}
              className={cn(
                'flex flex-col',
                sidebarCollapsed ? 'gap-0' : 'gap-1.5',
              )}
            >
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

                  const linkNode = (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center h-11 w-full rounded-2xl transition-colors duration-200 gap-3 px-3.5 select-none outline-none text-sm font-medium',
                        sidebarCollapsed
                          ? 'justify-center px-0 w-11 mx-auto'
                          : 'justify-start',
                        isActive
                          ? 'bg-primary/15 text-primary font-semibold'
                          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                      )}
                    >
                      <Icons
                        name={item.icon}
                        className={cn(
                          'h-5 w-5 shrink-0',
                          isActive && 'text-primary',
                        )}
                      />
                      {!sidebarCollapsed && (
                        <span className="whitespace-nowrap truncate">
                          {t(item.key)}
                        </span>
                      )}
                    </Link>
                  );

                  return (
                    <li key={item.key}>
                      {sidebarCollapsed ? (
                        <Tooltip>
                          <TooltipTrigger render={linkNode} />
                          <TooltipContent side="right" sideOffset={12}>
                            {t(item.key)}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        linkNode
                      )}
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
