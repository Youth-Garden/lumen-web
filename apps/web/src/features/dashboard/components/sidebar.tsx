'use client';

import { Link, usePathname } from '@/shared/i18n/routing';
import { useTranslations } from 'next-intl';

import {
  Button,
  Logo,
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
        'relative flex h-full flex-col bg-background rounded-3xl text-sidebar-foreground transition-[width] duration-300 ease-in-out z-20 overflow-hidden select-none',
        sidebarCollapsed ? 'w-20' : 'w-64',
      )}
    >
      {/* Top Header Logo & Toggle Button */}
      <div className="relative flex h-20 shrink-0 items-center px-[18px] overflow-hidden w-full">
        {/* Logo (Smooth Collapse) */}
        <div
          className={cn(
            'flex items-center overflow-hidden transition-all duration-300 ease-in-out',
            sidebarCollapsed
              ? 'max-w-0 opacity-0 pointer-events-none p-0'
              : 'max-w-[150px] opacity-100 flex-1',
          )}
        >
          <Link
            href={RouteEnum.DASHBOARD}
            className="flex items-center gap-2 group whitespace-nowrap"
          >
            <Logo showText iconSize={28} />
          </Link>
        </div>

        {/* Toggle Button Container */}
        <div
          className={cn(
            'w-11 h-11 shrink-0 flex items-center justify-center transition-all duration-300 ease-in-out',
            sidebarCollapsed ? '' : 'ml-auto',
          )}
        >
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={toggleSidebar}
                  className="text-muted-foreground hover:text-foreground h-9 w-9 shrink-0 flex items-center justify-center"
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
            <TooltipContent side="right" sideOffset={12}>
              {sidebarCollapsed ? t('expandSidebar') : t('collapseSidebar')}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Navigation List - Using native clean scroll container without Base UI scrollbar gutter */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 py-4 px-[18px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-col gap-3">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="flex flex-col">
              {/* Group Title */}
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300 ease-in-out',
                  sidebarCollapsed
                    ? 'max-h-0 opacity-0 mb-0 -translate-y-1 pointer-events-none px-0'
                    : 'max-h-6 opacity-100 mb-1.5 px-3',
                )}
              >
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 whitespace-nowrap block">
                  {group.group}
                </span>
              </div>

              <ul
                className={cn(
                  'flex flex-col w-full transition-all duration-300',
                  sidebarCollapsed ? 'gap-2' : 'gap-1',
                )}
              >
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== RouteEnum.DASHBOARD &&
                      pathname.startsWith(item.href));

                  const linkNode = (
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center h-11 w-full rounded-2xl transition-colors duration-200 outline-none text-sm font-medium overflow-hidden',
                        isActive
                          ? 'bg-primary/15 text-primary font-bold'
                          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                      )}
                    >
                      {/* Fixed 44x44 icon container */}
                      <div className="w-11 h-11 shrink-0 flex items-center justify-center">
                        <Icons
                          name={item.icon}
                          className={cn(
                            'h-5 w-5 shrink-0 transition-colors',
                            isActive && 'text-primary',
                          )}
                        />
                      </div>

                      {/* Text Label */}
                      <span
                        className={cn(
                          'whitespace-nowrap truncate font-medium text-sm transition-all duration-300 ease-in-out',
                          sidebarCollapsed
                            ? 'max-w-0 opacity-0 translate-x-0 pointer-events-none px-0'
                            : 'max-w-[150px] opacity-100 translate-x-0 pr-3 pl-1',
                        )}
                      >
                        {t(item.key)}
                      </span>
                    </Link>
                  );

                  return (
                    <li key={item.key} className="w-full">
                      {sidebarCollapsed ? (
                        <Tooltip>
                          <TooltipTrigger render={linkNode} />
                          <TooltipContent side="right" sideOffset={14}>
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
      </div>
    </nav>
  );
}
