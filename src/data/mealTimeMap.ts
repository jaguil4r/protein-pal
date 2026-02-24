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

  // ── NEW PROTEIN ──
  'lobster': ['lunch', 'dinner'],
  'crab': ['lunch', 'dinner'],
  'sardines': ['lunch', 'snack'],
  'mahi-mahi': ['lunch', 'dinner'],
  'scallops': ['dinner'],
  'tuna-steak': ['lunch', 'dinner'],
  'catfish': ['lunch', 'dinner'],
  'clams': ['dinner'],
  'duck': ['dinner'],
  'venison': ['dinner'],
  'turkey-sausage': ['breakfast', 'dinner'],
  'chicken-sausage': ['breakfast', 'lunch', 'dinner'],
  'pepperoni': ['lunch', 'dinner', 'snack'],
  'corned-beef': ['lunch', 'dinner'],
  'pulled-pork': ['lunch', 'dinner'],
  'ground-beef-lean': ['lunch', 'dinner'],
  'lamb-ground': ['dinner'],

  // ── NEW DAIRY ──
  'ricotta': ['lunch', 'dinner'],
  'parmesan': ['lunch', 'dinner'],
  'provolone': ['lunch', 'dinner', 'snack'],
  'swiss-cheese': ['lunch', 'snack'],
  'feta': ['lunch', 'dinner'],
  'brie': ['snack'],
  'whipped-cream': ['breakfast', 'snack'],
  'milk-skim': ['breakfast'],
  'half-and-half': ['breakfast'],

  // ── NEW GRAINS ──
  'quinoa': ['lunch', 'dinner'],
  'couscous': ['lunch', 'dinner'],
  'naan': ['lunch', 'dinner'],
  'pita': ['lunch', 'dinner'],
  'english-muffin': ['breakfast'],
  'croissant': ['breakfast'],
  'french-toast': ['breakfast'],
  'ramen-noodles': ['lunch', 'dinner'],
  'sourdough': ['breakfast', 'lunch'],
  'cornbread': ['lunch', 'dinner'],
  'biscuit': ['breakfast'],
  'flatbread': ['lunch', 'dinner'],
  'rice-cake': ['snack'],
  'whole-wheat-pasta': ['lunch', 'dinner'],
  'grits': ['breakfast'],

  // ── NEW VEGETABLES ──
  'brussels-sprouts': ['dinner'],
  'eggplant': ['lunch', 'dinner'],
  'artichoke': ['dinner'],
  'celery': ['snack'],
  'radishes': ['lunch', 'snack'],
  'beets': ['lunch', 'dinner'],
  'butternut-squash': ['dinner'],
  'snap-peas': ['lunch', 'dinner', 'snack'],
  'bok-choy': ['lunch', 'dinner'],
  'okra': ['dinner'],
  'plantain': ['lunch', 'dinner'],

  // ── NEW FRUITS ──
  'mango': ['breakfast', 'snack'],
  'peach': ['snack'],
  'pear': ['snack'],
  'kiwi': ['breakfast', 'snack'],
  'cherries': ['snack'],
  'grapefruit': ['breakfast'],
  'cantaloupe': ['breakfast', 'snack'],
  'coconut-shredded': ['breakfast', 'snack'],
  'dried-cranberries': ['snack'],
  'dates': ['snack'],
  'blackberries': ['breakfast', 'snack'],
  'papaya': ['breakfast', 'snack'],

  // ── NEW BEVERAGES ──
  'oat-milk': ['breakfast'],
  'soy-milk': ['breakfast'],
  'coconut-milk-drink': ['breakfast'],
  'energy-drink': ['snack'],
  'energy-drink-zero': ['snack'],
  'lemonade': ['snack'],
  'apple-juice': ['breakfast', 'snack'],
  'cranberry-juice': ['breakfast', 'snack'],
  'kombucha': ['snack'],
  'hot-chocolate': ['breakfast', 'snack'],
  'latte': ['breakfast', 'snack'],

  // ── LEGUMES ──
  'kidney-beans': ['lunch', 'dinner'],
  'pinto-beans': ['lunch', 'dinner'],
  'lentils': ['lunch', 'dinner'],
  'chickpeas': ['lunch', 'dinner'],
  'edamame': ['lunch', 'dinner', 'snack'],
  'refried-beans': ['lunch', 'dinner'],
  'navy-beans': ['lunch', 'dinner'],
  'split-peas': ['lunch', 'dinner'],
  'lima-beans': ['dinner'],
  'soybeans': ['lunch', 'dinner'],
  'white-beans': ['lunch', 'dinner'],
  'black-eyed-peas': ['lunch', 'dinner'],

  // ── NUTS & SEEDS ──
  'cashews': ['snack'],
  'walnuts': ['snack'],
  'pistachios': ['snack'],
  'pecans': ['snack'],
  'macadamia-nuts': ['snack'],
  'hazelnuts': ['snack'],
  'brazil-nuts': ['snack'],
  'sunflower-seeds': ['snack'],
  'pumpkin-seeds': ['snack'],
  'chia-seeds': ['breakfast', 'snack'],
  'flax-seeds': ['breakfast', 'snack'],
  'hemp-seeds': ['breakfast', 'snack'],
  'almond-butter': ['breakfast', 'snack'],
  'cashew-butter': ['breakfast', 'snack'],

  // ── PREPARED FOODS ──
  'torta': ['lunch', 'dinner'],
  'burrito': ['lunch', 'dinner'],
  'burrito-bowl': ['lunch', 'dinner'],
  'taco-beef': ['lunch', 'dinner'],
  'taco-chicken': ['lunch', 'dinner'],
  'taco-fish': ['lunch', 'dinner'],
  'enchiladas': ['dinner'],
  'tamale': ['lunch', 'dinner'],
  'quesadilla': ['lunch', 'dinner', 'snack'],
  'nachos': ['lunch', 'dinner', 'snack'],
  'chilaquiles': ['breakfast'],
  'elote': ['snack', 'lunch'],
  'sushi-roll': ['lunch', 'dinner'],
  'fried-rice': ['lunch', 'dinner'],
  'stir-fry': ['lunch', 'dinner'],
  'ramen-bowl': ['lunch', 'dinner'],
  'pad-thai': ['lunch', 'dinner'],
  'pho': ['lunch', 'dinner'],
  'dumplings': ['lunch', 'dinner', 'snack'],
  'spring-rolls': ['lunch', 'snack'],
  'egg-roll': ['lunch', 'dinner', 'snack'],
  'turkey-sandwich': ['lunch'],
  'grilled-cheese': ['lunch'],
  'blt': ['lunch'],
  'club-sandwich': ['lunch'],
  'pizza-slice': ['lunch', 'dinner'],
  'chicken-nuggets': ['lunch', 'dinner', 'snack'],
  'mac-and-cheese': ['lunch', 'dinner'],
  'falafel': ['lunch', 'dinner'],
  'gyro': ['lunch', 'dinner'],
  'shawarma': ['lunch', 'dinner'],
  'curry-chicken': ['lunch', 'dinner'],
  'dal': ['lunch', 'dinner'],
  'chili': ['lunch', 'dinner'],
  'soup-chicken-noodle': ['lunch', 'dinner'],

  // ── NEW OTHER ──
  'dark-chocolate': ['snack'],
  'potato-chips': ['snack'],
  'pretzels': ['snack'],
  'dried-mango': ['snack'],
  'tempeh': ['lunch', 'dinner'],
  'seitan': ['lunch', 'dinner'],
  'rice-pudding': ['snack'],
  'maple-syrup': ['breakfast'],
  'jam': ['breakfast', 'snack'],
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
