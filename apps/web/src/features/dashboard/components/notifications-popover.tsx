'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Icons } from '@lumen/uikit/icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  ScrollArea,
} from '@lumen/uikit/components';
import {
  useNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
} from '../hooks/use-notifications';

export function NotificationsPopover() {
  const { data, isLoading } = useNotifications();
  const { mutate: markAllRead } = useMarkAllNotificationsRead();
  const { mutate: markAsRead } = useMarkNotificationRead();

  const notifications = data?.data ?? [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        }
      >
        <Icons name="bell" className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-destructive border border-background"></span>
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0" sideOffset={8}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <span
              className="text-xs text-primary font-medium cursor-pointer hover:underline"
              onClick={() => markAllRead()}
            >
              Mark all as read
            </span>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full p-8">
              <Icons
                name="loader-2"
                className="h-5 w-5 animate-spin text-muted-foreground"
              />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 gap-2 text-center">
              <Icons name="bell" className="h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No notifications yet.
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex flex-col gap-1 p-4 border-b border-border transition-colors hover:bg-muted/50 cursor-pointer ${
                    !notification.isRead ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => {
                    if (!notification.isRead) markAsRead(notification.id);
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm">
                      {notification.title}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {notification.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t border-border">
          <Button variant="ghost" className="w-full text-xs h-8">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
