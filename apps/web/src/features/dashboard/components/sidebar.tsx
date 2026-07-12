'use client';

import { Link, usePathname, useRouter } from '@/shared/i18n/routing';
import { useTranslations } from 'next-intl';

import { Icons } from '@lumen/uikit/icons';
import { Button, ScrollArea, Logo } from '@lumen/uikit/components';
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
      { key: 'quiz', href: RouteEnum.QUIZ, icon: 'quiz' },
      { key: 'vocabulary', href: RouteEnum.VOCABULARY, icon: 'vocabulary' },
      { key: 'decks', href: RouteEnum.DECKS, icon: 'deck' },
      { key: 'toeic', href: RouteEnum.TOEIC, icon: 'headphones' },
      { key: 'reading', href: RouteEnum.READING, icon: 'newspaper' },
      { key: 'dictation', href: RouteEnum.DICTATION, icon: 'mic' },
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
    <div
      className={cn(
        'relative flex h-full flex-col bg-background text-card-foreground transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'w-[88px]' : 'w-64',
      )}
    >
      <div className="relative flex h-20 w-full shrink-0 items-center overflow-hidden">
        {/* OPEN STATE */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-between pl-[30px] pr-6 transition-all duration-300',
            sidebarCollapsed
              ? 'opacity-0 invisible scale-95'
              : 'opacity-100 visible scale-100',
          )}
        >
          <Link href={RouteEnum.DASHBOARD} className="flex items-center">
            <Logo showText={true} iconSize={28} />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="text-muted-foreground hover:text-foreground -mr-2"
            title="Close sidebar"
          >
            <Icons name="panel-left-close" className="h-6 w-6" />
          </Button>
        </div>

        {/* CLOSED STATE */}
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center transition-all duration-300',
            sidebarCollapsed
              ? 'opacity-100 visible scale-100'
              : 'opacity-0 invisible scale-110',
          )}
        >
          <Button
            variant="ghost"
            className="w-12 h-12 rounded-xl hover:bg-accent group relative overflow-hidden"
            onClick={toggleSidebar}
            title="Open sidebar"
          >
            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0">
              <Logo showText={false} iconSize={28} />
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100 text-muted-foreground">
              <Icons name="panel-left-open" className="h-6 w-6" />
            </div>
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 py-4">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="flex flex-col gap-1">
              <div
                className={cn(
                  'relative flex items-center justify-center transition-all duration-300',
                  sidebarCollapsed && groupIdx === 0
                    ? 'h-0 opacity-0 overflow-hidden'
                    : 'h-8 opacity-100',
                )}
              >
                <span
                  className={cn(
                    'absolute left-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 transition-all duration-300 whitespace-nowrap',
                    sidebarCollapsed
                      ? 'opacity-0 scale-95 invisible'
                      : 'opacity-100 scale-100 visible',
                  )}
                >
                  {group.group}
                </span>

                {groupIdx !== 0 && (
                  <div
                    className={cn(
                      'absolute w-8 border-t border-border/50 transition-all duration-300',
                      sidebarCollapsed
                        ? 'opacity-100 scale-100 visible'
                        : 'opacity-0 scale-50 invisible',
                    )}
                  />
                )}
              </div>

              <ul className="flex flex-col gap-1.5 px-4">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;

                  return (
                    <li key={item.key}>
                      <Link href={item.href} className="block w-full">
                        <Button
                          variant="ghost"
                          className={cn(
                            'relative flex items-center h-11 w-full rounded-xl transition-all duration-300 overflow-hidden mx-auto justify-start gap-0',
                            sidebarCollapsed
                              ? 'max-w-[44px] pl-[12px]'
                              : 'max-w-[250px] pl-[18px]',
                            isActive
                              ? 'bg-primary/10 text-primary font-medium shadow-none hover:bg-primary/15'
                              : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                          )}
                        >
                          <Icons
                            name={item.icon as any}
                            className={cn(
                              'shrink-0 transition-all duration-300',
                              'h-8 w-8',
                            )}
                          />

                          <div
                            className={cn(
                              'whitespace-nowrap transition-all duration-300 overflow-hidden',
                              sidebarCollapsed
                                ? 'max-w-0 opacity-0 ml-0'
                                : 'max-w-[200px] opacity-100 ml-3',
                            )}
                          >
                            {t(item.key)}
                          </div>
                        </Button>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
}
