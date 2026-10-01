import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useStep } from '../use-step';

describe('useStep', () => {
  it('should initialize at step 1 and navigate forward/backward correctly', () => {
    const { result } = renderHook(() => useStep(3));

    const [currentStep, helpers] = result.current;
    expect(currentStep).toBe(1);
    expect(helpers.canGoToPrevStep).toBe(false);
    expect(helpers.canGoToNextStep).toBe(true);

    act(() => {
      result.current[1].goToNextStep();
    });

    expect(result.current[0]).toBe(2);
    expect(result.current[1].canGoToPrevStep).toBe(true);
    expect(result.current[1].canGoToNextStep).toBe(true);

    act(() => {
      result.current[1].goToNextStep();
    });

    expect(result.current[0]).toBe(3);
    expect(result.current[1].canGoToNextStep).toBe(false);

    act(() => {
      result.current[1].goToPrevStep();
    });

    expect(result.current[0]).toBe(2);

    act(() => {
      result.current[1].reset();
    });

    expect(result.current[0]).toBe(1);
  });

  it('should clamp step within valid boundaries when using setStep', () => {
    const { result } = renderHook(() => useStep(5));

    act(() => {
      result.current[1].setStep(10);
    });
    expect(result.current[0]).toBe(5);

    act(() => {
      result.current[1].setStep(-2);
    });
    expect(result.current[0]).toBe(1);
  });
});
