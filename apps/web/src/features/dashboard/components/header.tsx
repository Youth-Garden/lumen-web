'use client';

import { useLogout } from '@/features/auth/hooks';
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
import { Icons } from '@lumen/uikit/icons';
import { useProgressDashboard } from '../hooks/use-progress-dashboard';
import { NotificationsPopover } from './notifications-popover';

export function Header() {
  const user = useAuthStore((state) => state.user);
  const { logout } = useLogout();
  const router = useRouter();
  const { data: progressData } = useProgressDashboard();

  const handleLogout = async () => {
    await logout();
    router.push(RouteEnum.LOGIN);
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
      className="absolute top-4 right-5 z-50 flex items-center gap-2"
    >
      {progressData && (
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-500 font-medium text-sm">
          <Icons name="flame" className="h-3.5 w-3.5" />
          <span>{progressData.streak}</span>
        </div>
      )}

      <NotificationsPopover />

      <DropdownMenu>
        <DropdownMenuTrigger className="h-8 w-8 rounded-full outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
          <Avatar className="h-8 w-8 border border-border shadow-sm">
            <AvatarImage
              src={user?.avatarUrl}
              seed={user?.email}
              alt={user?.fullName || user?.email || 'User'}
            />
            <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
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
    </header>
  );
}
