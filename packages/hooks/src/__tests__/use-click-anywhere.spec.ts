import { fireEvent, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useClickAnyWhere } from '../use-click-anywhere';

describe('useClickAnyWhere', () => {
  it('should call handler when user clicks anywhere on document', () => {
    const handler = vi.fn();
    renderHook(() => useClickAnyWhere(handler));

    expect(handler).not.toHaveBeenCalled();

    fireEvent.click(document.body);

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
