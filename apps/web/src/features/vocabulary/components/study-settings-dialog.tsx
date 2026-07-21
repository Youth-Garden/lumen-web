import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@lumen/uikit/components';
import { Icons } from '@lumen/uikit/icons';
import { RouteEnum } from '@/shared/constants';

interface StudySettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  deckId: string;
  totalCards: number;
}

export function StudySettingsDialog({
  isOpen,
  onClose,
  deckId,
  totalCards,
}: StudySettingsDialogProps) {
  const t = useTranslations('Vocabulary.StudySettings');
  const router = useRouter();
  const [limit, setLimit] = useState<number>(20);

  const handleStart = () => {
    onClose();
    const url = new URL(window.location.origin + RouteEnum.STUDY);
    url.searchParams.set('deckId', deckId);
    url.searchParams.set('limit', limit.toString());
    router.push(url.pathname + url.search);
  };

  const options = [10, 20, 50, totalCards];
  // Deduplicate and sort
  const uniqueOptions = Array.from(new Set(options)).sort((a, b) => a - b);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('title') || 'Study Settings'}</DialogTitle>
          <DialogDescription>
            {t('description') || 'How many cards do you want to learn in this session?'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {uniqueOptions.map((opt) => (
            <Button
              key={opt}
              variant={limit === opt ? 'default' : 'outline'}
              className="h-20 flex flex-col gap-2"
              onClick={() => setLimit(opt)}
              disabled={opt !== totalCards && opt > totalCards && totalCards > 0}
            >
              <span className="text-2xl font-bold">
                {opt === totalCards && opt !== 10 && opt !== 20 && opt !== 50 ? 'All' : opt}
              </span>
              <span className="text-xs font-normal opacity-80">
                {opt === totalCards && opt !== 10 && opt !== 20 && opt !== 50 ? `${totalCards} cards` : 'cards'}
              </span>
            </Button>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t('cancel') || 'Cancel'}
          </Button>
          <Button onClick={handleStart} className="gap-2">
            <Icons name="play" className="h-4 w-4" />
            {t('start') || 'Start Learning'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
