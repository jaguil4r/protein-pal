import { useMemo } from 'react';
import { getDayData } from '../utils/storage';

export type TimeRange = '2w' | '1m' | '3m';

export interface DayPoint {
  date: string;
  protein: number;
  goal: number;
  hitGoal: boolean;
  isCheatDay: boolean;
}

export interface HistoryData {
  days: DayPoint[];
  avgProtein: number;
  goalHitRate: number;
  bestStreak: number;
}

function formatDateKey(d: Date): string {
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

export function useHistory(range: TimeRange): HistoryData {
  return useMemo(() => {
    const now = new Date();
    const daysBack = range === '2w' ? 14 : range === '1m' ? 30 : 90;
    const days: DayPoint[] = [];

    for (let i = daysBack - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = formatDateKey(d);
      const data = getDayData(key);
      const protein = data.entries.reduce((sum, e) => sum + e.protein, 0);
      days.push({
        date: key,
        protein,
        goal: data.goal,
        hitGoal: protein >= data.goal || (data.isCheatDay ?? false),
        isCheatDay: data.isCheatDay ?? false,
      });
    }

    const withEntries = days.filter((d) => d.protein > 0);
    const avgProtein =
      withEntries.length > 0
        ? Math.round(withEntries.reduce((s, d) => s + d.protein, 0) / withEntries.length)
        : 0;
    const goalHitRate =
      days.length > 0
        ? Math.round((days.filter((d) => d.hitGoal).length / days.length) * 100)
        : 0;

    let bestStreak = 0;
    let current = 0;
    for (const day of days) {
      if (day.hitGoal) {
        current++;
        bestStreak = Math.max(bestStreak, current);
      } else {
        current = 0;
      }
    }

    return { days, avgProtein, goalHitRate, bestStreak };
  }, [range]);
}
