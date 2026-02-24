export type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type AnimalType = 'sloth' | 'panda' | 'bunny';

export type MoodState = 'tired' | 'hungry' | 'disappointed' | 'motivated' | 'happy' | 'flexing' | 'full';

export type FoodCategory = 'protein' | 'dairy' | 'grain' | 'vegetable' | 'fruit' | 'sauce' | 'beverage' | 'other';

export type StreakTier = 'none' | 'bronze' | 'silver' | 'gold' | 'queen';

export type SuggestionMode = 'snack' | 'coach' | 'none';

export interface MacroData {
  protein: number;
  carbs: number;
  calories: number;
  fiber: number;
}

export interface ServingSize {
  label: string;
  multiplier: number;
}

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  macrosPerServing: MacroData;
  servingSizes: ServingSize[];
  defaultServing: string;
}

export interface ProteinEntry {
  id: string;
  name: string;
  protein: number;
  category: MealCategory;
  timestamp: number;
  carbs?: number;
  calories?: number;
  fiber?: number;
}

export interface DayData {
  date: string;
  entries: ProteinEntry[];
  goal: number;
  macroGoals?: {
    carbs: number;
    calories: number;
    fiber: number;
  };
  isCheatDay?: boolean;
  waterOz?: number;
}

export interface UserSettings {
  dailyGoal: number;
  selectedAnimal: AnimalType;
  darkMode: boolean;
  mealInterval: number;
  notificationsEnabled: boolean;
  carbGoal: number;
  calorieGoal: number;
  fiberGoal: number;
  eatingWindowMode: 'auto' | 'fixed';
  eatingWindowStart?: number; // minutes since midnight (e.g. 420 = 7:00 AM)
  eatingWindowEnd?: number;   // minutes since midnight (e.g. 1260 = 9:00 PM)
  workoutDays: number[];      // 0=Sun,1=Mon,...6=Sat — days marked as workout days
  cheatDaysPerWeek: number;   // max cheat days allowed per week (default: 1)
  showMacros: boolean;        // toggle macro badges visibility
  showWater: boolean;         // toggle water tracker visibility
  waterGoalOz: number;        // daily water intake goal in oz
  showWeeklySummary: boolean; // toggle weekly summary visibility
  suggestionMode: SuggestionMode; // 'snack' | 'coach' | 'none'
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastGoalMetDate: string;
  tier: StreakTier;
}

export interface XpData {
  totalXp: number;
  level: number;
  lastEntryAwardDate: string;
  last50Date: string;
  last100Date: string;
  entryCountToday: number;
}

export type ExportFormat = 'json' | 'csv';
