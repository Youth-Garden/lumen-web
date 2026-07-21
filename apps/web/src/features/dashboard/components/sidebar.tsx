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
    items: [{ key: 'overview', href: RouteEnum.DASHBOARD, icon: 'overview' }],
  },
  {
    group: 'Learning',
    items: [
      { key: 'study', href: RouteEnum.STUDY, icon: 'study' },
      { key: 'grammar', href: RouteEnum.GRAMMAR, icon: 'book' },
      { key: 'speaking', href: RouteEnum.SPEAKING, icon: 'mic' },
      { key: 'quiz', href: RouteEnum.QUIZ, icon: 'quiz' },
      { key: 'vocabulary', href: RouteEnum.VOCABULARY, icon: 'vocabulary' },
      { key: 'toeic', href: RouteEnum.TOEIC, icon: 'headphones' },
      { key: 'reading', href: RouteEnum.READING, icon: 'newspaper' },
      { key: 'dictation', href: RouteEnum.DICTATION, icon: 'headphones' },
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
        'relative flex h-full flex-col bg-background text-card-foreground transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'w-[88px]' : 'w-64',
      )}
    >
      <div className="relative flex h-20 shrink-0 items-center overflow-hidden">
        <Link
          href={RouteEnum.DASHBOARD}
          className="absolute left-[30px] flex items-center group"
          onClick={(e) => {
            if (sidebarCollapsed) {
              e.preventDefault();
              toggleSidebar();
            }
          }}
        >
          <div
            className={cn(
              'transition-opacity duration-200 flex items-center',
              sidebarCollapsed && 'group-hover:opacity-0',
            )}
          >
            <Logo showText={!sidebarCollapsed} iconSize={28} />
          </div>
          {sidebarCollapsed && (
            <div className="absolute left-0 top-0 w-[28px] h-[28px] flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 text-muted-foreground">
              <Icons name="panel-left-open" className="h-6 w-6" />
            </div>
          )}
        </Link>
        {!sidebarCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="absolute right-6 text-muted-foreground hover:text-foreground shrink-0"
            title="Close sidebar"
          >
            <Icons name="panel-left-close" className="h-6 w-6" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-2 py-4">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="flex flex-col gap-1">
              <div
                className={cn(
                  'relative flex items-center transition-all duration-300',
                  sidebarCollapsed
                    ? 'h-0 opacity-0 overflow-hidden'
                    : 'h-8 opacity-100',
                )}
              >
                <span
                  className={cn(
                    'absolute left-[30px] text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 transition-all duration-300 whitespace-nowrap',
                    sidebarCollapsed
                      ? 'opacity-0 invisible'
                      : 'opacity-100 visible',
                  )}
                >
                  {group.group}
                </span>
              </div>

              <ul className="flex flex-col gap-1.5 w-full">
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== RouteEnum.DASHBOARD &&
                      pathname.startsWith(item.href + '/'));

                  return (
                    <li key={item.key}>
                      <Link href={item.href} className="block w-full">
                        <Button
                          variant="ghost"
                          className={cn(
                            'flex items-center h-11 justify-start rounded-xl overflow-hidden transition-all duration-300 ml-[22px] pl-[12px] gap-0',
                            sidebarCollapsed ? 'w-11' : 'w-[212px]',
                            isActive
                              ? 'bg-primary/10 text-primary font-medium shadow-none hover:bg-primary/15'
                              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                          )}
                        >
                          <Icons
                            name={item.icon as any}
                            className="h-5 w-5 shrink-0"
                          />
                          <span
                            className={cn(
                              'whitespace-nowrap overflow-hidden transition-all duration-300 text-sm',
                              sidebarCollapsed
                                ? 'max-w-0 opacity-0 ml-0'
                                : 'max-w-[180px] opacity-100 ml-3',
                            )}
                          >
                            {t(item.key)}
                          </span>
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
