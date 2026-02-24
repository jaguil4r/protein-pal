import { useState, useEffect, useCallback } from 'react';
import { getLastMealTime } from '../utils/storage';
import { hoursSince } from '../utils/dateUtils';

export function useMealTimer(mealInterval: number) {
  const [lastMealTime, setLastMealTime] = useState<number | null>(getLastMealTime);
  const [hoursSinceLastMeal, setHoursSinceLastMeal] = useState<number | null>(null);

  const refresh = useCallback(() => {
    const t = getLastMealTime();
    setLastMealTime(t);
  }, []);

  useEffect(() => {
    const update = () => {
      if (lastMealTime !== null) {
        setHoursSinceLastMeal(hoursSince(lastMealTime));
      } else {
        setHoursSinceLastMeal(null);
      }
    };

    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [lastMealTime]);

  const minutesUntilNextMeal =
    hoursSinceLastMeal !== null
      ? Math.max(0, Math.round((mealInterval - hoursSinceLastMeal) * 60))
      : null;

  const isOverdue = hoursSinceLastMeal !== null && hoursSinceLastMeal > mealInterval;

  return { hoursSinceLastMeal, minutesUntilNextMeal, isOverdue, lastMealTime, refresh };
}
