'use client';

import { useState, useCallback, useMemo } from 'react';
import { useEventListener } from './use-event-listener';

export interface NetworkState {
  online: boolean | undefined;
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  rtt?: number;
  saveData?: boolean;
  type?:
    | 'bluetooth'
    | 'cellular'
    | 'ethernet'
    | 'none'
    | 'wifi'
    | 'wimax'
    | 'other'
    | 'unknown';
}

interface NetworkInformation extends EventTarget {
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  rtt?: number;
  saveData?: boolean;
  type?:
    | 'bluetooth'
    | 'cellular'
    | 'ethernet'
    | 'none'
    | 'wifi'
    | 'wimax'
    | 'other'
    | 'unknown';
  onchange?: EventListener;
}

interface NavigatorWithConnection extends Navigator {
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
}

function getNetworkState(): NetworkState {
  if (typeof window === 'undefined') {
    return { online: true };
  }

  const nav = navigator as NavigatorWithConnection;
  const connection =
    nav.connection || nav.mozConnection || nav.webkitConnection;

  return {
    online: navigator.onLine,
    downlink: connection?.downlink,
    downlinkMax: connection?.downlinkMax,
    effectiveType: connection?.effectiveType,
    rtt: connection?.rtt,
    saveData: connection?.saveData,
    type: connection?.type,
  };
}

export function useNetworkState(
  initialState: NetworkState = { online: true },
): NetworkState {
  const [state, setState] = useState<NetworkState>(() => {
    if (typeof window === 'undefined') {
      return initialState;
    }
    return getNetworkState();
  });

  const handleOnline = useCallback(() => {
    setState((prev) => ({ ...prev, online: true }));
  }, []);

  const handleOffline = useCallback(() => {
    setState((prev) => ({ ...prev, online: false }));
  }, []);

  const handleConnectionChange = useCallback(() => {
    setState(getNetworkState());
  }, []);

  useEventListener('online', handleOnline);
  useEventListener('offline', handleOffline);

  const connection = useMemo(() => {
    if (typeof navigator === 'undefined') return null;
    const nav = navigator as NavigatorWithConnection;
    return nav.connection || nav.mozConnection || nav.webkitConnection || null;
  }, []);

  useEventListener('change', handleConnectionChange, connection);

  return state;
}
