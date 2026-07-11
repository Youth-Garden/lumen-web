'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icons } from '@lumen/uikit/icons';

import {
  Button,
  ScrollArea,
} from '@lumen/uikit/components';
import { RouteEnum } from '@/shared/constants';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { cn } from '@lumen/uikit/utils';

import { useTranslations } from 'next-intl';

import { useUiStore } from '@/store/ui.store';

const navigationKeys = [
  { key: 'overview', href: RouteEnum.DASHBOARD, icon: 'layout-dashboard' },
  { key: 'study', href: RouteEnum.STUDY, icon: 'brain' },
  { key: 'quiz', href: RouteEnum.QUIZ, icon: 'file-question' },
  { key: 'vocabulary', href: RouteEnum.VOCABULARY, icon: 'book' },
  { key: 'decks', href: RouteEnum.DECKS, icon: 'layers' },
  { key: 'toeic', href: RouteEnum.TOEIC, icon: 'headphones' },
  { key: 'reading', href: RouteEnum.READING, icon: 'newspaper' },
  { key: 'dictation', href: RouteEnum.DICTATION, icon: 'mic' },
  { key: 'settings', href: RouteEnum.SETTINGS, icon: 'settings' },
];

export function Sidebar() {
  const t = useTranslations('Dashboard.Sidebar');
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();

  const handleLogout = () => {
    logout();
    router.push(RouteEnum.LOGIN);
  };

  return (
    <div 
      className={cn(
        "relative z-20 flex h-full flex-col border-r border-border bg-background/95 backdrop-blur-xl text-card-foreground shadow-sm transition-all duration-300 ease-in-out",
        sidebarCollapsed ? "w-20" : "w-64"
      )}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className="absolute -right-4 top-6 z-30 h-8 w-8 rounded-full border bg-background text-muted-foreground hover:text-foreground hover:bg-muted shadow-sm transition-transform hover:scale-105"
      >
        <Icons name={sidebarCollapsed ? "panel-left-open" : "panel-left-close"} className="h-5 w-5" />
        <span className="sr-only">Toggle Sidebar</span>
      </Button>

      <div className={cn("p-6 flex items-center h-20", sidebarCollapsed ? "justify-center px-0" : "")}>
        <Link
          href={RouteEnum.DASHBOARD}
          className="flex items-center gap-2 font-bold text-xl"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
            <Icons name="command" className="h-5 w-5" />
          </div>
          {!sidebarCollapsed && <span>Lumen</span>}
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4">
        <nav className="flex flex-col gap-2">
          {navigationKeys.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.key} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'relative transition-all duration-300 h-12',
                    sidebarCollapsed ? 'w-12 justify-center px-0 mx-auto flex' : 'w-full justify-start gap-3 px-4',
                    isActive
                      ? 'bg-primary/10 text-primary font-semibold shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {isActive && !sidebarCollapsed && (
                    <div className="absolute left-0 top-1/2 h-8 -translate-y-1/2 w-1 rounded-r-full bg-primary" />
                  )}
                  <Icons name={item.icon as any} className="h-5 w-5 shrink-0" />
                  {!sidebarCollapsed && <span>{t(item.key)}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

    </div>
  );
}
