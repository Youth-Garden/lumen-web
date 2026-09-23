import { renderHook } from '@testing-library/react';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useEventListener } from '../use-event-listener';

describe('useEventListener', () => {
  it('should bind window events by default', () => {
    const handler = vi.fn();
    renderHook(() => useEventListener('click', handler));

    window.dispatchEvent(new MouseEvent('click'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should unbind events on unmount', () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useEventListener('click', handler));

    window.dispatchEvent(new MouseEvent('click'));
    expect(handler).toHaveBeenCalledTimes(1);

    unmount();
    window.dispatchEvent(new MouseEvent('click'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should bind to custom element ref', () => {
    const handler = vi.fn();
    const element = document.createElement('button');

    renderHook(() => {
      const ref = useRef(element);
      useEventListener('click', handler, ref);
    });

    element.dispatchEvent(new MouseEvent('click'));
    expect(handler).toHaveBeenCalledTimes(1);

    window.dispatchEvent(new MouseEvent('click'));
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should always use the latest handler without re-subscribing', () => {
    let count = 0;
    const { rerender } = renderHook(({ cb }) => useEventListener('click', cb), {
      initialProps: {
        cb: () => {
          count = 1;
        },
      },
    });

    rerender({
      cb: () => {
        count = 2;
      },
    });

    window.dispatchEvent(new MouseEvent('click'));
    expect(count).toBe(2);
  });
});
