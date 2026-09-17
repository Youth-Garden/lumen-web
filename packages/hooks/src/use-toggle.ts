'use client';

import { useCallback, useState } from 'react';

export function useToggle(
  initialState: boolean = false,
): [boolean, (nextValue?: boolean | unknown) => void, (nextValue: boolean) => void] {
  const [state, setState] = useState<boolean>(initialState);

  const toggle = useCallback((nextValue?: boolean | unknown) => {
    setState((current) =>
      typeof nextValue === 'boolean' ? nextValue : !current,
    );
  }, []);

  return [state, toggle, setState];
}
