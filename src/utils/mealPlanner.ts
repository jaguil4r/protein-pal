import { MealCategory } from '../types';
import { COACH_FOODS, CoachFood } from '../data/coachFoods';

export interface MealSlot {
  label: string;
  category: MealCategory;
  targetProtein: number;
  foods: CoachFood[];
  totalProtein: number;
  totalMacros: { carbs: number; calories: number; fiber: number };
  combinedName: string;
}

function categoryForHour(hour: number): MealCategory {
  if (hour < 11) return 'breakfast';
  if (hour < 14) return 'lunch';
  if (hour < 17) return 'snack';
  return 'dinner';
}

const CATEGORY_LABELS: Record<MealCategory, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snack: 'Snack',
  dinner: 'Dinner',
};

/**
 * Pick the best 1–2 food combo from pool that hits closest to target protein.
 * Prefers foods not already used in previous slots.
 */
function pickFoods(
  target: number,
  category: MealCategory,
  usedIds: Set<string>
): CoachFood[] {
  // Filter to foods suitable for this category
  let pool = COACH_FOODS.filter((f) => f.suitableFor.includes(category));

  // Fall back to full pool if nothing matches
  if (pool.length === 0) pool = [...COACH_FOODS];

  // Score singles
  let bestSingle: { food: CoachFood; diff: number } | null = null;
  for (const food of pool) {
    const diff = Math.abs(food.protein - target);
    const penalty = usedIds.has(food.id) ? 5 : 0;
    const score = diff + penalty;
    if (!bestSingle || score < bestSingle.diff) {
      bestSingle = { food, diff: score };
    }
  }

  // Score pairs
  let bestPair: { foods: [CoachFood, CoachFood]; diff: number } | null = null;
  for (let i = 0; i < pool.length; i++) {
    for (let j = i + 1; j < pool.length; j++) {
      const pairProtein = pool[i].protein + pool[j].protein;
      const diff = Math.abs(pairProtein - target);
      const penalty =
        (usedIds.has(pool[i].id) ? 5 : 0) + (usedIds.has(pool[j].id) ? 5 : 0);
      const score = diff + penalty;
      if (!bestPair || score < bestPair.diff) {
        bestPair = { foods: [pool[i], pool[j]], diff: score };
      }
    }
  }

  // Pick whichever is closer to target
  if (!bestPair && bestSingle) return [bestSingle.food];
  if (!bestSingle && bestPair) return bestPair.foods;
  if (bestSingle && bestPair) {
    return bestPair.diff <= bestSingle.diff
      ? bestPair.foods
      : [bestSingle.food];
  }

  // Absolute fallback (should never happen with 6 foods)
  return [COACH_FOODS[0]];
}

function sumMacros(
  foods: CoachFood[]
): { carbs: number; calories: number; fiber: number } {
  return foods.reduce(
    (acc, f) => ({
      carbs: acc.carbs + f.macros.carbs,
      calories: acc.calories + f.macros.calories,
      fiber: acc.fiber + f.macros.fiber,
    }),
    { carbs: 0, calories: 0, fiber: 0 }
  );
}

/**
 * Plan remaining meals for the day.
 *
 * @param proteinRemaining Grams of protein left to hit daily goal
 * @param hoursRemaining   Hours left in eating window
 * @param mealInterval     Hours between meals
 * @returns Array of MealSlot plans
 */
export function planMeals(
  proteinRemaining: number,
  hoursRemaining: number,
  mealInterval: number
): MealSlot[] {
  if (proteinRemaining <= 0) return [];

  const mealsLeft = Math.max(1, Math.floor(hoursRemaining / mealInterval));
  const currentHour = new Date().getHours() + new Date().getMinutes() / 60;

  const slots: MealSlot[] = [];
  const usedIds = new Set<string>();
  let targetBudget = proteinRemaining;

  for (let i = 0; i < mealsLeft; i++) {
    const slotsRemaining = mealsLeft - i;
    const slotTarget = slotsRemaining === 1
      ? targetBudget
      : Math.round(targetBudget / slotsRemaining);

    const slotHour = currentHour + i * mealInterval;
    const category = categoryForHour(slotHour % 24);

    const foods = pickFoods(slotTarget, category, usedIds);
    foods.forEach((f) => usedIds.add(f.id));

    const totalProtein = foods.reduce((sum, f) => sum + f.protein, 0);
    const totalMacros = sumMacros(foods);
    const combinedName = foods.map((f) => f.name).join(' + ');

    slots.push({
      label: mealsLeft === 1 ? 'Next Meal' : CATEGORY_LABELS[category],
      category,
      targetProtein: slotTarget,
      foods,
      totalProtein,
      totalMacros,
      combinedName,
    });

    targetBudget -= slotTarget;
    if (targetBudget <= 0) break;
  }

  return slots;
}
