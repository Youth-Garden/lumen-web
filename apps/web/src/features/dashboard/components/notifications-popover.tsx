'use client';

import React from 'react';
import { Icons } from '@lumen/uikit/icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  ScrollArea,
} from '@lumen/uikit/components';

const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    title: 'Streak Warning! 🔥',
    description: "You haven't practiced today. Don't lose your 12-day streak!",
    time: '2 hours ago',
    unread: true,
  },
  {
    id: '2',
    title: 'Weekly Goal Achieved 🏆',
    description: 'You reached 500 XP this week. Outstanding work!',
    time: '1 day ago',
    unread: false,
  },
  {
    id: '3',
    title: 'New Vocabulary Deck Available',
    description: 'The "Advanced Business English" deck has been added to your library.',
    time: '2 days ago',
    unread: false,
  },
];

export function NotificationsPopover() {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => n.unread).length;

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
            <span className="text-xs text-primary font-medium cursor-pointer hover:underline">
              Mark all as read
            </span>
          )}
        </div>
        <ScrollArea className="h-[300px]">
          {MOCK_NOTIFICATIONS.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No new notifications.
            </div>
          ) : (
            <div className="flex flex-col">
              {MOCK_NOTIFICATIONS.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex flex-col gap-1 p-4 border-b border-border transition-colors hover:bg-muted/50 cursor-pointer ${
                    notification.unread ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm">{notification.title}</span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {notification.time}
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
