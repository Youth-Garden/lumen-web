'use client';

import { useState } from 'react';
import { Card, Button } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';

export function NotificationPromptCard() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <Card className="rounded-3xl border-none bg-card p-5 shadow-sm space-y-3.5 relative overflow-hidden">
      <div className="flex items-start gap-3.5">
        <div className="h-10 w-10 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
          <Icons name="bell" className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-foreground leading-relaxed">
            Bật thông báo để Lumen nhắc nhở bạn ôn tập từ vựng đúng thời điểm vàng ghi nhớ!
          </p>
        </div>
      </div>

      <Button
        size="sm"
        variant={isEnabled ? 'subtle' : 'default'}
        onClick={() => setIsEnabled(!isEnabled)}
        className="w-full text-xs font-bold h-9 cursor-pointer"
      >
        {isEnabled ? 'Đã bật thông báo' : 'Bật thông báo'}
      </Button>
    </Card>
  );
}
