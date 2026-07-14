'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ScrollArea,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useTranslations } from 'next-intl';
import { formatDistanceToNow } from 'date-fns';
import {
  useMarkAllAsRead,
  useMarkAsRead,
  useNotifications,
} from '../hooks/use-notification';
import { useState } from 'react';

export const NotificationDropdown = () => {
  const t = useTranslations('Common');
  const [open, setOpen] = useState(false);

  const { data: notifications = [] } = useNotifications();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } = useMarkAllAsRead();

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string, isRead: boolean) => {
    if (!isRead) {
      markAsRead(id);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className="relative outline-none focus-visible:ring-2 focus-visible:ring-primary inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-10 w-10">
        <Icons name="bell" className="h-5 w-5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="font-semibold">{t('notifications')}</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-primary"
              onClick={() => markAllAsRead()}
              disabled={isMarkingAll}
            >
              {t('markAllAsRead')}
            </Button>
          )}
        </div>
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Icons name="bell" className="mb-2 h-8 w-8 opacity-20" />
              <p className="text-sm">{t('noNotifications')}</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex flex-col gap-1 border-b px-4 py-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                    !notification.isRead ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => {
                    handleMarkAsRead(notification.id, notification.isRead);
                    // Add routing logic here if notifications start having actionUrls
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-sm font-medium ${
                        !notification.isRead
                          ? 'text-foreground'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {notification.title}
                    </span>
                    {!notification.isRead && (
                      <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {notification.description}
                  </p>
                  <span className="text-[10px] text-muted-foreground/80 mt-1">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
