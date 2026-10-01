import { fireEvent, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useHover } from '../use-hover';

describe('useHover', () => {
  it('should track hover state of element', () => {
    const element = document.createElement('div');
    const ref = { current: element };

    const { result } = renderHook(() => useHover(ref));

    expect(result.current).toBe(false);

    fireEvent.mouseEnter(element);
    expect(result.current).toBe(true);

    fireEvent.mouseLeave(element);
    expect(result.current).toBe(false);
  });
});
