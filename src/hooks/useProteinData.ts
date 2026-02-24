import { useState, useEffect, useCallback, useMemo } from 'react';
import { DayData, MealCategory, ProteinEntry } from '../types';
import { getDayData, saveDayData, setLastMealTime, clearLastMealTime, getSettings, saveSettings } from '../utils/storage';
import { getTodayKey, generateId } from '../utils/dateUtils';

export function useProteinData() {
  const [dayData, setDayData] = useState<DayData>(() => getDayData(getTodayKey()));

  // Check for midnight rollover
  useEffect(() => {
    const interval = setInterval(() => {
      const todayKey = getTodayKey();
      if (todayKey !== dayData.date) {
        setDayData(getDayData(todayKey));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [dayData.date]);

  const totalProtein = useMemo(
    () => dayData.entries.reduce((sum, e) => sum + e.protein, 0),
    [dayData.entries]
  );

  const totalCarbs = useMemo(
    () => dayData.entries.reduce((sum, e) => sum + (e.carbs ?? 0), 0),
    [dayData.entries]
  );

  const totalCalories = useMemo(
    () => dayData.entries.reduce((sum, e) => sum + (e.calories ?? 0), 0),
    [dayData.entries]
  );

  const totalFiber = useMemo(
    () => dayData.entries.reduce((sum, e) => sum + (e.fiber ?? 0), 0),
    [dayData.entries]
  );

  const waterOz = dayData.waterOz ?? 0;

  const progressPercent = useMemo(
    () => (dayData.goal > 0 ? Math.round((totalProtein / dayData.goal) * 100) : 0),
    [totalProtein, dayData.goal]
  );

  const addEntry = useCallback(
    (
      name: string,
      protein: number,
      category: MealCategory,
      macros?: { carbs: number; calories: number; fiber: number }
    ) => {
      const entry: ProteinEntry = {
        id: generateId(),
        name,
        protein,
        category,
        timestamp: Date.now(),
        ...(macros && {
          carbs: macros.carbs,
          calories: macros.calories,
          fiber: macros.fiber,
        }),
      };
      setDayData((prev) => {
        const updated = { ...prev, entries: [...prev.entries, entry] };
        saveDayData(updated);
        return updated;
      });
      setLastMealTime(Date.now());
    },
    []
  );

  const deleteEntry = useCallback((id: string) => {
    setDayData((prev) => {
      const updated = { ...prev, entries: prev.entries.filter((e) => e.id !== id) };
      saveDayData(updated);

      // Recalculate lastMealTime from remaining entries
      if (updated.entries.length > 0) {
        const mostRecent = Math.max(...updated.entries.map((e) => e.timestamp));
        setLastMealTime(mostRecent);
      } else {
        clearLastMealTime();
      }

      return updated;
    });
  }, []);

  const restoreEntry = useCallback((entry: ProteinEntry) => {
    setDayData((prev) => {
      const entries = [...prev.entries, entry].sort((a, b) => a.timestamp - b.timestamp);
      const updated = { ...prev, entries };
      saveDayData(updated);

      // Update lastMealTime to the most recent entry
      const mostRecent = Math.max(...updated.entries.map((e) => e.timestamp));
      setLastMealTime(mostRecent);

      return updated;
    });
  }, []);

  const updateEntryTimestamp = useCallback((id: string, timestamp: number) => {
    setDayData((prev) => {
      const entries = prev.entries
        .map((e) => (e.id === id ? { ...e, timestamp } : e))
        .sort((a, b) => a.timestamp - b.timestamp);
      const updated = { ...prev, entries };
      saveDayData(updated);
      return updated;
    });
    // Update last meal time if this is the latest entry
    setLastMealTime(timestamp);
  }, []);

  const setGoal = useCallback((goal: number) => {
    setDayData((prev) => {
      const updated = { ...prev, goal };
      saveDayData(updated);
      return updated;
    });
    const settings = getSettings();
    saveSettings({ ...settings, dailyGoal: goal });
  }, []);

  const setMacroGoals = useCallback(
    (macroGoals: { carbs: number; calories: number; fiber: number }) => {
      setDayData((prev) => {
        const updated = { ...prev, macroGoals };
        saveDayData(updated);
        return updated;
      });
      const settings = getSettings();
      saveSettings({
        ...settings,
        carbGoal: macroGoals.carbs,
        calorieGoal: macroGoals.calories,
        fiberGoal: macroGoals.fiber,
      });
    },
    []
  );

  const addWater = useCallback((oz: number) => {
    setDayData((prev) => {
      const updated = { ...prev, waterOz: (prev.waterOz ?? 0) + oz };
      saveDayData(updated);
      return updated;
    });
  }, []);

  return {
    dayData,
    totalProtein,
    totalCarbs,
    totalCalories,
    totalFiber,
    waterOz,
    progressPercent,
    addEntry,
    deleteEntry,
    restoreEntry,
    updateEntryTimestamp,
    setGoal,
    setMacroGoals,
    addWater,
  };
}
