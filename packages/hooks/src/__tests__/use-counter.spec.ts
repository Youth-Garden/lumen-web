import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '../use-counter';

describe('useCounter', () => {
  it('should initialize with starting value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current[0]).toBe(10);
  });

  it('should increment and decrement with delta', () => {
    const { result } = renderHook(() => useCounter(0));

    act(() => {
      result.current[1].increment(5);
    });
    expect(result.current[0]).toBe(5);

    act(() => {
      result.current[1].decrement(2);
    });
    expect(result.current[0]).toBe(3);
  });

  it('should respect min and max boundary options', () => {
    const { result } = renderHook(() => useCounter(5, { min: 0, max: 10 }));

    act(() => {
      result.current[1].increment(10);
    });
    // Should not exceed max of 10
    expect(result.current[0]).toBe(5);

    act(() => {
      result.current[1].decrement(10);
    });
    // Should not drop below min of 0
    expect(result.current[0]).toBe(5);
  });

  it('should reset to initial value', () => {
    const { result } = renderHook(() => useCounter(42));

    act(() => {
      result.current[1].set(100);
    });
    expect(result.current[0]).toBe(100);

    act(() => {
      result.current[1].reset();
    });
    expect(result.current[0]).toBe(42);
  });
});
