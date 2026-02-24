import { useState, useMemo } from 'react';
import { MealCategory } from '../../types';
import { planMeals, MealSlot } from '../../utils/mealPlanner';
import './CoachMode.css';

interface Props {
  totalProtein: number;
  dailyGoal: number;
  hoursRemaining: number;
  mealInterval: number;
  onAddEntry: (
    name: string,
    protein: number,
    category: MealCategory,
    macros?: { carbs: number; calories: number; fiber: number }
  ) => void;
}

export function CoachMode({
  totalProtein,
  dailyGoal,
  hoursRemaining,
  mealInterval,
  onAddEntry,
}: Props) {
  const [loggedSlots, setLoggedSlots] = useState<Set<number>>(() => new Set());

  const proteinRemaining = Math.max(0, dailyGoal - totalProtein);

  const slots: MealSlot[] = useMemo(
    () => planMeals(proteinRemaining, hoursRemaining, mealInterval),
    [proteinRemaining, hoursRemaining, mealInterval]
  );

  if (proteinRemaining <= 0 || dailyGoal <= 0) return null;

  const handleAddAll = (slot: MealSlot, index: number) => {
    onAddEntry(slot.combinedName, slot.totalProtein, slot.category, slot.totalMacros);
    setLoggedSlots((prev) => new Set(prev).add(index));
  };

  return (
    <div className="coach-mode" data-testid="coach-mode">
      <div className="coach-mode__header" data-testid="coach-mode-header">
        <span className="coach-mode__title">Plan My Day</span>
        <span className="coach-mode__summary">
          {proteinRemaining}g remaining &middot; {slots.length} meal{slots.length !== 1 ? 's' : ''} left
        </span>
      </div>

      <div className="coach-mode__slots">
        {slots.map((slot, i) => {
          const isLogged = loggedSlots.has(i);
          return (
            <div
              key={`${slot.label}-${i}`}
              className={`coach-mode__slot${isLogged ? ' coach-mode__slot--logged' : ''}`}
              data-testid="coach-meal-slot"
            >
              <div className="coach-mode__slot-header">
                <span className="coach-mode__slot-label">{slot.label}</span>
                <span className="coach-mode__slot-target">~{slot.targetProtein}g target</span>
              </div>

              <div className="coach-mode__foods">
                {slot.foods.map((food) => (
                  <div key={food.id} className="coach-mode__food">
                    <span className="coach-mode__food-name">{food.name}</span>
                    <span className="coach-mode__food-protein">{food.protein}g</span>
                  </div>
                ))}
              </div>

              <div className="coach-mode__slot-footer">
                <span className="coach-mode__slot-totals">
                  {slot.totalProtein}g protein &middot; {slot.totalMacros.calories} cal
                </span>
                {isLogged ? (
                  <span className="coach-mode__added" data-testid="coach-slot-added">
                    &#x2713; Added!
                  </span>
                ) : (
                  <button
                    type="button"
                    className="coach-mode__add-btn"
                    data-testid="coach-add-all"
                    onClick={() => handleAddAll(slot, i)}
                  >
                    Add All
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
