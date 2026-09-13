'use client';

import { useLogout } from '@/features/auth/hooks';
import { NotificationDropdown } from '@/features/notification/components/notification-dropdown';
import { RouteEnum } from '@/shared/constants';
import { useRouter } from '@/shared/i18n/routing';
import { useAuthStore } from '@/store/auth.store';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@lumen/uikit/components';
import { CommandPalette } from '@/shared/components/command-palette';
import { usePortal } from '@lumen/uikit/portal';
import { Icons } from '@lumen/uikit/icons';
import { useProgressDashboard } from '../hooks/use-progress-dashboard';

export function Header() {
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
      <button
        type="button"
        onClick={() => presentCommandPalette()}
        className="flex items-center justify-between w-60 sm:w-72 md:w-84 h-10 px-3.5 rounded-2xl bg-card/90 backdrop-blur-md border border-border/70 hover:border-primary/50 shadow-xs text-muted-foreground hover:text-foreground text-xs transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-primary/30"
        title="Search (Ctrl + K)"
      >
        <div className="flex items-center gap-2.5">
          <Icons
            name="search"
            className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0"
          />
          <span className="font-medium text-xs text-muted-foreground/80 group-hover:text-foreground transition-colors">
            Search folders, words...
          </span>
        </div>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded-md border border-border/80 bg-muted/60 px-1.5 font-mono text-[10px] font-semibold text-muted-foreground shadow-2xs">
          <span>Ctrl</span>
          <span>K</span>
        </kbd>
      </button>

      <div className="flex items-center gap-2 bg-card/90 backdrop-blur-md border border-border/60 shadow-xs rounded-full p-1 pl-2">
        {progressData && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 font-semibold text-xs">
            <span className="text-sm select-none leading-none">🔥</span>
            <span>{progressData.streak}</span>
          </div>
        )}

        <NotificationDropdown />

        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 rounded-full outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            <Avatar className="h-8 w-8 border border-border/80 shadow-xs">
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
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={handleLogout}
              className="cursor-pointer"
            >
              <Icons name="log-out" className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
