'use client';

import {
  Button,
  Dialog,
  DialogContent,
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
  const currentLevel = Math.min(5, Math.max(1, data?.level || 1));

  const levels = [
    { title: 'Mới học', time: 'Lần 1' },
    { title: 'Nhớ tạm', time: '1 ngày' },
    { title: 'Ghi nhớ', time: '3 ngày' },
    { title: 'Khắc sâu', time: '1 tuần' },
    { title: 'Thành thạo', time: '1 tháng+' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent className="max-w-md p-5 sm:p-6 rounded-3xl border-none shadow-2xl bg-card space-y-4 z-[60]">
        <DialogHeader className="pb-1">
          <DialogTitle className="text-base sm:text-lg font-bold text-foreground">
            Cấp độ ghi nhớ & Lặp lại ngắt quãng
          </DialogTitle>
        </DialogHeader>

        {/* Current Word Status */}
        {data?.term && (
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-muted/40">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <PlantGrowthIcon stage={currentLevel} className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">&quot;{data.term}&quot;</p>
              <p className="text-xs text-muted-foreground">
                Cấp độ hiện tại:{' '}
                <span className="font-bold text-primary">
                  Cấp {currentLevel}/5
                </span>{' '}
                ({levels[currentLevel - 1].title})
              </p>
            </div>
          </div>
        )}

        {/* 5 Growth Stages */}
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            5 Cấp độ ghi nhớ
          </p>
          <div className="grid grid-cols-5 gap-1.5 text-center">
            {levels.map((lvl, idx) => {
              const stageNum = idx + 1;
              const isCurrent = stageNum === currentLevel;
              const isPassed = stageNum <= currentLevel;

              return (
                <div
                  key={idx}
                  className={`p-2 rounded-2xl flex flex-col items-center justify-between gap-1 transition-all ${
                    isCurrent
                      ? 'bg-primary/15 shadow-xs'
                      : isPassed
                        ? 'bg-primary/5'
                        : 'bg-muted/30 opacity-60'
                  }`}
                >
                  <div className="w-8 h-8 flex items-center justify-center">
                    <PlantGrowthIcon stage={stageNum} className="w-7 h-7" />
                  </div>

                  <span
                    className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                      isCurrent
                        ? 'bg-primary text-primary-foreground'
                        : isPassed
                          ? 'bg-primary/20 text-primary'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {stageNum}
                  </span>

                  <span className="text-[11px] font-bold text-foreground truncate w-full">
                    {lvl.title}
                  </span>

                  <span className="text-[10px] text-muted-foreground">
                    {lvl.time}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 1 Sentence Explanation */}
        <p className="text-xs text-muted-foreground text-center leading-relaxed">
          Hệ thống tự động nhắc bạn ôn tập vào thời điểm vàng để từ vựng được ghi nhớ lâu dài.
        </p>

        {/* Footer Button */}
        <Button
          onClick={() => onDismiss?.()}
          className="w-full h-10 font-bold rounded-xl cursor-pointer"
        >
          Đã hiểu
        </Button>
      </DialogContent>
    </Dialog>
  );
}
