import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useQueue } from '../use-queue';

describe('useQueue', () => {
  it('should initialize with initial array', () => {
    const { result } = renderHook(() => useQueue([1, 2, 3]));

    expect(result.current.queue).toEqual([1, 2, 3]);
    expect(result.current.size).toBe(3);
    expect(result.current.first).toBe(1);
    expect(result.current.last).toBe(3);
  });

  it('should add single element or array of elements', () => {
    const { result } = renderHook(() => useQueue<string>(['a']));

    act(() => {
      result.current.add('b');
    });
    expect(result.current.queue).toEqual(['a', 'b']);

    act(() => {
      result.current.add(['c', 'd']);
    });
    expect(result.current.queue).toEqual(['a', 'b', 'c', 'd']);
    expect(result.current.size).toBe(4);
  });

  it('should remove first element from queue (FIFO)', () => {
    const { result } = renderHook(() => useQueue(['first', 'second', 'third']));

    act(() => {
      result.current.remove();
    });

    expect(result.current.queue).toEqual(['second', 'third']);
    expect(result.current.first).toBe('second');
  });

  it('should clear queue and support functional set', () => {
    const { result } = renderHook(() => useQueue([10, 20]));

    act(() => {
      result.current.clear();
    });
    expect(result.current.queue).toEqual([]);
    expect(result.current.size).toBe(0);

    act(() => {
      result.current.set([100, 200]);
    });
    expect(result.current.queue).toEqual([100, 200]);
  });
});
