import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useNetworkState } from '../use-network-state';

describe('useNetworkState', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: true,
    });
  });

  it('should return initial network state', () => {
    const { result } = renderHook(() => useNetworkState());
    expect(result.current.online).toBe(true);
  });

  it('should update online status when offline/online events fire', () => {
    const { result } = renderHook(() => useNetworkState());

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current.online).toBe(false);

    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current.online).toBe(true);
  });
});
