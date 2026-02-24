import { UserSettings, DayData, MealCategory, StreakData, StreakTier, XpData, ProteinEntry } from '../types';

const SETTINGS_KEY = 'proteinpal_settings';
const DATA_PREFIX = 'proteinpal_data_';
const LAST_MEAL_KEY = 'proteinpal_last_meal_time';
const FAVORITES_KEY = 'proteinpal_favorites';
const STREAK_KEY = 'proteinpal_streak';
const XP_KEY = 'proteinpal_xp';
const ONBOARDING_KEY = 'proteinpal_onboarding_complete';
const LAST_BACKUP_KEY = 'proteinpal_last_backup';

// ── STORAGE ERROR HANDLING ──

export type StorageError = 'quota_exceeded' | 'write_failed' | 'read_corrupted';
type StorageErrorCallback = (error: StorageError, detail: string) => void;
let onStorageError: StorageErrorCallback | null = null;

export function setStorageErrorHandler(handler: StorageErrorCallback): void {
  onStorageError = handler;
}

function safeSetItem(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    const isQuota = e instanceof DOMException && (
      e.code === 22 ||
      e.code === 1014 ||
      e.name === 'QuotaExceededError' ||
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    );
    const errorType: StorageError = isQuota ? 'quota_exceeded' : 'write_failed';
    console.error(`Storage error (${errorType}):`, e);
    onStorageError?.(errorType, key);
    return false;
  }
}

// ── SECURITY: PROTOTYPE POLLUTION GUARD ──

const BANNED_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const clean = {} as T;
  for (const key of Object.keys(obj)) {
    if (!BANNED_KEYS.has(key)) {
      (clean as Record<string, unknown>)[key] = obj[key];
    }
  }
  return clean;
}

// ── DATA VALIDATION ──

const VALID_CATEGORIES = new Set(['breakfast', 'lunch', 'dinner', 'snack']);
const DATE_KEY_RE = /^\d{4}-\d{2}-\d{2}$/;

export function isValidEntry(entry: unknown): entry is ProteinEntry {
  if (!entry || typeof entry !== 'object') return false;
  const e = entry as Record<string, unknown>;
  return (
    typeof e.id === 'string' &&
    typeof e.name === 'string' &&
    e.name.length > 0 &&
    e.name.length <= 200 &&
    typeof e.protein === 'number' &&
    e.protein >= 0 &&
    e.protein <= 10000 &&
    typeof e.timestamp === 'number' &&
    (!e.category || VALID_CATEGORIES.has(e.category as string))
  );
}

export function isValidDayData(data: unknown): data is DayData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    typeof d.date === 'string' &&
    DATE_KEY_RE.test(d.date) &&
    Array.isArray(d.entries) &&
    d.entries.length <= 100 &&
    typeof d.goal === 'number' &&
    d.goal > 0 &&
    d.goal <= 10000
  );
}

// ── ONBOARDING ──

export function isOnboardingComplete(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === 'true';
}

export function markOnboardingComplete(): void {
  safeSetItem(ONBOARDING_KEY, 'true');
}

// ── BACKUP TRACKING ──

export function getLastBackupDate(): string | null {
  return localStorage.getItem(LAST_BACKUP_KEY);
}

export function setLastBackupDate(): void {
  safeSetItem(LAST_BACKUP_KEY, new Date().toISOString());
}

export function shouldSuggestBackup(): boolean {
  const last = getLastBackupDate();
  if (!last) {
    const allData = getAllData();
    return allData.length >= 7;
  }
  const daysSince = (Date.now() - new Date(last).getTime()) / (1000 * 60 * 60 * 24);
  return daysSince >= 7;
}

export interface FavoriteEntry {
  name: string;
  protein: number;
  carbs: number;
  calories: number;
  fiber: number;
  category: MealCategory;
  count: number;
}

export const defaultSettings: UserSettings = {
  dailyGoal: 160,
  selectedAnimal: 'sloth',
  darkMode: false,
  mealInterval: 3,
  notificationsEnabled: false,
  carbGoal: 250,
  calorieGoal: 2000,
  fiberGoal: 25,
  eatingWindowMode: 'auto',
  workoutDays: [1, 3, 5],  // Mon, Wed, Fri
  cheatDaysPerWeek: 1,
  showMacros: true,
  showWater: true,
  waterGoalOz: 64,
  showWeeklySummary: true,
  suggestionMode: 'snack',
};

