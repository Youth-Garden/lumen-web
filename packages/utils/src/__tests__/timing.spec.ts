import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { formatDuration, debounce, throttle, sleep } from '../timing';

describe('timing utils', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatDuration', () => {
    it('should format 0 or negative seconds as 0s', () => {
      expect(formatDuration(0)).toBe('0s');
      expect(formatDuration(-10)).toBe('0s');
    });

    it('should format seconds only', () => {
      expect(formatDuration(45)).toBe('45s');
    });

    it('should format minutes and seconds', () => {
      expect(formatDuration(125)).toBe('2m 5s');
    });

    it('should format hours, minutes, and seconds', () => {
      expect(formatDuration(3665)).toBe('1h 1m 5s');
    });
  });

  describe('debounce', () => {
    it('should delay function execution until wait ms has passed', () => {
      const fn = vi.fn();
      const debounced = debounce(fn, 200);

      debounced();
      debounced();
      debounced();

      expect(fn).not.toHaveBeenCalled();

      vi.advanceTimersByTime(200);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  describe('throttle', () => {
    it('should execute immediately and throttle subsequent calls within limit ms', () => {
      const fn = vi.fn();
      const throttled = throttle(fn, 300);

      throttled('first');
      throttled('second');
      throttled('third');

      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('first');

      vi.advanceTimersByTime(300);
      throttled('fourth');
      expect(fn).toHaveBeenCalledTimes(2);
      expect(fn).toHaveBeenCalledWith('fourth');
    });
  });

  describe('sleep', () => {
    it('should resolve promise after specified ms', async () => {
      const promise = sleep(500);
      vi.advanceTimersByTime(500);
      await expect(promise).resolves.toBeUndefined();
    });
  });
});
