import { useMemo } from 'react';
import { ProteinEntry } from '../types';

interface EatingWindowResult {
  windowStart: number | null;
  windowEnd: number | null;
  hoursElapsed: number;
  hoursRemaining: number;
  isWindowOpen: boolean;
  nextMealSuggestion: string | null;
  mealTimestamps: number[];
}

/**
 * Convert minutes-since-midnight to a timestamp for today.
 */
function minutesToTodayTimestamp(minutes: number): number {
  const d = new Date();
  d.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return d.getTime();
}

export function useEatingWindow(
  entries: ProteinEntry[],
  totalProtein: number,
  dailyGoal: number,
  mealInterval: number,
  overrideStartMinutes?: number,
  overrideEndMinutes?: number
): EatingWindowResult {
  return useMemo(() => {
    const hasOverrides =
      overrideStartMinutes !== undefined && overrideEndMinutes !== undefined;

    if (entries.length === 0 && !hasOverrides) {
      return {
        windowStart: null,
        windowEnd: null,
        hoursElapsed: 0,
        hoursRemaining: 0,
        isWindowOpen: false,
        nextMealSuggestion: null,
        mealTimestamps: [],
      };
    }

    const sorted = entries.length > 0
      ? [...entries].sort((a, b) => a.timestamp - b.timestamp)
      : [];

    const now = Date.now();

    // Calculate window bounds: use overrides if available, else auto
    let windowStart: number;
    let windowEnd: number;

    if (hasOverrides) {
      windowStart = minutesToTodayTimestamp(overrideStartMinutes);
      windowEnd = minutesToTodayTimestamp(overrideEndMinutes);
      // If end is before start (e.g. overnight), push end to next day
      if (windowEnd <= windowStart) {
        windowEnd += 24 * 60 * 60 * 1000;
      }
    } else if (sorted.length > 0) {
      windowStart = sorted[0].timestamp;
      const defaultWindowHours = 12;
      windowEnd = windowStart + defaultWindowHours * 60 * 60 * 1000;
    } else {
      return {
        windowStart: null,
        windowEnd: null,
        hoursElapsed: 0,
        hoursRemaining: 0,
        isWindowOpen: false,
        nextMealSuggestion: null,
        mealTimestamps: [],
      };
    }

    const hoursElapsed = (now - windowStart) / (1000 * 60 * 60);
    const hoursRemaining = Math.max(0, (windowEnd - now) / (1000 * 60 * 60));
    const isWindowOpen = now < windowEnd && now >= windowStart;

    // Calculate next meal suggestion
    let nextMealSuggestion: string | null = null;
    if (isWindowOpen && totalProtein < dailyGoal) {
      const proteinRemaining = dailyGoal - totalProtein;
      const estimatedMealsLeft = Math.max(1, Math.floor(hoursRemaining / mealInterval));
      const perMeal = Math.round(proteinRemaining / estimatedMealsLeft);

      if (perMeal > 0) {
        nextMealSuggestion = `~${perMeal}g protein per meal (${estimatedMealsLeft} meals left)`;
      }
    }

    return {
      windowStart,
      windowEnd,
      hoursElapsed: Math.round(hoursElapsed * 10) / 10,
      hoursRemaining: Math.round(hoursRemaining * 10) / 10,
      isWindowOpen,
      nextMealSuggestion,
      mealTimestamps: sorted.map((e) => e.timestamp),
    };
  }, [entries, totalProtein, dailyGoal, mealInterval, overrideStartMinutes, overrideEndMinutes]);
}