export function getSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...defaultSettings, ...sanitizeObject(JSON.parse(raw)) };
    }
  } catch {}
  return { ...defaultSettings };
}

export function saveSettings(settings: UserSettings): void {
  safeSetItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getDayData(dateKey: string): DayData {
  try {
    const raw = localStorage.getItem(DATA_PREFIX + dateKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidDayData(parsed)) {
        parsed.entries = parsed.entries.filter(isValidEntry);
        return parsed;
      }
      console.warn('Corrupted day data for', dateKey);
      onStorageError?.('read_corrupted', DATA_PREFIX + dateKey);
    }
  } catch {
    onStorageError?.('read_corrupted', DATA_PREFIX + dateKey);
  }
  const settings = getSettings();
  return {
    date: dateKey,
    entries: [],
    goal: settings.dailyGoal,
    macroGoals: {
      carbs: settings.carbGoal,
      calories: settings.calorieGoal,
      fiber: settings.fiberGoal,
    },
  };
}

export function saveDayData(data: DayData): void {
  safeSetItem(DATA_PREFIX + data.date, JSON.stringify(data));
}

export function getLastMealTime(): number | null {
  try {
    const raw = localStorage.getItem(LAST_MEAL_KEY);
    if (raw) {
      const val = JSON.parse(raw);
      // Only return if from today (reset daily)
      const today = new Date();
      const mealDate = new Date(val);
      if (
        mealDate.getFullYear() === today.getFullYear() &&
        mealDate.getMonth() === today.getMonth() &&
        mealDate.getDate() === today.getDate()
      ) {
        return val;
      }
    }
  } catch {}
  return null;
}

export function setLastMealTime(timestamp: number): void {
  safeSetItem(LAST_MEAL_KEY, JSON.stringify(timestamp));
}

export function clearLastMealTime(): void {
  try {
    localStorage.removeItem(LAST_MEAL_KEY);
  } catch (e) {
    console.error('Failed to clear last meal time:', e);
  }
}

export function getAllData(): DayData[] {
  const days: DayData[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(DATA_PREFIX)) {
      try {
        const parsed = JSON.parse(localStorage.getItem(key)!);
        if (isValidDayData(parsed)) {
          parsed.entries = parsed.entries.filter(isValidEntry);
          days.push(parsed);
        }
      } catch {}
    }
  }
  return days.sort((a, b) => a.date.localeCompare(b.date));
}

// ── FAVORITES ──

export function getFavorites(): FavoriteEntry[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migrate old favorites that don't have macro fields
      return parsed
        .filter((f: any) => f && typeof f === 'object' && typeof f.name === 'string' && f.name.length <= 200)
        .map((f: any) => ({
          name: f.name,
          protein: typeof f.protein === 'number' ? f.protein : 0,
          carbs: typeof f.carbs === 'number' ? f.carbs : 0,
          calories: typeof f.calories === 'number' ? f.calories : 0,
          fiber: typeof f.fiber === 'number' ? f.fiber : 0,
          category: VALID_CATEGORIES.has(f.category) ? f.category : 'snack',
          count: typeof f.count === 'number' ? f.count : 1,
        }));
    }
  } catch {}
  return [];
}

