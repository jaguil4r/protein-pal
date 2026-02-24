import { useState, useEffect, useRef } from 'react';
import { StreakData, StreakTier } from '../types';
import { checkAndUpdateStreak, markTodayGoalMet, getStreak } from '../utils/storage';

export function useStreak(progressPercent: number) {
  const [streak, setStreak] = useState<StreakData>(() => checkAndUpdateStreak());
  const [isNewTier, setIsNewTier] = useState(false);
  const prevTierRef = useRef<StreakTier>(streak.tier);

  // Mark today's goal as met when progress hits 100%
  useEffect(() => {
    if (progressPercent >= 100) {
      const updated = markTodayGoalMet();
      setStreak(updated);
    }
  }, [progressPercent]);

  // Detect new tier
  useEffect(() => {
    if (streak.tier !== prevTierRef.current && streak.tier !== 'none') {
      setIsNewTier(true);
      const timer = setTimeout(() => setIsNewTier(false), 3000);
      prevTierRef.current = streak.tier;
      return () => clearTimeout(timer);
    }
    prevTierRef.current = streak.tier;
  }, [streak.tier]);

  return {
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    tier: streak.tier,
    isNewTier,
  };
}
