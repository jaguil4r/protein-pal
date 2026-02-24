import { useState, useEffect, useRef } from 'react';
import { XpData } from '../types';
import { getXpData, awardEntryXp, awardMilestoneXp } from '../utils/storage';

export function useXp(progressPercent: number, entryCount: number, currentStreak: number) {
  const [xp, setXp] = useState<XpData>(() => getXpData());
  const [isLevelUp, setIsLevelUp] = useState(false);
  const prevLevelRef = useRef<number>(xp.level);
  const prevEntryCountRef = useRef<number>(entryCount);

  // Award XP when entries are added (detect new entries via count increase)
  useEffect(() => {
    if (entryCount > prevEntryCountRef.current) {
      const newEntries = entryCount - prevEntryCountRef.current;
      let updated = xp;
      for (let i = 0; i < newEntries; i++) {
        updated = awardEntryXp();
      }
      setXp(updated);
    }
    prevEntryCountRef.current = entryCount;
  }, [entryCount]);

  // Award milestone XP on progress thresholds
  useEffect(() => {
    if (progressPercent >= 50) {
      const updated = awardMilestoneXp(progressPercent, currentStreak);
      setXp(updated);
    }
  }, [progressPercent, currentStreak]);

  // Detect level up (flash animation for 3s)
  useEffect(() => {
    if (xp.level > prevLevelRef.current) {
      setIsLevelUp(true);
      const timer = setTimeout(() => setIsLevelUp(false), 3000);
      prevLevelRef.current = xp.level;
      return () => clearTimeout(timer);
    }
    prevLevelRef.current = xp.level;
  }, [xp.level]);

  return {
    totalXp: xp.totalXp,
    level: xp.level,
    isLevelUp,
  };
}
