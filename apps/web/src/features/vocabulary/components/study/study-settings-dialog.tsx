'use client';

import React from 'react';
import { PortalProps } from '@lumen/uikit/portal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { PronunciationAccent } from '@/services/vocabulary/vocabulary.types';
import {
  useStudySettings,
  LessonQuotaPreset,
  LESSON_QUOTA_CONFIGS,
} from '../../hooks/use-study-settings';

export function StudySettingsDialog({ isOpen, onDismiss }: PortalProps) {
  const { settings, updateSettings } = useStudySettings();

  const presets: LessonQuotaPreset[] = ['FEW', 'MODERATE', 'MANY', 'A_LOT'];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent className="max-w-md p-5 sm:p-6 rounded-3xl border border-border/80 shadow-xl bg-card space-y-5 z-[60]">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
            Cài đặt bài học
          </DialogTitle>
        </DialogHeader>

        {/* 1. Số lượng câu hỏi mỗi bài */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Số lượng câu hỏi mỗi bài
          </p>
          <div className="grid grid-cols-2 gap-2">
            {presets.map((presetKey) => {
              const config = LESSON_QUOTA_CONFIGS[presetKey];
              const isSelected = settings.lessonQuotaPreset === presetKey;

              return (
                <button
                  key={presetKey}
                  type="button"
                  onClick={() =>
                    updateSettings({
                      lessonQuotaPreset: presetKey,
                      wordsPerSession: config.targetCount,
                    })
                  }
                  className={`px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border flex items-center justify-between ${
                    isSelected
                      ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                      : 'bg-muted/30 hover:bg-muted/60 text-foreground border-border/60'
                  }`}
                >
                  <span>{config.label}</span>
                  <span className={isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}>
                    {config.rangeText.replace(' questions', '')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Tự động phát âm */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 border border-border/50">
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Icons name="volume-2" className="w-4 h-4 text-primary" />
              <span>Tự động phát âm</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Phát âm thanh ngay khi mở thẻ
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={settings.autoPlayAudio}
            onClick={() =>
              updateSettings({ autoPlayAudio: !settings.autoPlayAudio })
            }
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
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

        {/* 3. Giọng phát âm mặc định */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Giọng phát âm mặc định
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              type="button"
              variant={settings.accent === PronunciationAccent.US ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSettings({ accent: PronunciationAccent.US })}
              className="h-9 font-semibold cursor-pointer rounded-xl"
            >
              <span>US (Anh - Mỹ)</span>
            </Button>

            <Button
              type="button"
              variant={settings.accent === PronunciationAccent.UK ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateSettings({ accent: PronunciationAccent.UK })}
              className="h-9 font-semibold cursor-pointer rounded-xl"
            >
              <span>UK (Anh - Anh)</span>
            </Button>
          </div>
        </div>

        {/* Footer: Done button */}
        <Button
          onClick={() => onDismiss?.()}
          className="w-full h-10 font-bold rounded-xl cursor-pointer"
        >
          Xong
        </Button>
      </DialogContent>
    </Dialog>
  );
}
