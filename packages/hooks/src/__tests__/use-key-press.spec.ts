import { fireEvent, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useKeyPress } from '../use-key-press';

describe('useKeyPress', () => {
  it('should call callback when the specified single key is pressed', () => {
    const callback = vi.fn();
    renderHook(() => useKeyPress('Escape', callback));

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(callback).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'Enter' });
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should support multiple keys in an array', () => {
    const callback = vi.fn();
    renderHook(() => useKeyPress(['ArrowUp', 'ArrowDown'], callback));

    fireEvent.keyDown(window, { key: 'ArrowUp' });
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(callback).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should match modifier keys (ctrl, meta, ctrlOrMeta)', () => {
    const callback = vi.fn();
    renderHook(() =>
      useKeyPress('k', callback, {
        modifierKeys: { ctrlOrMeta: true },
      }),
    );

    fireEvent.keyDown(window, { key: 'k' });
    expect(callback).not.toHaveBeenCalled();

    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(callback).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'k', metaKey: true });
    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should ignore events when target is an input element by default', () => {
    const callback = vi.fn();
    renderHook(() => useKeyPress('Enter', callback));

    const input = document.createElement('input');
    document.body.appendChild(input);

    fireEvent.keyDown(input, { key: 'Enter' });
    expect(callback).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it('should not fire when disabled is true', () => {
    const callback = vi.fn();
    renderHook(() => useKeyPress('Enter', callback, { disabled: true }));

    fireEvent.keyDown(window, { key: 'Enter' });
    expect(callback).not.toHaveBeenCalled();
  });

  it('should cleanup event listeners on unmount', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useKeyPress('Space', callback));

    unmount();
    fireEvent.keyDown(window, { key: 'Space', code: 'Space' });
    expect(callback).not.toHaveBeenCalled();
  });
});
