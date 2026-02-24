import { MealCategory } from '../types';

/**
 * Maps food database IDs to the meal times they are suitable for.
 * Foods not in this map are considered suitable for ALL meal times.
 */
export const MEAL_TIME_MAP: Record<string, MealCategory[]> = {
  // ── CHICKEN ──
  'chicken-breast': ['lunch', 'dinner'],
  'chicken-thigh': ['lunch', 'dinner'],
  'rotisserie-chicken': ['lunch', 'dinner'],
  'chicken-wings': ['lunch', 'dinner', 'snack'],
  'chicken-tenders': ['lunch', 'dinner', 'snack'],
  'chicken-drumstick': ['lunch', 'dinner'],

  // ── BEEF ──
  'ribeye-steak': ['dinner'],
  'filet-mignon': ['dinner'],
  'ny-strip': ['dinner'],
  'ground-beef': ['lunch', 'dinner'],
  'sliced-eye-round': ['lunch', 'dinner'],
  'bison': ['lunch', 'dinner'],

  // ── PORK ──
  'bacon': ['breakfast', 'lunch'],
  'pork-ribs': ['lunch', 'dinner'],
  'pork-chop': ['dinner'],
  'deli-turkey': ['lunch', 'snack'],
  'deli-ham': ['lunch', 'snack'],
  'pork-sausage': ['breakfast', 'dinner'],

  // ── TURKEY ──
  'ground-turkey': ['lunch', 'dinner'],
  'turkey-breast': ['lunch', 'dinner'],

  // ── OTHER MEAT ──
  'hot-dog': ['lunch', 'dinner', 'snack'],
  'ham': ['lunch', 'dinner'],
  'lamb-chop': ['dinner'],

  // ── SEAFOOD ──
  'salmon': ['lunch', 'dinner'],
  'tilapia': ['lunch', 'dinner'],
  'cod': ['lunch', 'dinner'],
  'shrimp': ['lunch', 'dinner'],
  'tuna-canned': ['lunch', 'snack'],

  // ── EGGS ──
  'eggs': ['breakfast', 'lunch', 'snack'],
  'egg-whites': ['breakfast', 'lunch'],

  // ── DAIRY ──
  'cottage-cheese': ['breakfast', 'snack'],
  'greek-yogurt': ['breakfast', 'snack'],
  'regular-yogurt': ['breakfast', 'snack'],
  'mozzarella': ['lunch', 'dinner', 'snack'],
  'string-cheese': ['snack'],
  'cheddar-cheese': ['lunch', 'dinner', 'snack'],

  // ── GRAINS ──
  'pasta': ['lunch', 'dinner'],
  'oatmeal': ['breakfast'],
  'bagel': ['breakfast'],
  'cereal': ['breakfast', 'snack'],
  'pancakes': ['breakfast'],
  'waffles': ['breakfast'],
  'granola': ['breakfast', 'snack'],
  'crackers': ['snack'],

  // ── VEGETABLES ──
  'potato': ['lunch', 'dinner'],
  'carrots': ['lunch', 'dinner', 'snack'],
  'cauliflower': ['lunch', 'dinner'],
  'peas': ['lunch', 'dinner'],
  'cabbage': ['lunch', 'dinner'],

  // ── FRUITS ──
  'banana': ['breakfast', 'snack'],
  'apple': ['breakfast', 'snack'],
  'strawberries': ['breakfast', 'snack'],
  'blueberries': ['breakfast', 'snack'],
  'grapes': ['snack'],
  'watermelon': ['snack'],
  'orange': ['breakfast', 'snack'],
  'pineapple': ['breakfast', 'snack'],
  'mixed-berries': ['breakfast', 'snack'],
  'raspberries': ['breakfast', 'snack'],

  // ── BEVERAGES ──
  'protein-shake': ['breakfast', 'snack'],
  'smoothie': ['breakfast', 'snack'],
  'tea': ['breakfast', 'snack'],
  'almond-milk': ['breakfast'],
  'sports-drink': ['snack'],
  'chocolate-milk': ['breakfast', 'snack'],

  // ── OTHER / SNACKS ──
  'peanut-butter': ['breakfast', 'snack'],
  'almonds': ['snack'],
  'mixed-nuts': ['snack'],
  'protein-bar': ['snack'],
  'jerky-beef': ['snack'],
  'beans-black': ['lunch', 'dinner'],
  'tofu': ['lunch', 'dinner'],
  'popcorn': ['snack'],
  'tortilla-chips': ['snack'],
  'granola-bar': ['breakfast', 'snack'],
  'trail-mix': ['snack'],
  'peanuts': ['snack'],
  'american-cheese': ['lunch', 'snack'],
  'honey': ['breakfast', 'snack'],
};

/**
 * Check if a food is suitable for a given meal category.
 * Foods not in the map are considered suitable for ALL meal times.
 */
export function isFoodSuitableFor(foodId: string, meal: MealCategory): boolean {
  const meals = MEAL_TIME_MAP[foodId];
  if (!meals) return true;
  return meals.includes(meal);
}
