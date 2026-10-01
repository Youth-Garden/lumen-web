'use client';

import { useCallback, useState } from 'react';

export interface UseStepHelpers {
  currentStep: number;
  canGoToNextStep: boolean;
  canGoToPrevStep: boolean;
  goToNextStep: () => void;
  goToPrevStep: () => void;
  setStep: (step: number | ((step: number) => number)) => void;
  reset: () => void;
}

export function useStep(maxStep: number): [number, UseStepHelpers] {
  const [currentStep, setCurrentStep] = useState(1);

  const canGoToNextStep = currentStep < maxStep;
  const canGoToPrevStep = currentStep > 1;

  const setStep = useCallback(
    (step: number | ((step: number) => number)) => {
      setCurrentStep((prev) => {
        const newStep = typeof step === 'function' ? step(prev) : step;
        if (newStep < 1) return 1;
        if (newStep > maxStep) return maxStep;
        return newStep;
      });
    },
    [maxStep],
  );

  const goToNextStep = useCallback(() => {
    if (currentStep < maxStep) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, maxStep]);

  const goToPrevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const reset = useCallback(() => {
    setCurrentStep(1);
  }, []);

  return [
    currentStep,
    {
      currentStep,
      canGoToNextStep,
      canGoToPrevStep,
      goToNextStep,
      goToPrevStep,
      setStep,
      reset,
    },
  ];
}
