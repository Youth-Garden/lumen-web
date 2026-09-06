'use client';

import { Button, Card } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';

interface SentencePracticeCardProps {
  usedCount?: number;
  totalWords?: number;
  onClick?: () => void;
}

export function SentencePracticeCard({
  usedCount = 12,
  totalWords = 608,
  onClick,
}: SentencePracticeCardProps) {
  return (
    <Card className="rounded-3xl border-none bg-card p-5 shadow-sm space-y-3">
      <div>
        <h4 className="text-sm font-bold text-foreground">Học qua thực hành</h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          {usedCount}/{totalWords} từ vựng đã được ứng dụng trong mẫu câu thực
          tế
        </p>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={onClick}
        className="w-full gap-2 font-bold"
      >
        <Icons name="edit-3" className="h-3.5 w-3.5 text-primary" />
        <span>Luyện viết câu</span>
      </Button>
    </Card>
  );
}
