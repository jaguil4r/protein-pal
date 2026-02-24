import { useMemo } from 'react';
import { UserSettings } from '../types';
import { getDayData, getWeekDateKeys } from '../utils/storage';

export interface DailyEntry {
  dateKey: string;
  dayLabel: string;
  protein: number;
  goal: number;
  isWorkoutDay: boolean;
  isCheatDay: boolean;
  isToday: boolean;
  isFuture: boolean;
  hitGoal: boolean;
  hasEntries: boolean;
}

export interface WeeklySummaryData {
  weekStartLabel: string;
  weekEndLabel: string;
  proteinDaysHit: number;
  totalDaysElapsed: number;
  workoutDaysCompleted: number;
  scheduledWorkoutDays: number;
  avgProteinPerDay: number;
  bestDay: { label: string; protein: number } | null;
  worstDay: { label: string; protein: number } | null;
  dailyBreakdown: DailyEntry[];
  cheatDaysUsed: number;
  focusTip: string;
}

const SHORT_DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SHORT_MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDateLabel(dateKey: string): string {
  const d = new Date(dateKey + 'T12:00:00');
  return `${SHORT_MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;
}

function getDayOfWeek(dateKey: string): number {
  return new Date(dateKey + 'T12:00:00').getDay();
}

function generateFocusTip(
  data: {
    proteinDaysHit: number;
    totalDaysElapsed: number;
    avgProteinPerDay: number;
    avgGoal: number;
    workoutDaysMissed: number;
    bestProtein: number;
    worstProtein: number;
    cheatDaysUsed: number;
    cheatDaysMax: number;
    weekendLow: boolean;
  }
): string {
  const { proteinDaysHit, totalDaysElapsed, avgProteinPerDay, avgGoal, workoutDaysMissed, bestProtein, worstProtein, cheatDaysUsed, cheatDaysMax, weekendLow } = data;

  if (totalDaysElapsed === 0) return 'Start logging your protein to see weekly insights!';

  const hitRate = proteinDaysHit / totalDaysElapsed;

  if (hitRate >= 0.7) return 'Amazing week! Keep this momentum going into next week.';
  if (workoutDaysMissed > 0) return 'Prioritize protein on workout days for better recovery.';
  if (avgProteinPerDay < avgGoal * 0.8) return 'Focus on hitting your protein target more consistently.';
  if (bestProtein > avgGoal * 1.2 && worstProtein < avgGoal * 0.5) return 'Try to spread protein more evenly across the week.';
  if (cheatDaysUsed >= cheatDaysMax && cheatDaysMax > 0) return 'Plan higher-protein meals before your cheat days.';
  if (weekendLow) return 'Weekends tend to be your weak spot — prep some easy options.';
  return 'Log early in the day to stay on track!';
}

export function useWeeklySummary(
  settings: UserSettings,
  /** Used as cache-busting trigger — re-computes when today's protein changes */
  _totalProtein?: number,
  /** Used as cache-busting trigger — re-computes when cheat day toggles */
  _isCheatDay?: boolean,
): WeeklySummaryData {
  return useMemo(() => {
    const now = new Date();
    const todayKey =
      now.getFullYear() +
      '-' +
      String(now.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(now.getDate()).padStart(2, '0');

    const weekKeys = getWeekDateKeys(now);
    const weekStartLabel = formatDateLabel(weekKeys[0]);
    const weekEndLabel = formatDateLabel(weekKeys[6]);

    const dailyBreakdown: DailyEntry[] = [];
    let proteinDaysHit = 0;
    let totalDaysElapsed = 0;
    let totalProtein = 0;
    let daysWithEntries = 0;
    let workoutDaysCompleted = 0;
    let cheatDaysUsed = 0;
    let bestDay: { label: string; protein: number } | null = null;
    let worstDay: { label: string; protein: number } | null = null;
    let workoutDaysMissed = 0;
    let weekendProtein = 0;
    let weekendDaysWithEntries = 0;
    let totalGoal = 0;

    for (const dateKey of weekKeys) {
      const dayOfWeek = getDayOfWeek(dateKey);
      const isFuture = dateKey > todayKey;
      const isToday = dateKey === todayKey;
      const isWorkoutDay = settings.workoutDays.includes(dayOfWeek);

      const data = getDayData(dateKey);
      const dayProtein = data.entries.reduce((sum, e) => sum + e.protein, 0);
      const hasEntries = data.entries.length > 0;
      const hitGoal = dayProtein >= data.goal || (data.isCheatDay ?? false);

      if (!isFuture) {
        totalDaysElapsed++;
        totalGoal += data.goal;

        if (hasEntries) {
          daysWithEntries++;
          totalProtein += dayProtein;

          // Weekend tracking (Sat=6, Sun=0)
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            weekendProtein += dayProtein;
            weekendDaysWithEntries++;
          }

          // Best/worst (only count days with actual entries, skip cheat days for worst)
          if (!bestDay || dayProtein > bestDay.protein) {
            bestDay = { label: SHORT_DAY_NAMES[dayOfWeek], protein: dayProtein };
          }
          if (!data.isCheatDay && (!worstDay || dayProtein < worstDay.protein)) {
            worstDay = { label: SHORT_DAY_NAMES[dayOfWeek], protein: dayProtein };
          }
        }

        if (hitGoal) proteinDaysHit++;
        if (data.isCheatDay) cheatDaysUsed++;

        if (isWorkoutDay && !isFuture) {
          if (hitGoal) workoutDaysCompleted++;
          else if (hasEntries) workoutDaysMissed++;
        }
      }

      dailyBreakdown.push({
        dateKey,
        dayLabel: SHORT_DAY_NAMES[dayOfWeek],
        protein: dayProtein,
        goal: data.goal,
        isWorkoutDay,
        isCheatDay: data.isCheatDay ?? false,
        isToday,
        isFuture,
        hitGoal,
        hasEntries,
      });
    }

    const avgProteinPerDay = daysWithEntries > 0 ? Math.round(totalProtein / daysWithEntries) : 0;
    const avgGoal = totalDaysElapsed > 0 ? totalGoal / totalDaysElapsed : settings.dailyGoal;
    const weekendAvg = weekendDaysWithEntries > 0 ? weekendProtein / weekendDaysWithEntries : avgGoal;
    const weekendLow = weekendDaysWithEntries > 0 && weekendAvg < avgGoal * 0.6;

    // Count scheduled workout days that have already passed or are today
    const scheduledWorkoutDaysElapsed = weekKeys.filter((key, _) => {
      const dow = getDayOfWeek(key);
      return settings.workoutDays.includes(dow) && key <= todayKey;
    }).length;

    const focusTip = generateFocusTip({
      proteinDaysHit,
      totalDaysElapsed,
      avgProteinPerDay,
      avgGoal,
      workoutDaysMissed,
      bestProtein: bestDay?.protein ?? 0,
      worstProtein: worstDay?.protein ?? avgGoal,
      cheatDaysUsed,
      cheatDaysMax: settings.cheatDaysPerWeek,
      weekendLow,
    });

    return {
      weekStartLabel,
      weekEndLabel,
      proteinDaysHit,
      totalDaysElapsed,
      workoutDaysCompleted,
      scheduledWorkoutDays: scheduledWorkoutDaysElapsed,
      avgProteinPerDay,
      bestDay,
      worstDay,
      dailyBreakdown,
      cheatDaysUsed,
      focusTip,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.workoutDays, settings.cheatDaysPerWeek, settings.dailyGoal, _totalProtein, _isCheatDay]);
}
