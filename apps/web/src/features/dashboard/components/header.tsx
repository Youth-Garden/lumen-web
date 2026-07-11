'use client';

import { Icons } from '@lumen/uikit/icons';
import {
  Input,
  Button,
  ThemeSwitcher,
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
import { useTranslations } from 'next-intl';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { RouteEnum } from '@/shared/constants';
import { useLogout } from '@/features/auth/hooks';
import { useUiStore } from '@/store/ui.store';
import { useProgressDashboard } from '../hooks/use-progress-dashboard';

export function Header() {
  const t = useTranslations('Dashboard.Header');
  const user = useAuthStore((state) => state.user);
  const { logout } = useLogout();
  const { toggleSidebar } = useUiStore();
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
        <div className="relative w-full max-w-md hidden sm:flex group">
          <Icons
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors"
          />
          <Input
            type="search"
            placeholder={t('search')}
            className="w-full bg-muted/50 border-input pl-10 md:w-[300px] lg:w-[400px] focus:bg-background focus:border-primary transition-all rounded-full"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        {progressData && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-500 font-medium text-sm">
            <Icons name="flame" className="h-4 w-4" />
            <span>{progressData.streak}</span>
          </div>
        )}
        <Button variant="ghost" size="icon" className="relative">
          <Icons name="bell" className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive"></span>
        </Button>
        <ThemeSwitcher />

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
                  {user?.fullName || (user?.email ? user.email.split('@')[0] : 'Admin')}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'admin@lumen.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
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
