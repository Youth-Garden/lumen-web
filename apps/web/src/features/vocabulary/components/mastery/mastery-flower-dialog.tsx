'use client';

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@lumen/uikit/components';
import { PortalProps } from '@lumen/uikit/portal';
import { PlantGrowthIcon } from '@lumen/uikit/icons';

export interface MasteryFlowerDialogData {
  term?: string;
  level?: number;
}

export function MasteryFlowerDialog({
  isOpen,
  onDismiss,
  data,
}: PortalProps<MasteryFlowerDialogData>) {
  const currentLevel = data?.level || 1;

  const levels = [
    { title: 'Just learned', desc: '1st review', stageName: 'Sprout' },
    { title: 'Temporary', desc: '1 day', stageName: 'Seedling' },
    { title: 'Lasting memory', desc: '3 days', stageName: 'Growing' },
    { title: 'Memorized', desc: '1 week', stageName: 'Budding' },
    { title: 'Proficient', desc: '1 month+', stageName: 'Full Bloom' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent className="max-w-lg p-6 rounded-3xl border border-border/80 shadow-2xl bg-card space-y-5 z-[60]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black tracking-tight text-foreground flex items-center gap-2">
            <span>Memory Level & Spaced Repetition</span>
            <PlantGrowthIcon stage={5} className="w-6 h-6" />
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Are you afraid of forgetting after studying? Don&apos;t worry! Lumen
          uses the{' '}
          <strong className="text-primary font-bold">
            Spaced Repetition (SM-2)
          </strong>{' '}
          method to schedule review sessions at the optimal moment right before
          memory fades.
        </p>

        {/* Current Word Container with Plant Stage */}
        <div className="rounded-2xl border border-border/60 bg-muted/40 p-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-xs">
            <PlantGrowthIcon stage={currentLevel} className="w-11 h-11" />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">
              {data?.term ? `"${data.term}"` : 'Current Word'}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Current level:{' '}
              <span className="font-semibold text-primary">
                Level {currentLevel} / 5
              </span>{' '}
              ({levels[currentLevel - 1]?.title || 'Just learned'} &bull;{' '}
              <span className="text-foreground/80 font-medium">
                {levels[currentLevel - 1]?.stageName}
              </span>
              )
            </p>
          </div>
        </div>

        {/* 5 Growth Stages Visualization */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            5 Mastery Growth Stages:
          </p>
          <div className="grid grid-cols-5 gap-2 text-center">
            {levels.map((lvl, idx) => {
              const stageNum = idx + 1;
              const isPassed = stageNum <= currentLevel;
              const isCurrent = stageNum === currentLevel;
              return (
                <div
                  key={idx}
                  className={`p-2 rounded-2xl border flex flex-col items-center justify-between transition-all ${
                    isCurrent
                      ? 'border-primary bg-primary/10 shadow-xs ring-1 ring-primary/40'
                      : isPassed
                        ? 'border-primary/40 bg-primary/5'
                        : 'border-border/40 bg-muted/20 opacity-60'
                  }`}
                >
                  {/* Plant Stage Illustration */}
                  <div className="w-10 h-10 flex items-center justify-center my-0.5">
                    <PlantGrowthIcon stage={stageNum} className="w-9 h-9" />
                  </div>

                  <span
                    className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : isPassed
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {stageNum}
                  </span>

                  <p className="text-[10px] font-bold text-foreground mt-1 truncate max-w-full">
                    {lvl.title}
                  </p>
                  <p className="text-[9px] text-muted-foreground">{lvl.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Review intervals expand as your recall strengthens, from 2 hours up to
          several months until the word reaches{' '}
          <strong className="text-foreground font-semibold">
            &quot;Proficient&quot;
          </strong>
          . Water your garden by reviewing cards on schedule to keep all flowers
          blooming! 🌻✨
        </p>

        <DialogFooter>
          <Button
            type="button"
            className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-10 shadow-xs cursor-pointer"
            onClick={() => onDismiss?.()}
          >
            I understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
