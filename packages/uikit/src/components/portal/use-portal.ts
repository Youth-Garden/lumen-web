import { usePortalStore } from '../../store/portal.store';
import React, { useCallback, useMemo, useState } from 'react';
import { PortalProps } from '../../types/portal.types';

export function usePortal<T = any>(
  Component: React.ComponentType<PortalProps<T>>,
  options: {
    key?: string;
    disableCloseByBackdrop?: boolean;
    disableBackdrop?: boolean;
  } = {},
): [(data?: T) => void, () => void, boolean] {
  const { onPresent, onDismiss, portals } = usePortalStore();
  const {
    key,
    disableCloseByBackdrop = false,
    disableBackdrop = false,
  } = options;

  const [generatedId] = useState(
    () => key || `portal_${Math.random().toString(36).substring(7)}`,
  );

  const handlePresent = useCallback(
    (data?: T) => {
      onPresent({
        id: generatedId,
        component: Component,
        data,
        disableCloseByBackdrop,
        disableBackdrop,
      });
    },
    [
      onPresent,
      Component,
      generatedId,
      disableCloseByBackdrop,
      disableBackdrop,
    ],
  );

  const handleDismiss = useCallback(() => {
    onDismiss(generatedId);
  }, [onDismiss, generatedId]);

  const isOpen = useMemo(() => {
    return portals.some((p) => p.id === generatedId && p.isOpen);
  }, [portals, generatedId]);

  return [handlePresent, handleDismiss, isOpen];
}

export function useCloseAllPortals() {
  const { closeAllPortals } = usePortalStore();
  return closeAllPortals;
}

export function useClosePortalById() {
  const { onDismiss } = usePortalStore();
  return useCallback((id: string) => onDismiss(id), [onDismiss]);
}

export function usePortalWithoutBackdrop<T = any>(
  Component: React.ComponentType<PortalProps<T>>,
  options: { key?: string; disableCloseByBackdrop?: boolean } = {},
) {
  return usePortal(Component, { ...options, disableBackdrop: true });
}
