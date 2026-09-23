'use client';

import { useCallback, useRef, useState } from 'react';

export interface UseSubmitLockOptions {
  autoUnlockOnError?: boolean;
}

export interface UseSubmitLockControls {
  isLocked: boolean;
  lock: () => void;
  unlock: () => void;
  resetLock: () => void;
}

export function useSubmitLock<TArgs extends unknown[], TReturn = void>(
  action: (...args: TArgs) => TReturn | Promise<TReturn>,
  options: UseSubmitLockOptions = {},
): [(...args: TArgs) => Promise<TReturn | undefined>, UseSubmitLockControls] {
  const { autoUnlockOnError = true } = options;
  const [isLocked, setIsLocked] = useState(false);
  const isLockedRef = useRef(false);

  const lock = useCallback(() => {
    isLockedRef.current = true;
    setIsLocked(true);
  }, []);

  const unlock = useCallback(() => {
    isLockedRef.current = false;
    setIsLocked(false);
  }, []);

  const execute = useCallback(
    async (...args: TArgs): Promise<TReturn | undefined> => {
      if (isLockedRef.current) return undefined;
      isLockedRef.current = true;
      setIsLocked(true);

      try {
        const result = await action(...args);
        return result;
      } catch (error) {
        if (autoUnlockOnError) {
          isLockedRef.current = false;
          setIsLocked(false);
        }
        throw error;
      }
    },
    [action, autoUnlockOnError],
  );

  return [
    execute,
    {
      isLocked,
      lock,
      unlock,
      resetLock: unlock,
    },
  ];
}
