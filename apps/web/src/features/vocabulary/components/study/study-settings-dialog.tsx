'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { PortalProps } from '@lumen/uikit/portal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { PronunciationAccent } from '@/services/vocabulary/vocabulary.types';
import { useStudySettings } from '../../hooks/use-study-settings';

export function StudySettingsDialog({ isOpen, onDismiss }: PortalProps) {
  const t = useTranslations('Vocabulary.Study');
  const { settings, updateSettings } = useStudySettings();

  const cardCounts = [5, 10, 15, 20, 0];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent className="max-w-md p-6 overflow-hidden rounded-3xl border border-border/80 shadow-2xl bg-card space-y-6 z-[60]">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Icons name="settings" className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
                {t('settingsTitle')}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {t('settingsDescription')}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Card 1: Toggle Auto-play pronunciation */}
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 flex items-center justify-between gap-4 transition-colors hover:border-border/80">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Icons name="volume-2" className="h-4 w-4 text-primary" />
                <span>{t('autoPlayTitle')}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {t('autoPlayDescription')}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={settings.autoPlayAudio}
              onClick={() =>
                updateSettings({ autoPlayAudio: !settings.autoPlayAudio })
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                settings.autoPlayAudio ? 'bg-primary' : 'bg-muted/90'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow-sm ring-0 transition duration-200 ease-in-out ${
                  settings.autoPlayAudio ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Card 2: Pronunciation Accent (US vs UK) */}
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-3 transition-colors hover:border-border/80">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {t('accentTitle')}
              </p>
              <p className="text-xs text-muted-foreground">
                {t('accentUs')} / {t('accentUk')}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 bg-muted/50 p-1 rounded-xl border border-border/40">
              <Button
                type="button"
                variant={settings.accent === PronunciationAccent.US ? 'default' : 'subtle'}
                size="sm"
                onClick={() => updateSettings({ accent: PronunciationAccent.US })}
                className="gap-1.5 font-bold"
              >
                <span>🇺🇸 {t('accentUs')}</span>
              </Button>
              <Button
                type="button"
                variant={settings.accent === PronunciationAccent.UK ? 'default' : 'subtle'}
                size="sm"
                onClick={() => updateSettings({ accent: PronunciationAccent.UK })}
                className="gap-1.5 font-bold"
              >
                <span>🇬🇧 {t('accentUk')}</span>
              </Button>
            </div>
          </div>

          {/* Card 3: Max number of cards per session */}
          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4 space-y-3 transition-colors hover:border-border/80">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">
                {t('maxCardsTitle')}
              </p>
              <span className="text-xs text-primary font-bold px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                {settings.wordsPerSession === 0
                  ? t('allCards')
                  : t('cardsCount', { count: settings.wordsPerSession })}
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {cardCounts.map((count) => {
                const isSelected = settings.wordsPerSession === count;
                return (
                  <Button
                    key={count}
                    type="button"
                    variant={isSelected ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSettings({ wordsPerSession: count })}
                    className="font-bold"
                  >
                    {count === 0 ? t('allCards') : count}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 shadow-sm cursor-pointer"
            onClick={() => onDismiss?.()}
          >
            {t('done')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