export function updateFavorites(
  name: string,
  protein: number,
  category: MealCategory,
  macros?: { carbs: number; calories: number; fiber: number }
): void {
  try {
    const favorites = getFavorites();
    const existing = favorites.find(
      (f) => f.name.toLowerCase() === name.toLowerCase() && f.protein === protein
    );

    if (existing) {
      existing.count++;
      existing.category = category;
      if (macros) {
        existing.carbs = macros.carbs;
        existing.calories = macros.calories;
        existing.fiber = macros.fiber;
      }
    } else {
      favorites.push({
        name,
        protein,
        carbs: macros?.carbs ?? 0,
        calories: macros?.calories ?? 0,
        fiber: macros?.fiber ?? 0,
        category,
        count: 1,
      });
    }

    // Keep top 10 by frequency
    favorites.sort((a, b) => b.count - a.count);
    const trimmed = favorites.slice(0, 10);
    safeSetItem(FAVORITES_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('Failed to update favorites:', e);
  }
}

export function getTopFavorites(limit = 5): FavoriteEntry[] {
  return getFavorites()
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

export function getCategoryFavorites(category: MealCategory, limit = 5): FavoriteEntry[] {
  return getFavorites()
    .filter((f) => f.category === category)
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

// ── CHEAT DAY ──

/**
 * Get the Monday date key for the week containing the given date.
 */
function getWeekMondayKey(date: Date): string {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun ... 6=Sat
  const diff = day === 0 ? -6 : 1 - day; // offset to get Monday
  d.setDate(d.getDate() + diff);
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

/**
 * Get all 7 date keys (Mon–Sun) for the week containing the given date.
 */
export function getWeekDateKeys(date: Date): string[] {
  const monday = new Date(date);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff);

  const keys: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    keys.push(
      d.getFullYear() +
      '-' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(d.getDate()).padStart(2, '0')
    );
  }
  return keys;
}

/**
 * Count how many cheat days have been used in the current week (Mon–Sun).
 */
export function getCheatDaysUsedThisWeek(): number {
  const weekKeys = getWeekDateKeys(new Date());
  let count = 0;
  for (const key of weekKeys) {
    const data = getDayData(key);
    if (data.isCheatDay) count++;
  }
  return count;
}

/**
 * Toggle cheat day status for a given date.
 */
export function toggleCheatDay(dateKey: string): DayData {
  const data = getDayData(dateKey);
  data.isCheatDay = !data.isCheatDay;
  saveDayData(data);
  return data;
}

/**
 * Check if a day counts as "goal met" (either actual goal met or cheat day).
 */
function isDayGoalMetOrCheat(dateKey: string): boolean {
  const data = getDayData(dateKey);
  if (data.isCheatDay) return true;
  const total = data.entries.reduce((sum, e) => sum + e.protein, 0);
  return total >= data.goal;
}

// ── STREAK ──

const defaultStreak: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastGoalMetDate: '',
  tier: 'none',
};

function calculateStreakTier(streak: number): StreakTier {
  if (streak >= 30) return 'queen';
  if (streak >= 14) return 'gold';
  if (streak >= 7) return 'silver';
  if (streak >= 3) return 'bronze';
  return 'none';
}

export function getStreak(): StreakData {
  try {
    const raw = localStorage.getItem(STREAK_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object' && typeof parsed.currentStreak === 'number') {
        return { ...defaultStreak, ...sanitizeObject(parsed) };
      }
      onStorageError?.('read_corrupted', STREAK_KEY);
    }
  } catch {
    onStorageError?.('read_corrupted', STREAK_KEY);
  }
  return { ...defaultStreak };
}

export function saveStreak(data: StreakData): void {
  safeSetItem(STREAK_KEY, JSON.stringify(data));
}

/**
 * Check yesterday's data and update streak accordingly.
 * Call on app load.
 */
