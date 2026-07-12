'use client';

import { Icons } from '@lumen/uikit/icons';
import {
  Input,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@lumen/uikit/components';
import { useRouter } from '@/shared/i18n/routing';
import { useAuthStore } from '@/store/auth.store';
import { RouteEnum } from '@/shared/constants';
import { useLogout } from '@/features/auth/hooks';
import { useUiStore } from '@/store/ui.store';
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
    <header className="flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-6 sticky top-0 z-50">
      <div className="flex items-center gap-4 flex-1">
        {/* Placeholder for future left-side items or breadcrumbs */}
      </div>
      <div className="flex items-center gap-4">
        {progressData && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-500 font-medium text-sm">
            <Icons name="flame" className="h-4 w-4" />
            <span>{progressData.streak}</span>
          </div>
        )}
        <NotificationsPopover />

        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-8 w-8 rounded-full outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            <Avatar className="h-8 w-8 border border-white/20 shadow-sm">
              <AvatarImage
                src={user?.avatarUrl}
                alt={user?.fullName || user?.email || 'Admin'}
              />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.fullName ||
                    (user?.email ? user.email.split('@')[0] : 'Admin')}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'admin@lumen.com'}
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
