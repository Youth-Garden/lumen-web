import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { useBadges } from '../hooks/use-badges';
import { useProgressDashboard } from '../hooks/use-progress-dashboard';
import { cn } from '@lumen/uikit/utils';
import { useTranslations } from 'next-intl';

export const BadgesList = () => {
  const t = useTranslations('Gamification.Badges');
  const { data: allBadges, isLoading: loadingBadges } = useBadges();
  const { data: progress } = useProgressDashboard();
  
  if (loadingBadges) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center bg-background/40 backdrop-blur-md">
        <Icons name="loader-2" className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  // Fallback to checking local storage if backend hasn't provided progress (e.g., error fetching or initial state)
  // Actually, we rely on progress data to know unlocked badges.
  const unlockedBadges = progress?.unlockedBadges || [];

  return (
    <Card className="bg-background/40 backdrop-blur-md border-white/10 shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icons name="award" className="h-6 w-6 text-primary" />
          <CardTitle>{t('title')}</CardTitle>
        </div>
        <CardDescription>{t('description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allBadges?.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.code);
            return (
              <div
                key={badge.code}
                className={cn(
                  'flex flex-col items-center text-center p-4 rounded-xl transition-all duration-300',
                  isUnlocked
                    ? 'bg-primary/10 border border-primary/20 shadow-md shadow-primary/5 hover:-translate-y-1'
                    : 'bg-muted/30 opacity-60 grayscale hover:grayscale-0 cursor-not-allowed',
                )}
              >
                <div
                  className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center mb-3',
                    isUnlocked ? 'bg-primary text-primary-foreground' : 'bg-muted-foreground/20 text-muted-foreground',
                  )}
                >
                  <Icons name={badge.icon as any} className="w-8 h-8" />
                </div>
                <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                <p className="text-xs text-muted-foreground leading-tight">
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
