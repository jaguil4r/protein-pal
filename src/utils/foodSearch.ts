import { FoodItem, MealCategory } from '../types';
import { foodDatabase } from '../data/foodDatabase';

/**
 * Search foods by query string. Fuzzy prefix match, case-insensitive.
 * Returns top matches sorted by relevance (exact prefix first, then contains).
 */
export function searchFoods(query: string, limit = 8): FoodItem[] {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];

  const words = q.split(/\s+/);

  type Scored = { food: FoodItem; score: number };
  const results: Scored[] = [];

  for (const food of foodDatabase) {
    const name = food.name.toLowerCase();

    // Check if all query words match somewhere in the name
    const allMatch = words.every((w) => name.includes(w));
    if (!allMatch) continue;

    let score = 0;

    // Exact match = highest score
    if (name === q) {
      score = 100;
    }
    // Starts with the query
    else if (name.startsWith(q)) {
      score = 80;
    }
    // First word matches start of name
    else if (name.startsWith(words[0])) {
      score = 60;
    }
    // Name contains the full query as substring
    else if (name.includes(q)) {
      score = 40;
    }
    // All words found but not contiguous
    else {
      score = 20;
    }

    // Shorter names rank higher (more specific)
    score += Math.max(0, 20 - name.length);

    // Protein-heavy foods get slight boost (more relevant for this app)
    score += Math.min(food.macrosPerServing.protein, 10);

    results.push({ food, score });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit).map((r) => r.food);
}

/**
 * Get default food suggestions for a given meal category.
 */
export function getDefaultSuggestionsForMeal(mealCategory: MealCategory): FoodItem[] {
  const lookup = (id: string) => foodDatabase.find((f) => f.id === id);

  const suggestions: Record<MealCategory, string[]> = {
    breakfast: ['eggs', 'bacon', 'greek-yogurt', 'oatmeal', 'banana', 'pancakes', 'chilaquiles', 'latte'],
    lunch: ['chicken-breast', 'white-rice', 'broccoli', 'deli-turkey', 'turkey-sandwich', 'burrito-bowl', 'stir-fry', 'gyro'],
    dinner: ['ribeye-steak', 'chicken-thigh', 'sweet-potato', 'asparagus', 'salmon', 'curry-chicken', 'ramen-bowl', 'pad-thai'],
    snack: ['cottage-cheese', 'protein-shake', 'protein-bar', 'almonds', 'greek-yogurt', 'cashews', 'edamame', 'pistachios'],
  };

  return (suggestions[mealCategory] || [])
    .map(lookup)
    .filter((f): f is FoodItem => f !== undefined);
}

/**
 * Get high-protein food suggestions from the database.
 * Returns a rotating set of top protein foods, shuffled so the user
 * sees variety each time.
 */
export function getHighProteinSuggestions(limit = 3): FoodItem[] {
  const highProteinIds = [
    'chicken-breast',
    'protein-shake',
    'greek-yogurt',
    'cottage-cheese',
    'eggs',
    'salmon',
    'deli-turkey',
    'protein-bar',
    'string-cheese',
    'jerky-beef',
    'ground-turkey',
    'turkey-breast',
    'edamame',
    'lentils',
    'hemp-seeds',
    'tofu',
    'tempeh',
    'lobster',
    'sardines',
  ];

  const foods = highProteinIds
    .map((id) => foodDatabase.find((f) => f.id === id))
    .filter((f): f is FoodItem => f !== undefined);

  // Shuffle to show variety
  for (let i = foods.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [foods[i], foods[j]] = [foods[j], foods[i]];
  }

  return foods.slice(0, limit);
}
