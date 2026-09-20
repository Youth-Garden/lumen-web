import { LessonQuotaPreset, LESSON_QUOTA_CONFIGS } from '@/services/study';
import { PronunciationAccent } from '@/services/vocabulary';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface PreferencesState {
  // Sound & Audio Preferences
  soundEffectsEnabled: boolean;
  soundVolume: number;
  autoPlayAudio: boolean;
  accent: PronunciationAccent;

  // Study Session Quota Preferences
  lessonQuotaPreset: LessonQuotaPreset;
  wordsPerSession: number;

  // UI & Interaction Preferences
  showShortcuts: boolean;

  // Actions
  setSoundEffectsEnabled: (enabled: boolean) => void;
  setSoundVolume: (volume: number) => void;
  setAutoPlayAudio: (enabled: boolean) => void;
  setAccent: (accent: PronunciationAccent) => void;
  setLessonQuotaPreset: (preset: LessonQuotaPreset) => void;
  setShowShortcuts: (show: boolean) => void;
  updatePreferences: (patch: Partial<PreferencesState>) => void;
  resetPreferences: () => void;
}

const DEFAULT_PREFERENCES = {
  soundEffectsEnabled: true,
  soundVolume: 0.8,
  autoPlayAudio: true,
  accent: PronunciationAccent.US,
  lessonQuotaPreset: 'A_LOT' as LessonQuotaPreset,
  wordsPerSession: 20,
  showShortcuts: true,
};

export const usePreferencesStore = create<PreferencesState>()(
  devtools(
    persist(
      (set) => ({
        ...DEFAULT_PREFERENCES,

        setSoundEffectsEnabled: (soundEffectsEnabled) =>
          set({ soundEffectsEnabled }),

        setSoundVolume: (soundVolume) =>
          set({ soundVolume: Math.max(0, Math.min(1, soundVolume)) }),

        setAutoPlayAudio: (autoPlayAudio) => set({ autoPlayAudio }),

        setAccent: (accent) => set({ accent }),

        setLessonQuotaPreset: (preset) => {
          const target = LESSON_QUOTA_CONFIGS[preset]?.targetCount || 20;
          set({
            lessonQuotaPreset: preset,
            wordsPerSession: target,
          });
        },

        setShowShortcuts: (showShortcuts) => set({ showShortcuts }),

        updatePreferences: (patch) =>
          set((state) => {
            const next = { ...state, ...patch };
            if (
              patch.lessonQuotaPreset &&
              LESSON_QUOTA_CONFIGS[patch.lessonQuotaPreset]
            ) {
              next.wordsPerSession =
                LESSON_QUOTA_CONFIGS[patch.lessonQuotaPreset].targetCount;
            }
            return next;
          }),

        resetPreferences: () => set(DEFAULT_PREFERENCES),
      }),
      {
        name: 'lumen_user_preferences',
      },
    ),
    { name: 'PreferencesStore' },
  ),
);
