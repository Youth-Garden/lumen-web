import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { usePreferencesStore } from '../preferences.store';
import { PronunciationAccent } from '@/services/vocabulary';
import { LessonQuotaPreset } from '@/services/study';

describe('usePreferencesStore', () => {
  beforeEach(() => {
    act(() => {
      usePreferencesStore.getState().resetPreferences();
    });
  });

  it('should initialize with default sound and study session preferences', () => {
    const state = usePreferencesStore.getState();
    expect(state.soundEffectsEnabled).toBe(true);
    expect(state.accent).toBe(PronunciationAccent.US);
    expect(state.showShortcuts).toBe(true);
  });

  it('should toggle sound effects and clamp sound volume between 0 and 1', () => {
    act(() => {
      usePreferencesStore.getState().setSoundEffectsEnabled(false);
      usePreferencesStore.getState().setSoundVolume(1.5);
    });

    expect(usePreferencesStore.getState().soundEffectsEnabled).toBe(false);
    expect(usePreferencesStore.getState().soundVolume).toBe(1.0);

    act(() => {
      usePreferencesStore.getState().setSoundVolume(-0.2);
    });
    expect(usePreferencesStore.getState().soundVolume).toBe(0);
  });

  it('should update accent and quota preset correctly', () => {
    act(() => {
      usePreferencesStore.getState().setAccent(PronunciationAccent.UK);
      usePreferencesStore
        .getState()
        .setLessonQuotaPreset(LessonQuotaPreset.FEW);
    });

    expect(usePreferencesStore.getState().accent).toBe(PronunciationAccent.UK);
    expect(usePreferencesStore.getState().lessonQuotaPreset).toBe(
      LessonQuotaPreset.FEW,
    );
    expect(usePreferencesStore.getState().wordsPerSession).toBe(7);
  });
});
