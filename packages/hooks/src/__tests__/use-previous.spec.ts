import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { usePrevious } from '../use-previous';

describe('usePrevious', () => {
  it('should return undefined on first render and previous value on subsequent renders', () => {
    let count = 0;
    const { result, rerender } = renderHook(() => usePrevious(count));

    expect(result.current).toBeUndefined();

    count = 1;
    rerender();
    expect(result.current).toBe(0);

    count = 5;
    rerender();
    expect(result.current).toBe(1);
  });
});
