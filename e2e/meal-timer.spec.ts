import { test, expect } from '@playwright/test';
import { addProteinEntry, clearLocalStorage } from './helpers';

test.describe('Meal Timer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('shows no meals message initially', async ({ page }) => {
    await expect(page.getByTestId('meal-timer-text')).toContainText('No meals logged yet');
  });

  test('shows countdown after adding entry', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');

    // Should now show a countdown
    const timerText = await page.getByTestId('meal-timer-text').textContent();
    expect(timerText).toMatch(/Next meal in|0m/);
  });

  test('shows overdue when past meal interval', async ({ page }) => {
    // Set last meal time to 4 hours ago (beyond default 3h interval)
    await page.evaluate(() => {
      const fourHoursAgo = Date.now() - (4 * 60 * 60 * 1000);
      localStorage.setItem('proteinpal_last_meal_time', JSON.stringify(fourHoursAgo));

      const today = new Date();
      const dateKey = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');

      const dayData = {
        date: dateKey,
        entries: [{
          id: 'test-1',
          name: 'Old meal',
          protein: 30,
          category: 'breakfast',
          timestamp: fourHoursAgo
        }],
        goal: 160
      };
      localStorage.setItem('proteinpal_data_' + dateKey, JSON.stringify(dayData));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId('meal-timer-text')).toContainText('overdue');
  });

  test('overdue dot has pulsing animation class', async ({ page }) => {
    await page.evaluate(() => {
      const fourHoursAgo = Date.now() - (4 * 60 * 60 * 1000);
      localStorage.setItem('proteinpal_last_meal_time', JSON.stringify(fourHoursAgo));

      const today = new Date();
      const dateKey = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');

      const dayData = {
        date: dateKey,
        entries: [{
          id: 'test-1',
          name: 'Old meal',
          protein: 30,
          category: 'breakfast',
          timestamp: fourHoursAgo
        }],
        goal: 160
      };
      localStorage.setItem('proteinpal_data_' + dateKey, JSON.stringify(dayData));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    const dot = page.locator('.meal-timer__dot');
    await expect(dot).toHaveClass(/meal-timer__dot--overdue/);
  });
});
