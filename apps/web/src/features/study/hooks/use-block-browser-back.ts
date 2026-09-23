'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useEventListener } from '@lumen/hooks';

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
  }, [isOpen]);

  const handlePopState = useCallback(() => {
    if (!isOpen || isUnblockingRef.current) return;

    window.history.pushState({ isStudySession: true }, '');
    onBlockRef.current();
  }, [isOpen]);

  useEventListener('popstate', handlePopState);

  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (!isOpen || isUnblockingRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    },
    [isOpen],
  );

  useEventListener('beforeunload', handleBeforeUnload);

  const unblockAndExit = useCallback(() => {
    isUnblockingRef.current = true;
    window.history.back();
  }, []);

  return { unblockAndExit };
}
