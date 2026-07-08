import { Search, Bell } from 'lucide-react';
import { Input, Button, ThemeSwitcher } from '@lumen/uikit/components';
import { useTranslations } from 'next-intl';

export function Header() {
  const t = useTranslations('Dashboard.Header');
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden sm:flex">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('search')}
            className="w-full bg-background pl-9 md:w-[300px] lg:w-[400px]"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive"></span>
        </Button>
        {/* We can use the actual theme switcher component here */}
        <ThemeSwitcher />
      </div>
    </header>
  );
}
