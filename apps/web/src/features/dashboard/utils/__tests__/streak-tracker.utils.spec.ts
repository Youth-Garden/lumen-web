import { DailyGoalHistoryItem } from '@/services/progress';
import { Locale } from '@/shared/types';
import { startOfDay, subDays } from 'date-fns';
import { describe, expect, it } from 'vitest';
import {
  computeWeeklyTrackerDays,
  resolveTargetForDate,
} from '../streak-tracker.utils';

describe('streak-tracker.utils', () => {
  describe('resolveTargetForDate', () => {
    const today = startOfDay(new Date());
    const pastDate = subDays(today, 3); // 3 days ago

    it('should resolve historical target from matching goalHistories interval', () => {
      const histories: DailyGoalHistoryItem[] = [
        {
          targetMinutes: 15,
          effectiveFrom: subDays(today, 7).toISOString(),
          effectiveTo: subDays(today, 2).toISOString(),
        },
        {
          targetMinutes: 60,
          effectiveFrom: subDays(today, 1).toISOString(),
          effectiveTo: null,
        },
      ];

      // Past date (3 days ago) should match first interval (15m)
      const target = resolveTargetForDate(pastDate, histories, 60);
      expect(target).toBe(15);

      // Today should match current interval (60m)
      const todayTarget = resolveTargetForDate(today, histories, 60);
      expect(todayTarget).toBe(60);
    });

    it('should fallback to initial default goal (15m) for past dates before earliest history record', () => {
      const histories: DailyGoalHistoryItem[] = [
        {
          targetMinutes: 60,
          effectiveFrom: today.toISOString(),
          effectiveTo: null,
        },
      ];

      // Past date (3 days ago) before today's new history record should resolve to initial default (15m)
      const target = resolveTargetForDate(pastDate, histories, 60);
      expect(target).toBe(15);
    });

    it('should return fallbackGoal for today and future dates when no history exists', () => {
      const todayTarget = resolveTargetForDate(today, undefined, 45);
      expect(todayTarget).toBe(45);
    });
  });

  describe('computeWeeklyTrackerDays', () => {
    it('should correctly calculate goals met status for past days using historical target', () => {
      const today = startOfDay(new Date());
      const histories: DailyGoalHistoryItem[] = [
        {
          targetMinutes: 60,
          effectiveFrom: today.toISOString(),
          effectiveTo: null,
        },
      ];

      // 3 days ago user studied 30 minutes. Under 15m historical target, 30m >= 15m is completed.
      const heatmapData = [
        {
          date: subDays(today, 3).toISOString().slice(0, 10),
          count: 15, // 15 * 2 = 30 mins
        },
      ];

      const days = computeWeeklyTrackerDays(
        heatmapData,
        0, // todayStudyMinutes
        60, // dailyGoalMinutes
        Locale.EN,
        0,
        false,
        histories,
      );

      const pastDayItem = days.find(
        (d) => d.dateStr === subDays(today, 3).toISOString().slice(0, 10),
      );

      expect(pastDayItem).toBeDefined();
      expect(pastDayItem?.isGoalMet).toBe(true);
      expect(pastDayItem?.status).toBe('completed');
    });

    it('should mark the 1st missed day after a completed study day as frozen and subsequent missed days as missed', () => {
      const today = startOfDay(new Date());

      // User studied 4 days ago (Tue), but missed 3 days ago (Wed), 2 days ago (Thu), 1 day ago (Fri)
      const heatmapData = [
        {
          date: subDays(today, 4).toISOString().slice(0, 10),
          count: 20,
        },
      ];

      const days = computeWeeklyTrackerDays(
        heatmapData,
        0,
        15,
        Locale.EN,
        0,
        false,
      );

      // 3 days ago (Wed - 1st missed day after Tue) should be frozen by Tue's earned freeze
      const firstMissedDay = days.find(
        (d) => d.dateStr === subDays(today, 3).toISOString().slice(0, 10),
      );
      expect(firstMissedDay?.status).toBe('frozen');

      // 2 days ago (Thu - 2nd missed day) should be missed
      const secondMissedDay = days.find(
        (d) => d.dateStr === subDays(today, 2).toISOString().slice(0, 10),
      );
      expect(secondMissedDay?.status).toBe('missed');
    });

    it('should mark sandwiched missed days as frozen', () => {
      const today = startOfDay(new Date());

      // User studied 4 days ago and 2 days ago, but missed 3 days ago
      const heatmapData = [
        {
          date: subDays(today, 4).toISOString().slice(0, 10),
          count: 20,
        },
        {
          date: subDays(today, 2).toISOString().slice(0, 10),
          count: 20,
        },
      ];

      const days = computeWeeklyTrackerDays(
        heatmapData,
        0,
        15,
        Locale.EN,
        1,
        false,
      );

      const sandwichedDay = days.find(
        (d) => d.dateStr === subDays(today, 3).toISOString().slice(0, 10),
      );

      expect(sandwichedDay?.status).toBe('frozen');
    });
  });
});
