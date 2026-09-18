'use client';

import { Link, usePathname } from '@/shared/i18n/routing';
import { useTranslations } from 'next-intl';

import {
  Button,
  Logo,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@lumen/uikit/components';
import { Icons, type IconName } from '@lumen/uikit/icons';
import { cn } from '@lumen/uikit/utils';

import { RouteEnum } from '@/shared/constants';
import { useUiStore } from '@/store/ui.store';

interface NavItem {
  key: string;
  href: string;
  icon: IconName;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

const navigationGroups: NavGroup[] = [
  {
    group: 'Main',
    items: [
      { key: 'overview', href: RouteEnum.DASHBOARD, icon: 'overview' },
      { key: 'vocabulary', href: RouteEnum.VOCABULARY, icon: 'vocabulary' },
    ],
  },
  {
    group: 'System',
    items: [{ key: 'settings', href: RouteEnum.SETTINGS, icon: 'settings' }],
  },
];

// Khoảng padding ngang cố định của sidebar khi thu gọn (w-20 = 5rem).
// Dùng REM (không dùng px cứng) để luôn tỉ lệ đúng với w-20 / w-11 của Tailwind
// bất kể root font-size (zoom trình duyệt, fluid typography theo breakpoint...).
//   1.125rem (pad trái) + 2.75rem (w-11, ô icon) + 1.125rem (pad phải) = 5rem (w-20)
// -> icon luôn nằm đúng tâm 80px ở mọi kích thước màn hình.
const SIDEBAR_PADDING_X = 'px-[1.125rem]';

interface SidebarProps {
  defaultCollapsed?: boolean;
}

export function Sidebar({ defaultCollapsed }: SidebarProps) {
  const t = useTranslations('Dashboard.Sidebar');
  const pathname = usePathname();
  const { sidebarCollapsed: storeCollapsed, toggleSidebar } = useUiStore();
  const sidebarCollapsed =
    typeof window === 'undefined'
      ? (defaultCollapsed ?? storeCollapsed)
      : storeCollapsed;

  return (
    <nav
      id="sidebar"
      className={cn(
        'relative flex h-full flex-col bg-background rounded-3xl text-sidebar-foreground transition-[width] duration-300 ease-in-out z-20 overflow-hidden select-none',
        sidebarCollapsed ? 'w-20' : 'w-64',
      )}
    >
      {/* Top Header: Logo & Toggle Button */}
      <div
        className={cn(
          'relative flex h-20 shrink-0 items-center overflow-hidden w-full',
          SIDEBAR_PADDING_X,
        )}
      >
        {/* Logo — co lại về 0, KHÔNG toggle justify-content ở container cha */}
        <div
          className={cn(
            'flex items-center min-w-0 overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out',
            sidebarCollapsed
              ? 'max-w-0 opacity-0 pointer-events-none'
              : 'max-w-[150px] opacity-100 flex-1',
          )}
        >
          <Link
            href={RouteEnum.DASHBOARD}
            className="flex items-center gap-2 group whitespace-nowrap"
          >
            <Logo showText iconSize={28} />
          </Link>
        </div>

        {/* Toggle Button — luôn ml-auto (không toggle theo state), vị trí ổn định */}
        <div className="w-11 h-11 shrink-0 flex items-center justify-center ml-auto">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={toggleSidebar}
                  className="text-muted-foreground hover:text-foreground h-9 w-9 shrink-0 flex items-center justify-center"
                  aria-label={
                    sidebarCollapsed ? t('expandSidebar') : t('collapseSidebar')
                  }
                >
                  <Icons
                    name={
                      sidebarCollapsed ? 'panel-left-open' : 'panel-left-close'
                    }
                    className="h-5 w-5"
                  />
                </Button>
              }
            />
            <TooltipContent side="right" sideOffset={8}>
              {sidebarCollapsed ? t('expandSidebar') : t('collapseSidebar')}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Navigation List — padding cố định (rem), KHÔNG toggle items-center/justify-center */}
      <div
        className={cn(
          'flex-1 overflow-y-auto overflow-x-hidden min-h-0 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          SIDEBAR_PADDING_X,
        )}
      >
        <div
          className={cn(
            'flex flex-col w-full transition-[gap] duration-300 ease-in-out',
            // Collapsed: gap giữa các group PHẢI bằng gap giữa item trong group (gap-2)
            // để dàn icon đều nhau xuyên suốt. Expanded: group title hiện ra nên có thể
            // giữ khoảng cách rộng hơn (gap-3) để phân tách nhóm rõ ràng.
            sidebarCollapsed ? 'gap-2' : 'gap-3',
          )}
        >
          {navigationGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="flex flex-col w-full">
              {/* Group Title — dùng trick grid-template-rows 1fr/0fr thay vì max-height.
                  max-height bị "khựng nhịp" vì phải đoán 1 giá trị lớn hơn content thật
                  (max-h-6=24px trong khi chữ chỉ cao ~17px) -> nửa đầu transition không
                  thấy gì thay đổi, dồn hết chuyển động vào nửa sau. grid-template-rows
                  co theo đúng chiều cao thật của content nên mượt liên tục, không giật. */}
              <div
                className={cn(
                  'grid px-3 transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out',
                  sidebarCollapsed
                    ? 'grid-rows-[0fr] opacity-0 mb-0 pointer-events-none'
                    : 'grid-rows-[1fr] opacity-100 mb-1.5',
                )}
              >
                <div className="overflow-hidden min-w-0 whitespace-nowrap">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60 block">
                    {group.group}
                  </span>
                </div>
              </div>

              <ul
                className={cn(
                  'flex flex-col w-full transition-all duration-300',
                  sidebarCollapsed ? 'gap-2' : 'gap-1',
                )}
              >
                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== RouteEnum.DASHBOARD &&
                      pathname.startsWith(item.href));

                  const linkNode = (
                    <Link
                      href={item.href}
                      className={cn(
                        // Luôn w-full + items-center, KHÔNG bao giờ đổi thành w-11/justify-center.
                        // Icon giữ nguyên vị trí neo trái tuyệt đối trong suốt animation.
                        'flex items-center h-11 w-full rounded-2xl transition-colors duration-200 outline-none text-sm font-medium overflow-hidden',
                        isActive
                          ? 'bg-primary/15 text-primary font-bold'
                          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                      )}
                    >
                      {/* Icon: ô cố định 44x44 (w-11 h-11), shrink-0 -> không bao giờ bị co/nhảy */}
                      <div className="w-11 h-11 shrink-0 flex items-center justify-center">
                        <Icons
                          name={item.icon}
                          className={cn(
                            'h-5 w-5 shrink-0 transition-colors',
                            isActive && 'text-primary',
                          )}
                        />
                      </div>

                      {/* Label: chỉ phần này co giãn, không ảnh hưởng vị trí icon */}
                      <span
                        className={cn(
                          'whitespace-nowrap truncate font-medium text-sm min-w-0 transition-[max-width,opacity,padding] duration-300 ease-in-out',
                          sidebarCollapsed
                            ? 'max-w-0 opacity-0 pointer-events-none px-0'
                            : 'max-w-[150px] opacity-100 pr-3 pl-1',
                        )}
                      >
                        {t(item.key)}
                      </span>
                    </Link>
                  );

                  return (
                    <li key={item.key} className="w-full">
                      {sidebarCollapsed ? (
                        <Tooltip>
                          <TooltipTrigger render={linkNode} />
                          <TooltipContent side="right" sideOffset={8}>
                            {t(item.key)}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        linkNode
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}
