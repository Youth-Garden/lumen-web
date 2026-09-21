'use client';

import { useCallback, useEffect, useRef } from 'react';

interface UseBlockBrowserBackProps {
  isOpen: boolean;
  onBlock: () => void;
}

interface UseBlockBrowserBackReturn {
  unblockAndExit: () => void;
}

export function useBlockBrowserBack({
  isOpen,
  onBlock,
}: UseBlockBrowserBackProps): UseBlockBrowserBackReturn {
  const isUnblockingRef = useRef(false);
  const onBlockRef = useRef(onBlock);
  onBlockRef.current = onBlock;

  useEffect(() => {
    if (!isOpen) return;

    isUnblockingRef.current = false;
    window.history.pushState({ isStudySession: true }, '');

    const handlePopState = () => {
      if (isUnblockingRef.current) return;

      window.history.pushState({ isStudySession: true }, '');
      onBlockRef.current();
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen]);

  const unblockAndExit = useCallback(() => {
    isUnblockingRef.current = true;
    window.history.back();
  }, []);

  return { unblockAndExit };
}
