import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToggle } from '../use-toggle';

describe('useToggle', () => {
  it('should initialize with provided default state or false', () => {
    const { result: r1 } = renderHook(() => useToggle());
    expect(r1.current[0]).toBe(false);

    const { result: r2 } = renderHook(() => useToggle(true));
    expect(r2.current[0]).toBe(true);
  });

  it('should toggle boolean value when toggle is called without args', () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(false);
  });

  it('should set specific boolean value when explicitly passed', () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      result.current[1](true);
    });
    expect(result.current[0]).toBe(true);

    act(() => {
      result.current[2](false);
    });
    expect(result.current[0]).toBe(false);
  });
});
