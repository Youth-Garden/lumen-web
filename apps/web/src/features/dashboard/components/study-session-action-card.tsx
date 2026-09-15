'use client';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useRouter } from 'next/navigation';
import React from 'react';

interface StudySessionActionCardProps {
  dueCount: number;
  todayStudyMinutes: number;
  dailyGoalMinutes: number;
  streak: number;
  isLoading?: boolean;
}

export function StudySessionActionCard({
  dueCount,
  todayStudyMinutes,
  dailyGoalMinutes,
  streak,
  isLoading = false,
}: StudySessionActionCardProps) {
  const router = useRouter();
  const safeGoal = Math.max(dailyGoalMinutes, 1);
  const goalPercent = Math.min(100, Math.round((todayStudyMinutes / safeGoal) * 100));

  if (isLoading) {
    return (
      <Card className="rounded-3xl border-none bg-card shadow-xs p-6 space-y-4 h-full flex flex-col justify-between">
        <Skeleton className="h-6 w-36 rounded-lg" />
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </Card>
    );
  }

  return (
    <Card className="rounded-3xl border-none bg-card shadow-xs overflow-hidden h-full flex flex-col justify-between">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icons name="sparkles" className="h-4 w-4" />
              </div>
              <CardTitle className="text-base font-bold font-heading text-foreground">
                Kế hoạch hôm nay
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground">
              Duy trì chuỗi và hoàn thành mục tiêu
            </CardDescription>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary flex items-center gap-1">
            <Icons name="flame" className="h-3 w-3 text-orange-500" />
            {streak} ngày
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-1 flex-1 flex flex-col justify-between">
        {/* Daily Goal Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Mục tiêu hàng ngày</span>
            <span className="font-bold text-foreground">
              {todayStudyMinutes}/{dailyGoalMinutes}m{' '}
              <span className="text-muted-foreground font-normal">
                ({goalPercent}%)
              </span>
            </span>
          </div>
          <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
        </div>

        {/* Due Cards Status Prompt */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/40">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-foreground">
              {dueCount > 0 ? `${dueCount} thẻ đến hạn` : 'Tất cả thẻ đã xong'}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {dueCount > 0
                ? 'Cần củng cố trí nhớ ngắt quãng'
                : 'Bạn đã hoàn thành tốt mục tiêu'}
            </p>
          </div>

          <div
            className={`flex h-8 w-8 items-center justify-center rounded-xl ${
              dueCount > 0
                ? 'bg-warning/15 text-warning'
                : 'bg-success/15 text-success'
            }`}
          >
            <Icons
              name={dueCount > 0 ? 'clock' : 'check'}
              className="h-4 w-4"
            />
          </div>
        </div>

        {/* Action Button */}
        {dueCount > 0 ? (
          <Button
            variant="default"
            onClick={() => router.push('/study')}
            className="w-full"
          >
            <Icons name="play" className="h-4 w-4 mr-1.5" />
            Ôn tập ngay ({dueCount} thẻ)
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => router.push('/vocabulary')}
            className="w-full"
          >
            <Icons name="book-open" className="h-4 w-4 mr-1.5" />
            Khám phá từ mới
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
