import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useList } from '../use-list';

describe('useList', () => {
  it('should initialize with default empty list or initial value', () => {
    const { result: emptyRes } = renderHook(() => useList<number>());
    expect(emptyRes.current[0]).toEqual([]);

    const { result: filledRes } = renderHook(() => useList([1, 2, 3]));
    expect(filledRes.current[0]).toEqual([1, 2, 3]);
  });

  it('should push elements to the end of list', () => {
    const { result } = renderHook(() => useList<string>(['a']));

    act(() => {
      result.current[1].push('b');
    });

    expect(result.current[0]).toEqual(['a', 'b']);
  });

  it('should remove elements at specific index', () => {
    const { result } = renderHook(() => useList(['a', 'b', 'c']));

    act(() => {
      result.current[1].removeAt(1);
    });

    expect(result.current[0]).toEqual(['a', 'c']);
  });

  it('should insert elements at specific index', () => {
    const { result } = renderHook(() => useList(['a', 'c']));

    act(() => {
      result.current[1].insertAt(1, 'b');
    });

    expect(result.current[0]).toEqual(['a', 'b', 'c']);
  });

  it('should update element at index', () => {
    const { result } = renderHook(() => useList(['a', 'b', 'c']));

    act(() => {
      result.current[1].updateAt(1, 'updated');
    });

    expect(result.current[0]).toEqual(['a', 'updated', 'c']);
  });

  it('should clear list and set list directly', () => {
    const { result } = renderHook(() => useList([1, 2]));

    act(() => {
      result.current[1].clear();
    });
    expect(result.current[0]).toEqual([]);

    act(() => {
      result.current[1].set([10, 20]);
    });
    expect(result.current[0]).toEqual([10, 20]);
  });
});
