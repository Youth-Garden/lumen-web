import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Avatar, AvatarFallback, AvatarImage } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useLeaderboard } from '../hooks/use-leaderboard';
import { useTranslations } from 'next-intl';

export const Leaderboard = () => {
  const t = useTranslations('Gamification.Leaderboard');
  const { data: leaderboard, isLoading } = useLeaderboard();

  if (isLoading) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center bg-background/40 backdrop-blur-md">
        <Icons name="loader-2" className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  const topUsers = leaderboard?.topUsers || [];

  return (
    <Card className="bg-background/40 backdrop-blur-md border-white/10 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icons name="trophy" className="h-6 w-6 text-yellow-500" />
          <CardTitle>{t('title')}</CardTitle>
        </div>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topUsers.map((user, index) => {
            const isTop3 = index < 3;
            return (
              <div
                key={user.userId}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 font-bold">
                    {index === 0 && <Icons name="award" className="text-yellow-500 w-7 h-7" />}
                    {index === 1 && <Icons name="award" className="text-gray-400 w-7 h-7" />}
                    {index === 2 && <Icons name="award" className="text-amber-600 w-7 h-7" />}
                    {index > 2 && <span className="text-muted-foreground text-sm">#{index + 1}</span>}
                  </div>
                  <Avatar className="h-10 w-10 border border-white/10">
                    <AvatarImage src={user.avatarUrl || ''} />
                    <AvatarFallback>{user.fullName?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm">
                      {user.fullName || t('anonymous')}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Icons name="flame" className="w-3 h-3 text-orange-500" /> {user.streak} {t('dayStreak')}
                    </span>
                  </div>
                </div>
                <div className="font-bold text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                  {user.totalPoints} {t('xp')}
                </div>
              </div>
            );
          })}

          {topUsers.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              {t('empty')}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
