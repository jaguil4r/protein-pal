import { test, expect } from '@playwright/test';
import { addProteinEntry, clearLocalStorage } from './helpers';

test.describe('Streak System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('no streak badge shown initially', async ({ page }) => {
    // With no streak history, badge should not appear
    await expect(page.getByTestId('streak-badge')).toHaveCount(0);
  });

  test('streak badge appears after meeting goal', async ({ page }) => {
    // Set up streak data via localStorage (simulate yesterday meeting goal)
    await page.evaluate(() => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey =
        yesterday.getFullYear() + '-' +
        String(yesterday.getMonth() + 1).padStart(2, '0') + '-' +
        String(yesterday.getDate()).padStart(2, '0');

      // Save yesterday's data with goal met
      const dayData = {
        date: yesterdayKey,
        entries: [{ id: 'y1', name: 'Meals', protein: 170, category: 'breakfast', timestamp: yesterday.getTime() }],
        goal: 160,
      };
      localStorage.setItem('proteinpal_data_' + yesterdayKey, JSON.stringify(dayData));

      // Save streak data
      const streakData = {
        currentStreak: 1,
        longestStreak: 1,
        lastGoalMetDate: yesterdayKey,
        tier: 'none',
      };
      localStorage.setItem('proteinpal_streak', JSON.stringify(streakData));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Now hit today's goal to trigger streak increment
    await addProteinEntry(page, 'Big meal', 80, 'breakfast');
    await addProteinEntry(page, 'Big meal 2', 80, 'lunch');
    await addProteinEntry(page, 'Extra', 10, 'snack');

    // Streak badge should appear
    await expect(page.getByTestId('streak-badge')).toBeVisible();
    await expect(page.getByTestId('streak-count')).toBeVisible();
  });

  test('streak resets when goal missed', async ({ page }) => {
    // Simulate streak but yesterday was missed
    await page.evaluate(() => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoKey =
        twoDaysAgo.getFullYear() + '-' +
        String(twoDaysAgo.getMonth() + 1).padStart(2, '0') + '-' +
        String(twoDaysAgo.getDate()).padStart(2, '0');

      const streakData = {
        currentStreak: 5,
        longestStreak: 5,
        lastGoalMetDate: twoDaysAgoKey,
        tier: 'bronze',
      };
      localStorage.setItem('proteinpal_streak', JSON.stringify(streakData));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Streak should be reset (badge hidden since streak = 0)
    await expect(page.getByTestId('streak-badge')).toHaveCount(0);
  });

  test('tier upgrades at correct thresholds', async ({ page }) => {
    // Set up a 7-day streak (silver tier)
    await page.evaluate(() => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey =
        yesterday.getFullYear() + '-' +
        String(yesterday.getMonth() + 1).padStart(2, '0') + '-' +
        String(yesterday.getDate()).padStart(2, '0');

      // Yesterday met goal
      const dayData = {
        date: yesterdayKey,
        entries: [{ id: 'y1', name: 'Meals', protein: 170, category: 'breakfast', timestamp: yesterday.getTime() }],
        goal: 160,
      };
      localStorage.setItem('proteinpal_data_' + yesterdayKey, JSON.stringify(dayData));

      const streakData = {
        currentStreak: 7,
        longestStreak: 7,
        lastGoalMetDate: yesterdayKey,
        tier: 'silver',
      };
      localStorage.setItem('proteinpal_streak', JSON.stringify(streakData));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Badge should show silver tier
    const badge = page.getByTestId('streak-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('Silver');
    await expect(page.getByTestId('streak-count')).toContainText('7');
  });

  test('streak badge shows flame emoji', async ({ page }) => {
    await page.evaluate(() => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey =
        yesterday.getFullYear() + '-' +
        String(yesterday.getMonth() + 1).padStart(2, '0') + '-' +
        String(yesterday.getDate()).padStart(2, '0');

      const dayData = {
        date: yesterdayKey,
        entries: [{ id: 'y1', name: 'Meals', protein: 170, category: 'breakfast', timestamp: yesterday.getTime() }],
        goal: 160,
      };
      localStorage.setItem('proteinpal_data_' + yesterdayKey, JSON.stringify(dayData));

      const streakData = {
        currentStreak: 3,
        longestStreak: 3,
        lastGoalMetDate: yesterdayKey,
        tier: 'bronze',
      };
      localStorage.setItem('proteinpal_streak', JSON.stringify(streakData));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    const badge = page.getByTestId('streak-badge');
    await expect(badge).toBeVisible();
    await expect(badge).toContainText('🔥');
    await expect(badge).toContainText('day streak');
  });
});
