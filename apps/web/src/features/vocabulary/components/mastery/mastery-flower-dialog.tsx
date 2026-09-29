'use client';

import {
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { PortalProps } from '@lumen/uikit/portal';
import { useTranslations } from 'next-intl';
import { PlantMasteryRing } from './plant-mastery-ring';

export interface MasteryFlowerDialogData {
  level: number; // 0 to 5
  term?: string;
  isWilted?: boolean;
}

export function MasteryFlowerDialog({
  isOpen,
  onDismiss,
  data,
}: PortalProps<MasteryFlowerDialogData>) {
  const t = useTranslations('Vocabulary.Mastery');
  const currentLevel = data?.level ?? 0;
  const isWilted = Boolean(data?.isWilted);

  const repetitionLevels = [
    { level: 1, title: t('level1Title'), time: t('level1Time') },
    { level: 2, title: t('level2Title'), time: t('level2Time') },
    { level: 3, title: t('level3Title'), time: t('level3Time') },
    { level: 4, title: t('level4Title'), time: t('level4Time') },
    { level: 5, title: t('level5Title'), time: t('level5Time') },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent className="sm:max-w-md max-h-[88vh] flex flex-col overflow-hidden">
        <DialogHeader align="center">
          <DialogTitle>{t('dialogTitle')}</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-1 space-y-4 text-left">
          {data?.term && (
            <Card
              variant="muted"
              size="sm"
              className="flex-row items-center gap-3 p-3"
            >
              <PlantMasteryRing
                level={currentLevel}
                isWilted={isWilted}
                size={44}
              />
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
            </Card>
          )}

          <div className="space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t('stage1Title')}
            </p>

            <div className="space-y-2">
              <Card
                variant="muted"
                size="sm"
                className="flex-row items-center gap-3 p-3"
              >
                <PlantMasteryRing level={0} size={38} />
                <div className="space-y-0.5 flex-1">
                  <p className="text-sm font-bold text-foreground">
                    {t('step1Title')}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t('step1Desc')}
                  </p>
                </div>
              </Card>

              <Card variant="muted" size="sm" className="p-4 space-y-3">
                <div className="flex items-center justify-around px-1 py-2">
                  {[1, 2, 3, 4, 5].map((stageLevel) => (
                    <div
                      key={stageLevel}
                      className="flex flex-col items-center gap-1"
                    >
                      <PlantMasteryRing
                        level={0}
                        learningStep={stageLevel}
                        size={54}
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-1 text-center pt-1">
                  <p className="text-sm font-bold text-foreground tracking-tight">
                    {t('step2Title')}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-xs mx-auto">
                    {t('step2Desc')}
                  </p>
                </div>
              </Card>

              <Card
                variant="muted"
                size="sm"
                className="flex-row items-center gap-3 p-3"
              >
                <PlantMasteryRing level={5} size={38} />
                <div className="space-y-0.5 flex-1">
                  <p className="text-sm font-bold text-foreground">
                    {t('step3Title')}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {t('step3Desc')}
                  </p>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center gap-2 text-primary font-bold text-xs sm:text-sm">
              <Icons name="sparkles" className="w-4 h-4" />
              <span>{t('stage2Title')}</span>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('stage2Desc')}
            </p>

            <Card
              variant="muted"
              size="sm"
              className="flex-row items-center gap-3 p-3"
            >
              <PlantMasteryRing level={5} isWilted size={40} />
              <div className="space-y-0.5 text-xs flex-1">
                <p className="font-bold text-foreground">
                  {t('waterPlantTitle')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('waterPlantDesc')}
                </p>
              </div>
            </Card>
          </div>

          {/* STAGE 3: 5 MEMORY LEVELS */}
          <div className="space-y-2 pt-1">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {t('stage3Title')}
            </p>

            <div className="flex items-end justify-around py-2 gap-1">
              {repetitionLevels.map((lvl) => {
                const isCurrent = lvl.level === currentLevel;

                return (
                  <div
                    key={lvl.level}
                    className={`flex flex-col items-center gap-1.5 transition-all ${
                      isCurrent ? 'opacity-100' : 'opacity-70'
                    }`}
                  >
                    {/* Ring only — no inner plant icon, shows 1→5 filled notches */}
                    <PlantMasteryRing
                      level={lvl.level}
                      size={44}
                      showInnerIcon={false}
                    />

                    <span
                      className={`text-[10px] leading-tight text-center ${
                        isCurrent
                          ? 'font-bold text-primary'
                          : 'font-medium text-muted-foreground'
                      }`}
                    >
                      {lvl.title}
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
            size="default"
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