export function checkAndUpdateStreak(): StreakData {
  const streak = getStreak();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayKey =
    yesterday.getFullYear() +
    '-' +
    String(yesterday.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(yesterday.getDate()).padStart(2, '0');

  const todayKey =
    today.getFullYear() +
    '-' +
    String(today.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(today.getDate()).padStart(2, '0');

  // Already checked today
  if (streak.lastGoalMetDate === todayKey) {
    return streak;
  }

  // Check yesterday's data — cheat days count as goal met
  const goalMet = isDayGoalMetOrCheat(yesterdayKey);

  if (goalMet) {
    if (streak.lastGoalMetDate === yesterdayKey) {
      // Already counted
    } else {
      const lastDate = streak.lastGoalMetDate ? new Date(streak.lastGoalMetDate) : null;
      const diffDays = lastDate
        ? Math.floor((yesterday.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      if (diffDays <= 1) {
        streak.currentStreak++;
      } else {
        streak.currentStreak = 1;
      }
      streak.lastGoalMetDate = yesterdayKey;
    }
  } else {
    // Yesterday's goal was NOT met — reset if we're past a day
    const lastDate = streak.lastGoalMetDate ? new Date(streak.lastGoalMetDate) : null;
    if (lastDate) {
      const diffDays = Math.floor(
        (yesterday.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays >= 1) {
        streak.currentStreak = 0;
      }
    }
  }

  streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
  streak.tier = calculateStreakTier(streak.currentStreak);
  saveStreak(streak);
  return streak;
}

/**
 * Mark today's goal as met (call when protein >= goal).
 */
export function markTodayGoalMet(): StreakData {
  const streak = getStreak();
  const today = new Date();
  const todayKey =
    today.getFullYear() +
    '-' +
    String(today.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(today.getDate()).padStart(2, '0');

  if (streak.lastGoalMetDate !== todayKey) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey =
      yesterday.getFullYear() +
      '-' +
      String(yesterday.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(yesterday.getDate()).padStart(2, '0');

    if (streak.lastGoalMetDate === yesterdayKey) {
      streak.currentStreak++;
    } else if (streak.currentStreak === 0) {
      streak.currentStreak = 1;
    }

    streak.lastGoalMetDate = todayKey;
    streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
    streak.tier = calculateStreakTier(streak.currentStreak);
    saveStreak(streak);
  }

  return streak;
}

// ── XP SYSTEM ──

const XP_THRESHOLDS = [0, 100, 300, 700, 1200];

const defaultXp: XpData = {
  totalXp: 0,
  level: 1,
  lastEntryAwardDate: '',
  last50Date: '',
  last100Date: '',
  entryCountToday: 0,
};

export function calculateLevel(totalXp: number): number {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= XP_THRESHOLDS[i]) return i + 1;
  }
  return 1;
}

export function getXpThresholds(): number[] {
  return [...XP_THRESHOLDS];
}

function getTodayKey(): string {
  const today = new Date();
  return (
    today.getFullYear() +
    '-' +
    String(today.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(today.getDate()).padStart(2, '0')
  );
}

export function getXpData(): XpData {
  try {
    const raw = localStorage.getItem(XP_KEY);
    if (raw) {
      const rawParsed = JSON.parse(raw);
      if (rawParsed && typeof rawParsed === 'object' && typeof rawParsed.totalXp === 'number') {
        const parsed = { ...defaultXp, ...sanitizeObject(rawParsed) };
        // Reset daily counters if it's a new day
        const todayKey = getTodayKey();
        if (parsed.lastEntryAwardDate !== todayKey) {
          parsed.entryCountToday = 0;
        }
        parsed.level = calculateLevel(parsed.totalXp);
        return parsed;
      }
      onStorageError?.('read_corrupted', XP_KEY);
    }
  } catch {
    onStorageError?.('read_corrupted', XP_KEY);
  }
  return { ...defaultXp };
}

export function saveXpData(data: XpData): void {
  safeSetItem(XP_KEY, JSON.stringify(data));
}

/**
 * Award +10 XP for logging an entry.
 * Tracks how many entries have been awarded today.
 */
export function awardEntryXp(): XpData {
  const xp = getXpData();
  const todayKey = getTodayKey();

  if (xp.lastEntryAwardDate !== todayKey) {
    xp.entryCountToday = 0;
    xp.lastEntryAwardDate = todayKey;
  }

  xp.totalXp += 10;
  xp.entryCountToday++;
  xp.level = calculateLevel(xp.totalXp);
  saveXpData(xp);
  return xp;
}

/**
 * Award milestone XP for hitting 50% or 100% of daily goal.
 * Each milestone awarded once per day.
 * At 100%, also awards streak bonus (streak × 5).
 */
export function awardMilestoneXp(progressPercent: number, currentStreak: number): XpData {
  const xp = getXpData();
  const todayKey = getTodayKey();
  let changed = false;

  // 50% milestone: +25 XP
  if (progressPercent >= 50 && xp.last50Date !== todayKey) {
    xp.totalXp += 25;
    xp.last50Date = todayKey;
    changed = true;
  }

  // 100% milestone: +50 XP + streak bonus
  if (progressPercent >= 100 && xp.last100Date !== todayKey) {
    xp.totalXp += 50;
    xp.totalXp += currentStreak * 5;
    xp.last100Date = todayKey;
    changed = true;
  }

  if (changed) {
    xp.level = calculateLevel(xp.totalXp);
    saveXpData(xp);
  }

  return xp;
}
