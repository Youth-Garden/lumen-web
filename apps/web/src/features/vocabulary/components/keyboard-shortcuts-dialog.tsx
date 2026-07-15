import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@lumen/uikit/components';
import { PortalProps } from '@lumen/uikit/portal';

export interface ShortcutItem {
  keys: string[];
  description: string;
}

export interface KeyboardShortcutsDialogProps {
  shortcuts: ShortcutItem[];
}

export function KeyboardShortcutsDialog({
  isOpen,
  onDismiss,
  data,
}: PortalProps<KeyboardShortcutsDialogProps>) {
  const { shortcuts } = data || { shortcuts: [] };
  const t = useTranslations('Vocabulary.Study');

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss?.()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('shortcutsTitle')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                {shortcut.description}
              </span>
              <div className="flex items-center gap-2">
                {shortcut.keys.map((key) => (
                  <kbd
                    key={key}
                    className="pointer-events-none inline-flex h-6 min-w-[24px] select-none items-center justify-center rounded border bg-muted px-1.5 font-sans text-xs font-semibold text-muted-foreground shadow-sm"
                  >
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
