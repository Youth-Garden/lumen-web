import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useBlockBrowserBack } from '../use-block-browser-back';

describe('useBlockBrowserBack', () => {
  let pushStateSpy: ReturnType<typeof vi.spyOn>;
  let backSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    pushStateSpy = vi
      .spyOn(window.history, 'pushState')
      .mockImplementation(() => {});
    backSpy = vi.spyOn(window.history, 'back').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should push state when opened', () => {
    const onBlock = vi.fn();
    renderHook(() => useBlockBrowserBack({ isOpen: true, onBlock }));

    expect(pushStateSpy).toHaveBeenCalledWith({ isStudySession: true }, '');
  });

  it('should not push state when closed', () => {
    const onBlock = vi.fn();
    renderHook(() => useBlockBrowserBack({ isOpen: false, onBlock }));

    expect(pushStateSpy).not.toHaveBeenCalled();
  });

  it('should intercept popstate and trigger onBlock callback', () => {
    const onBlock = vi.fn();
    renderHook(() => useBlockBrowserBack({ isOpen: true, onBlock }));

    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(onBlock).toHaveBeenCalledTimes(1);
    expect(pushStateSpy).toHaveBeenCalledTimes(2);
  });

  it('should call history.back and not trigger onBlock when unblockAndExit is called', () => {
    const onBlock = vi.fn();
    const { result } = renderHook(() =>
      useBlockBrowserBack({ isOpen: true, onBlock }),
    );

    act(() => {
      result.current.unblockAndExit();
    });

    expect(backSpy).toHaveBeenCalledTimes(1);

    act(() => {
      window.dispatchEvent(new PopStateEvent('popstate'));
    });

    expect(onBlock).not.toHaveBeenCalled();
  });
});
