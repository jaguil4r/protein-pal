import { MoodState } from '../types';

export function calculateMood(
  progressPercent: number,
  hoursSinceLastMeal: number | null,
  mealInterval: number,
  isCheatDay: boolean = false
): MoodState {
  // Cheat day — no negative moods, relaxed vibes
  if (isCheatDay) {
    if (hoursSinceLastMeal !== null && hoursSinceLastMeal < 0.5) return 'full';
    if (progressPercent >= 100) return 'flexing';
    if (progressPercent >= 70) return 'happy';
    if (progressPercent > 0) return 'happy';
    return 'motivated'; // even with no entries, stay positive
  }

  // Just ate (within 30 minutes)
  if (hoursSinceLastMeal !== null && hoursSinceLastMeal < 0.5) {
    return 'full';
  }

  // Overdue for meal and hasn't hit goal
  if (
    hoursSinceLastMeal !== null &&
    hoursSinceLastMeal > mealInterval &&
    progressPercent < 100
  ) {
    return 'hungry';
  }

  // Disappointed: has eaten something but fell off badly
  // Triggers when: progress < 50%, significantly overdue (1.5x interval), has at least some progress
  const hour = new Date().getHours();
  if (
    progressPercent > 0 &&
    progressPercent < 50 &&
    hoursSinceLastMeal !== null &&
    hoursSinceLastMeal > mealInterval * 1.5
  ) {
    return 'disappointed';
  }

  // After 6pm with less than 50% and has eaten = disappointed
  if (
    hour >= 18 &&
    progressPercent > 0 &&
    progressPercent < 50
  ) {
    return 'disappointed';
  }

  // No meals logged yet today
  if (hoursSinceLastMeal === null && progressPercent === 0) {
    return 'tired';
  }

  // Progress-based moods
  if (progressPercent >= 100) return 'flexing';
  if (progressPercent >= 70) return 'happy';
  if (progressPercent >= 30) return 'motivated';
  return 'tired';
}
