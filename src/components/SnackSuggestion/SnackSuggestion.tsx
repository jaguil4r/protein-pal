import { useState, useMemo, useCallback } from 'react';
import { foodDatabase } from '../../data/foodDatabase';
import { getFoodIcon } from '../../data/foodIcons';
import { isFoodSuitableFor } from '../../data/mealTimeMap';
import { MealCategory, ProteinEntry } from '../../types';
import './SnackSuggestion.css';

type MealFilter = 'all' | MealCategory;

const FILTERS: MealFilter[] = ['all', 'breakfast', 'lunch', 'dinner', 'snack'];

const FILTER_TITLES: Record<MealFilter, string> = {
  all: 'High-Protein Snack Ideas',
  breakfast: 'Breakfast Ideas',
  lunch: 'Lunch Ideas',
  dinner: 'Dinner Ideas',
  snack: 'Snack Ideas',
};

interface Props {
  totalProtein: number;
  dailyGoal: number;
  entries: ProteinEntry[];
  hoursRemaining: number;
  mealInterval: number;
}

interface SnackIdea {
  name: string;
  protein: number;
  serving: string;
  icon: string;
  detail: string;
}

/** Seeded shuffle so each "seed" gives a stable random order */
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const shuffled = [...arr];
  let s = seed;
  for (let i = shuffled.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getSnackIdeas(
  proteinRemaining: number,
  entries: ProteinEntry[],
  mealsLeft: number,
  mealFilter: MealFilter
): SnackIdea[] {
  // Determine what categories the user already logged today
  const loggedCategories = new Set(entries.map((e) => e.category));
  const loggedNames = new Set(entries.map((e) => e.name.toLowerCase()));

  // Filter food database for high-protein candidates
  // Minimum 6g protein per default serving to qualify
  const candidates = foodDatabase
    .filter((food) => {
      const protein = food.macrosPerServing.protein;
      if (protein < 6) return false;
      if (mealFilter !== 'all' && !isFoodSuitableFor(food.id, mealFilter)) return false;
      return true;
    })
    .map((food) => {
      const defaultSize = food.servingSizes.find(
        (s) => s.label === food.defaultServing
      );
      const multiplier = defaultSize?.multiplier ?? 1;
      const protein = Math.round(food.macrosPerServing.protein * multiplier);
      const calories = Math.round(food.macrosPerServing.calories * multiplier);

      return {
        name: food.name,
        protein,
        serving: food.defaultServing,
        icon: getFoodIcon(food.id, food.category),
        detail: `${food.defaultServing} \u00B7 ${calories} cal`,
        alreadyLogged: loggedNames.has(food.name.toLowerCase()),
        category: food.category,
      };
    });

  // Score each candidate:
  // - Prefer items NOT already logged today
  // - Prefer items closer to the per-meal protein target
  // - Prefer "snack-friendly" categories (dairy, other/nuts, beverages)
  const perMealTarget = mealsLeft > 0
    ? Math.round(proteinRemaining / mealsLeft)
    : proteinRemaining;

  const snackFriendly = new Set(['dairy', 'other', 'beverage', 'nut', 'legume']);

  const scored = candidates.map((c) => {
    let score = 0;

    // Bonus for not already logged
    if (!c.alreadyLogged) score += 20;

    // Bonus for being snack-friendly
    if (snackFriendly.has(c.category)) score += 10;

    // Penalty for being too much protein (over what's needed)
    const proteinDiff = Math.abs(c.protein - perMealTarget);
    score -= proteinDiff * 0.5;

    // Bonus if protein fits nicely in remaining (not over goal)
    if (c.protein <= proteinRemaining) score += 15;

    // Slight bonus for higher protein density
    score += Math.min(c.protein, 30) * 0.3;

    return { ...c, score };
  });

  // Sort by score descending and return top candidates
  scored.sort((a, b) => b.score - a.score);

  return scored.map(({ alreadyLogged, category, score, ...rest }) => rest);
}

/**
 * Contextual tip based on remaining protein and time.
 */
function getContextTip(
  proteinRemaining: number,
  mealsLeft: number,
  hoursRemaining: number
): string | null {
  if (proteinRemaining <= 0) return null;

  if (mealsLeft <= 1 && proteinRemaining > 30) {
    return `${proteinRemaining}g left \u2014 try combining a couple of these!`;
  }
  if (mealsLeft >= 2) {
    const perMeal = Math.round(proteinRemaining / mealsLeft);
    return `Aim for ~${perMeal}g per meal across ${mealsLeft} remaining meals`;
  }
  if (hoursRemaining <= 2 && proteinRemaining > 0) {
    return `Window closing soon \u2014 grab a quick high-protein snack!`;
  }
  return null;
}

export function SnackSuggestion({
  totalProtein,
  dailyGoal,
  entries,
  hoursRemaining,
  mealInterval,
}: Props) {
  const [shuffleSeed, setShuffleSeed] = useState(1);
  const [mealFilter, setMealFilter] = useState<MealFilter>('all');

  const proteinRemaining = Math.max(0, dailyGoal - totalProtein);
  const mealsLeft = Math.max(1, Math.floor(hoursRemaining / mealInterval));

  const allIdeas = useMemo(
    () => getSnackIdeas(proteinRemaining, entries, mealsLeft, mealFilter),
    [proteinRemaining, entries, mealsLeft, mealFilter]
  );

  // Pick 3 suggestions using seeded shuffle
  const suggestions = useMemo(() => {
    const shuffled = seededShuffle(allIdeas, shuffleSeed);
    return shuffled.slice(0, 3);
  }, [allIdeas, shuffleSeed]);

  const contextTip = useMemo(
    () => getContextTip(proteinRemaining, mealsLeft, hoursRemaining),
    [proteinRemaining, mealsLeft, hoursRemaining]
  );

  const handleShuffle = useCallback(() => {
    setShuffleSeed((s) => s + 1);
  }, []);

  const handleFilterChange = useCallback((filter: MealFilter) => {
    setMealFilter(filter);
    setShuffleSeed(1);
  }, []);

  // Don't show if goal is met or no protein goal
  if (proteinRemaining <= 0 || dailyGoal <= 0) return null;

  return (
    <div className="snack-suggestion" data-testid="snack-suggestion">
      <div className="snack-suggestion__header">
        <span className="snack-suggestion__title">{FILTER_TITLES[mealFilter]}</span>
        <button
          type="button"
          className="snack-suggestion__shuffle"
          onClick={handleShuffle}
          title="Shuffle suggestions"
          data-testid="snack-shuffle"
          aria-label="Shuffle snack suggestions"
        >
          &#x1F504;
        </button>
      </div>

      <div className="snack-suggestion__filters" data-testid="snack-filters">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            className={`snack-suggestion__filter-pill${mealFilter === filter ? ' snack-suggestion__filter-pill--active' : ''}`}
            onClick={() => handleFilterChange(filter)}
            data-testid={`snack-filter-${filter}`}
          >
            {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      <div className="snack-suggestion__list" data-testid="snack-list">
        {suggestions.length === 0 ? (
          <div className="snack-suggestion__empty">
            No high-protein {mealFilter} ideas available
          </div>
        ) : (
          suggestions.map((snack) => (
            <div key={`${snack.name}-${shuffleSeed}`} className="snack-suggestion__item" data-testid="snack-item">
              <span className="snack-suggestion__icon">{snack.icon}</span>
              <div className="snack-suggestion__info">
                <div className="snack-suggestion__name">{snack.name}</div>
                <div className="snack-suggestion__detail">{snack.detail}</div>
              </div>
              <span className="snack-suggestion__protein">{snack.protein}g</span>
            </div>
          ))
        )}
      </div>

      {contextTip && (
        <div className="snack-suggestion__context" data-testid="snack-context">
          {contextTip}
        </div>
      )}
    </div>
  );
}
