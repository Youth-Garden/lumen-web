'use client';

import { useTranslations } from 'next-intl';
import { StreakIcon } from '@/shared/components/streak-icon';
import { useLogout } from '@/features/auth/hooks';
import { NotificationDropdown } from '@/features/notification/components/notification-dropdown';
import { CommandPalette } from '@/shared/components/command-palette';
import { RouteEnum } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/routing';
import { useAuthStore } from '@/store/auth.store';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { usePortal } from '@lumen/uikit/portal';
import { useProgressDashboard } from '../hooks/use-progress-dashboard';

export function Header() {
  const t = useTranslations('Dashboard.Header');
  const user = useAuthStore((state) => state.user);
  const [presentCommandPalette] = usePortal(CommandPalette, {
    key: 'command_palette',
  });
  const { logout } = useLogout();
  const router = useRouter();
  const { data: progressData } = useProgressDashboard();

  const handleLogout = async () => {
    await logout();
  };

  const userInitials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((namePart) => namePart[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.substring(0, 2).toUpperCase() || 'U';

  return (
    <header
      id="header"
      className="relative z-30 flex items-center justify-between w-full px-6 md:px-10 pt-4 pb-2.5 shrink-0"
    >
      <Button
        variant="secondary"
        type="button"
        onClick={() => presentCommandPalette()}
        className="w-60 sm:w-72 md:w-84 justify-between font-normal text-muted-foreground text-xs bg-card/90 hover:bg-card active:bg-card dark:bg-card/90 dark:hover:bg-card/90 backdrop-blur-md active:scale-100 active:not-aria-[haspopup]:scale-100"
        title={t('searchTooltip')}
      >
        <div className="flex items-center gap-2.5">
          <Icons
            name="search"
            className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0"
          />
          <span className="font-medium text-xs text-muted-foreground/80 group-hover:text-foreground transition-colors">
            {t('searchPlaceholder')}
          </span>
        </div>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded-md bg-muted/60 px-1.5 font-mono text-[10px] font-semibold text-muted-foreground shadow-2xs">
          <span>Ctrl</span>
          <span>K</span>
        </kbd>
      </Button>

      <div className="flex items-center gap-2 bg-card/90 backdrop-blur-md shadow-xs rounded-full p-1 pl-2">
        {progressData && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 font-semibold text-xs">
            <StreakIcon size={16} />
            <span>
              {progressData.todayStudyMinutes > 0 && progressData.streak === 0
                ? 1
                : progressData.streak}
            </span>
          </div>
        )}

        <NotificationDropdown />

        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 rounded-full outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            <Avatar className="h-8 w-8 shadow-xs after:border-none">
              <AvatarImage
                src={user?.avatarUrl}
                seed={user?.email}
                alt={user?.fullName || user?.email || 'User'}
              />
              <AvatarFallback className="text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.fullName ||
                    (user?.email ? user.email.split('@')[0] : 'User')}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push(RouteEnum.SETTINGS)}
            >
              <Icons name="user" className="mr-2 h-4 w-4" />
              <span>{t('profile')}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={handleLogout}
              className="cursor-pointer"
            >
              <Icons name="log-out" className="mr-2 h-4 w-4" />
              <span>{t('logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
