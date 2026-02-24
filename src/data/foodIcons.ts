/**
 * Food-specific emoji icons keyed by food database ID.
 * Falls back to CATEGORY_ICONS if no specific icon found.
 */
export const FOOD_ICONS: Record<string, string> = {
  // ── CHICKEN ──
  'chicken-breast': '🍗',
  'chicken-thigh': '🍗',
  'rotisserie-chicken': '🍗',
  'chicken-wings': '🍗',
  'chicken-tenders': '🍗',
  'chicken-drumstick': '🍗',

  // ── BEEF ──
  'ribeye-steak': '🥩',
  'filet-mignon': '🥩',
  'ny-strip': '🥩',
  'ground-beef': '🥩',
  'sliced-eye-round': '🥩',
  'bison': '🥩',

  // ── PORK / DELI ──
  'bacon': '🥓',
  'pork-ribs': '🍖',
  'pork-chop': '🍖',
  'deli-turkey': '🥪',
  'deli-ham': '🥪',
  'pork-sausage': '🌭',

  // ── TURKEY ──
  'ground-turkey': '🦃',
  'turkey-breast': '🦃',

  // ── OTHER MEAT ──
  'hot-dog': '🌭',
  'ham': '🍖',
  'lamb-chop': '🍖',

  // ── SEAFOOD ──
  'salmon': '🐟',
  'tilapia': '🐟',
  'cod': '🐟',
  'shrimp': '🍤',
  'tuna-canned': '🐟',

  // ── EGGS ──
  'eggs': '🥚',
  'egg-whites': '🥚',

  // ── DAIRY ──
  'cottage-cheese': '🧀',
  'greek-yogurt': '🥣',
  'regular-yogurt': '🥣',
  'mozzarella': '🧀',
  'string-cheese': '🧀',
  'cheddar-cheese': '🧀',
  'cream-cheese': '🧀',
  'heavy-cream': '🥛',
  'sour-cream': '🥛',
  'milk-whole': '🥛',
  'milk-2percent': '🥛',
  'butter': '🧈',
  'american-cheese': '🧀',

  // ── GRAINS ──
  'white-rice': '🍚',
  'brown-rice': '🍚',
  'jasmine-rice': '🍚',
  'bread-white': '🍞',
  'bread-wheat': '🍞',
  'tortilla-flour': '🫓',
  'tortilla-corn': '🫓',
  'pasta': '🍝',
  'oatmeal': '🥣',
  'bagel': '🥯',
  'cereal': '🥣',
  'pancakes': '🥞',
  'waffles': '🧇',
  'granola': '🥣',
  'crackers': '🍘',

  // ── VEGETABLES ──
  'broccoli': '🥦',
  'spinach': '🥬',
  'asparagus': '🌿',
  'bell-pepper': '🫑',
  'green-beans': '🫘',
  'sweet-potato': '🍠',
  'avocado': '🥑',
  'tomato': '🍅',
  'cucumber': '🥒',
  'onion': '🧅',
  'corn': '🌽',
  'mushrooms': '🍄',
  'zucchini': '🥒',
  'lettuce-romaine': '🥬',
  'potato': '🥔',
  'carrots': '🥕',
  'cauliflower': '🥦',
  'peas': '🫛',
  'cabbage': '🥬',

  // ── FRUITS ──
  'banana': '🍌',
  'apple': '🍎',
  'strawberries': '🍓',
  'blueberries': '🫐',
  'grapes': '🍇',
  'watermelon': '🍉',
  'orange': '🍊',
  'pineapple': '🍍',
  'mixed-berries': '🫐',
  'raspberries': '🍓',

  // ── SAUCES / CONDIMENTS ──
  'ranch-dressing': '🥗',
  'bbq-sauce': '🍯',
  'hot-sauce': '🌶️',
  'soy-sauce': '🥢',
  'olive-oil': '🫒',
  'mayo': '🥄',
  'salsa': '🍅',
  'guacamole': '🥑',
  'ketchup': '🍅',
  'mustard': '🟡',
  'honey': '🍯',

  // ── HERBS / SPICES ──
  'garlic': '🧄',
  'cilantro': '🌿',
  'parsley': '🌿',
  'lemon-juice': '🍋',

  // ── BEVERAGES ──
  'protein-shake': '🥤',
  'coffee-black': '☕',
  'coffee-with-cream': '☕',
  'orange-juice': '🍊',
  'water': '💧',
  'smoothie': '🥤',
  'tea': '🍵',
  'almond-milk': '🥛',
  'sports-drink': '🥤',
  'chocolate-milk': '🍫',

  // ── OTHER / SNACKS ──
  'peanut-butter': '🥜',
  'almonds': '🌰',
  'mixed-nuts': '🥜',
  'protein-bar': '🍫',
  'jerky-beef': '🥩',
  'hummus': '🫘',
  'beans-black': '🫘',
  'tofu': '🫧',
  'popcorn': '🍿',
  'tortilla-chips': '🌮',
  'granola-bar': '🍫',
  'trail-mix': '🥜',
  'peanuts': '🥜',
};

const CATEGORY_ICONS: Record<string, string> = {
  'protein': '🍖',
  'dairy': '🧀',
  'grain': '🍞',
  'vegetable': '🥦',
  'fruit': '🍎',
  'beverage': '🥤',
  'other': '🥜',
  'sauce': '🍲',
};

/**
 * Get the best emoji icon for a food item.
 * Looks up by food ID first, falls back to category icon.
 */
export function getFoodIcon(foodId: string, category: string): string {
  return FOOD_ICONS[foodId] || CATEGORY_ICONS[category] || '🍽️';
}
