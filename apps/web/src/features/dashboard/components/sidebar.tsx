"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Command, 
  LayoutDashboard, 
  Users, 
  Settings, 
  PieChart, 
  CreditCard,
  LogOut,
  ChevronUp,
  User as UserIcon,
  Book,
  Layers,
  Brain,
  FileQuestion,
  Headphones,
  Newspaper,
  Mic
} from 'lucide-react';

import { 
  Button, 
  ScrollArea,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@lumen/uikit/components';
import { RouteEnum } from '@/shared/constants';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';
import { cn } from '@lumen/uikit/utils';

import { useTranslations } from 'next-intl';

const navigationKeys = [
  { key: 'overview', href: RouteEnum.DASHBOARD, icon: LayoutDashboard },
  { key: 'study', href: RouteEnum.STUDY, icon: Brain },
  { key: 'quiz', href: RouteEnum.QUIZ, icon: FileQuestion },
  { key: 'vocabulary', href: RouteEnum.VOCABULARY, icon: Book },
  { key: 'decks', href: RouteEnum.DECKS, icon: Layers },
  { key: 'toeic', href: RouteEnum.TOEIC, icon: Headphones },
  { key: 'reading', href: RouteEnum.READING, icon: Newspaper },
  { key: 'dictation', href: RouteEnum.DICTATION, icon: Mic },
  { key: 'settings', href: RouteEnum.SETTINGS, icon: Settings },
];

export function Sidebar() {
  const t = useTranslations('Dashboard.Sidebar');
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push(RouteEnum.LOGIN);
  };

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-card text-card-foreground">
      <div className="p-6">
        <Link href={RouteEnum.DASHBOARD} className="flex items-center gap-2 font-bold text-xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Command className="h-5 w-5" />
          </div>
          Lumen
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
                  className={cn("w-full justify-start gap-3", isActive ? "font-semibold" : "text-muted-foreground")}
                >
                  <item.icon className="h-5 w-5" />
                  {t(item.key)}
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <div className="p-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="w-full justify-start gap-3 h-14 px-2">
                <Avatar className="h-9 w-9 border border-border">
                  <AvatarImage src="https://github.com/shadcn.png" alt="@lumen" />
                  <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left flex-1 overflow-hidden">
                  <span className="text-sm font-medium leading-none mb-1 truncate w-full">
                    {user?.email ? user.email.split('@')[0] : 'Admin'}
                  </span>
                  <span className="text-xs text-muted-foreground truncate w-full">
                    {user?.email || 'admin@lumen.com'}
                  </span>
                </div>
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              </Button>
            }
          />
          <DropdownMenuContent className="w-56" align="end" side="top">
            <DropdownMenuLabel>{t('myAccount')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>{t('profile')}</DropdownMenuItem>
            <DropdownMenuItem>{t('settings')}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('logout')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
