import { fireEvent, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { usePageLeave } from '../use-page-leave';

describe('usePageLeave', () => {
  it('should trigger onLeave when mouse leaves the document window (relatedTarget null)', () => {
    const onLeave = vi.fn();
    renderHook(() => usePageLeave(onLeave));

    fireEvent.mouseOut(document, { relatedTarget: document.body });
    expect(onLeave).not.toHaveBeenCalled();

    fireEvent.mouseOut(document, { relatedTarget: null });
    expect(onLeave).toHaveBeenCalledTimes(1);
  });
});
