'use client';

import { Link, usePathname, useRouter } from '@/shared/i18n/routing';
import { useTranslations } from 'next-intl';

import { Icons } from '@lumen/uikit/icons';
import {
  Button,
  ScrollArea,
  Logo,
} from '@lumen/uikit/components';
import { cn } from '@lumen/uikit/utils';

import { RouteEnum } from '@/shared/constants';
import { useLogout } from '@/features/auth/hooks';
import { useAuthStore } from '@/store/auth.store';
import { useUiStore } from '@/store/ui.store';

const navigationGroups = [
  {
    group: 'Main',
    items: [
      { key: 'overview', href: RouteEnum.DASHBOARD, icon: 'overview' },
    ],
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
    items: [
      { key: 'settings', href: RouteEnum.SETTINGS, icon: 'settings' },
    ],
  },
];

export function Sidebar() {
  const t = useTranslations('Dashboard.Sidebar');
  const pathname = usePathname();
  const router = useRouter();
  
  const { user } = useAuthStore();
  const { logout } = useLogout();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();

  const handleLogout = () => {
    logout();
    router.push(RouteEnum.LOGIN);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className={cn(
        "relative flex h-full flex-col border-r border-border bg-background text-card-foreground transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-[88px]" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className="absolute -right-4 top-6 z-30 h-8 w-8 rounded-full border bg-background text-muted-foreground hover:text-foreground hover:bg-accent shadow-sm transition-transform hover:scale-105"
      >
        <Icons
          name={sidebarCollapsed ? "panel-left-open" : "panel-left-close"}
          className="h-4 w-4"
        />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      {/* Header / Logo */}
      <div className={cn("p-6 flex items-center h-20 shrink-0", sidebarCollapsed ? "justify-center px-0" : "")}>
        <Link href={RouteEnum.DASHBOARD} className="flex items-center">
          <Logo showText={!sidebarCollapsed} />
        </Link>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-2 py-4">
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className={cn("flex flex-col", sidebarCollapsed ? "gap-2" : "gap-1")}>
              {!sidebarCollapsed && (
                <span className="px-6 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {group.group}
                </span>
              )}
              {sidebarCollapsed && groupIdx !== 0 && <div className="mx-auto w-8 border-t border-border/50 my-2" />}
              
              <ul className="flex flex-col gap-1.5 px-4">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  
                  return (
                    <li key={item.key}>
                      <Link href={item.href} className="block w-full">
                        <Button
                          variant="ghost"
                          className={cn(
                            "relative flex w-full items-center h-11 rounded-xl transition-all duration-200",
                            sidebarCollapsed
                              ? "justify-center px-0 w-11 mx-auto"
                              : "justify-start gap-3 px-4",
                            isActive
                              ? "bg-primary/10 text-primary font-medium shadow-none hover:bg-primary/15"
                              : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                          )}
                        >
                          {/* Active indicator bar */}
                          {isActive && sidebarCollapsed && (
                             <div className="absolute left-[-16px] top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
                          )}
                          
                          <Icons
                            name={item.icon as any}
                            className={cn("shrink-0", sidebarCollapsed ? "h-6 w-6" : "h-5 w-5")}
                          />
                          {!sidebarCollapsed && <span>{t(item.key)}</span>}
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

      {/* User Footer */}
      <div className="p-4 shrink-0 border-t border-border/50">
        <div
          className={cn(
            "flex items-center gap-3 rounded-xl p-2 transition-colors",
            sidebarCollapsed ? "justify-center" : "hover:bg-accent/50"
          )}
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            {getInitials(user?.email || user?.name || 'User')}
          </div>
          
          {!sidebarCollapsed && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <span className="truncate text-sm font-medium">
                {user?.name || 'Lumen User'}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {user?.email || 'admin@example.com'}
              </span>
            </div>
          )}

          {!sidebarCollapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
              onClick={handleLogout}
              title="Logout"
            >
              <Icons name="log-out" className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          )}
        </div>
        
        {/* If collapsed, logout button below avatar */}
        {sidebarCollapsed && (
           <Button
             variant="ghost"
             size="icon"
             className="mx-auto mt-2 flex h-10 w-10 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
             onClick={handleLogout}
             title="Logout"
           >
             <Icons name="log-out" className="h-5 w-5" />
           </Button>
        )}
      </div>
    </div>
  );
}
