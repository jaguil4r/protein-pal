import { MealCategory } from '../types';

export interface CoachFood {
  id: string;
  name: string;
  protein: number;
  macros: { carbs: number; calories: number; fiber: number };
  category: MealCategory;
  suitableFor: MealCategory[];
}

/**
 * Curated pool of common high-protein foods for Coach Mode meal planning.
 * Each food has a default MealCategory and a list of meal slots it's suitable for.
 */
export const COACH_FOODS: CoachFood[] = [
  {
    id: 'protein-shake',
    name: 'Protein Shake',
    protein: 30,
    macros: { carbs: 3, calories: 160, fiber: 1 },
    category: 'snack',
    suitableFor: ['breakfast', 'snack'],
  },
  {
    id: 'chicken-breast',
    name: 'Chicken Breast',
    protein: 31,
    macros: { carbs: 0, calories: 165, fiber: 0 },
    category: 'lunch',
    suitableFor: ['lunch', 'dinner'],
  },
  {
    id: 'greek-yogurt',
    name: 'Greek Yogurt',
    protein: 15,
    macros: { carbs: 7, calories: 100, fiber: 0 },
    category: 'breakfast',
    suitableFor: ['breakfast', 'snack'],
  },
  {
    id: 'cottage-cheese',
    name: 'Cottage Cheese',
    protein: 14,
    macros: { carbs: 5, calories: 110, fiber: 0 },
    category: 'snack',
    suitableFor: ['lunch', 'dinner', 'snack'],
  },
  {
    id: 'eggs',
    name: 'Eggs',
    protein: 12,
    macros: { carbs: 1, calories: 143, fiber: 0 },
    category: 'breakfast',
    suitableFor: ['breakfast', 'lunch'],
  },
  {
    id: 'string-cheese',
    name: 'String Cheese',
    protein: 7,
    macros: { carbs: 0, calories: 80, fiber: 0 },
    category: 'snack',
    suitableFor: ['snack'],
  },
];
