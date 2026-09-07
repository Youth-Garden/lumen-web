'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { PlantGrowthIcon } from '@lumen/uikit/icons';
import { PortalProps } from '@lumen/uikit/portal';
import { useTranslations } from 'next-intl';

export interface MasteryFlowerDialogData {
  term?: string;
  level?: number;
}

export function MasteryFlowerDialog({
  isOpen,
  onDismiss,
  data,
}: PortalProps<MasteryFlowerDialogData>) {
  const t = useTranslations('Vocabulary.Mastery');
  const currentLevel = data?.level ?? 0;

  const repetitionLevels = [
    { level: 1, title: t('level1Title'), time: t('level1Time') },
    { level: 2, title: t('level2Title'), time: t('level2Time') },
    { level: 3, title: t('level3Title'), time: t('level3Time') },
    { level: 4, title: t('level4Title'), time: t('level4Time') },
    { level: 5, title: t('level5Title'), time: t('level5Time') },
  ];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && onDismiss?.()}
    >
      <DialogContent className="max-w-md max-h-[88vh] p-6 rounded-xl border-none shadow-2xl bg-card flex flex-col overflow-hidden transition-all duration-200">
        <DialogHeader className="pb-2 shrink-0 text-left">
          <DialogTitle className="text-lg font-bold text-foreground">
            {t('dialogTitle')}
          </DialogTitle>
          <p className="text-xs text-muted-foreground pt-0.5">
            {t('dialogDescription')}
          </p>
        </DialogHeader>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-left">
          {/* CURRENT WORD STATUS (if opened for a specific word) */}
          {data?.term && (
            <div className="flex items-center gap-3 py-1">
              <PlantGrowthIcon stage={currentLevel} className="w-10 h-10" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-foreground truncate">
                  &ldquo;{data.term}&rdquo;
                </p>
                {currentLevel === 0 ? (
                  <>
                    <p className="text-xs text-muted-foreground">
                      {t('currentStatus')}{' '}
                      <span className="font-bold text-primary">
                        {t('notLearnedSeed')}
                      </span>
                    </p>
                    <p className="text-[11px] text-muted-foreground/80">
                      {t('seedHint')}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-muted-foreground">
                      {t('memoryLevel', {
                        level: currentLevel,
                        title: repetitionLevels[currentLevel - 1]?.title,
                      })}
                    </p>
                    <p className="text-[11px] text-muted-foreground/80">
                      {t('nextOptimalReview', {
                        time: repetitionLevels[currentLevel - 1]?.time,
                      })}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* STAGE 1: NEW WORD LEARNING */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t('stage1Title')}
            </p>

            <div className="space-y-2">
              {/* Step 1: Not learned */}
              <div className="flex items-start gap-3">
                <PlantGrowthIcon stage={0} className="w-8 h-8 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-foreground">
                    {t('step1Title')}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t('step1Desc')}
                  </p>
                </div>
              </div>

              {/* Transition arrow */}
              <div className="flex justify-center text-primary/70">
                <Icons name="arrow-down" className="w-4 h-4" />
              </div>

              {/* Step 2: In learning */}
              <div className="flex items-start gap-3">
                <PlantGrowthIcon stage={2} className="w-8 h-8 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-foreground">
                    {t('step2Title')}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t('step2Desc')}
                  </p>
                </div>
              </div>

              {/* Transition arrow */}
              <div className="flex justify-center text-primary/70">
                <Icons name="arrow-down" className="w-4 h-4" />
              </div>

              {/* Step 3: Finished */}
              <div className="flex items-start gap-3">
                <PlantGrowthIcon stage={5} className="w-8 h-8 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-foreground">
                    {t('step3Title')}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t('step3Desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* STAGE 2: SPACED REPETITION */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2 text-primary font-bold text-xs sm:text-sm">
              <Icons name="sparkles" className="w-4 h-4" />
              <span>{t('stage2Title')}</span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('stage2Desc')}
            </p>

            <div className="flex items-start gap-3 py-1">
              <PlantGrowthIcon stage={5} isWilted className="w-8 h-8 mt-0.5" />
              <div className="space-y-0.5 text-xs">
                <p className="font-bold text-foreground">
                  {t('waterPlantTitle')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('waterPlantDesc')}
                </p>
              </div>
            </div>
          </div>

          {/* STAGE 3: 5 MEMORY LEVELS */}
          <div className="space-y-2 pt-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t('stage3Title')}
            </p>

            <div className="grid grid-cols-5 gap-1.5 text-center py-1">
              {repetitionLevels.map((lvl) => {
                const isCurrent = lvl.level === currentLevel;

                return (
                  <div
                    key={lvl.level}
                    className={`p-2 rounded-lg flex flex-col items-center justify-between gap-1 transition-all ${
                      isCurrent ? 'bg-primary/10' : 'bg-transparent'
                    }`}
                  >
                    {/* Ring showing level/5 segments */}
                    <div className="relative w-8 h-8 flex items-center justify-center">
                      <PlantGrowthIcon stage={lvl.level} className="w-7 h-7" />
                    </div>

                    <span
                      className={`text-xs ${
                        isCurrent
                          ? 'font-bold text-primary'
                          : 'font-medium text-foreground'
                      }`}
                    >
                      {lvl.level}. {lvl.title}
                    </span>

                    <span className="text-[10px] text-muted-foreground">
                      {lvl.time}
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="text-[11px] text-muted-foreground text-center pt-1 leading-relaxed">
              {t('intervalNote')}
            </p>

            <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
              {t('masteryNote')}
            </p>
          </div>
        </div>

        {/* FOOTER BUTTON */}
        <div className="pt-3 shrink-0">
          <Button
            variant="default"
            className="w-full"
            onClick={() => onDismiss?.()}
          >
            {t('understandBtn')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
