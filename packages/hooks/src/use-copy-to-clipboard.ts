import { useCallback, useState } from 'react';

export interface CopyToClipboardOptions {
  resetTimeout?: number;
}

export function useCopyToClipboard(
  options: CopyToClipboardOptions = {},
): [string | null, (value: string) => Promise<boolean>, boolean] {
  const { resetTimeout = 2000 } = options;
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copy = useCallback(
    async (value: string): Promise<boolean> => {
      if (!value) return false;

      try {
        if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(value);
        } else if (typeof document !== 'undefined') {
          const textArea = document.createElement('textarea');
          textArea.value = value;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        } else {
          return false;
        }

        setCopiedText(value);
        setIsCopied(true);

        if (resetTimeout > 0) {
          setTimeout(() => {
            setIsCopied(false);
          }, resetTimeout);
        }

        return true;
      } catch {
        setIsCopied(false);
        return false;
      }
    },
    [resetTimeout],
  );

  return [copiedText, copy, isCopied];
}
