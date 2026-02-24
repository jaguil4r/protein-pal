import { test, expect } from '@playwright/test';
import { addProteinEntry, clearLocalStorage } from './helpers';

test.describe('Animal Mood', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('starts with tired mood at 0%', async ({ page }) => {
    const avatar = page.getByTestId('animal-avatar');
    await expect(avatar).toHaveAttribute('data-mood', 'tired');
  });

  test('shows full mood immediately after adding entry', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');

    // Just added a meal, should be "full"
    const avatar = page.getByTestId('animal-avatar');
    await expect(avatar).toHaveAttribute('data-mood', 'full');
  });

  test('shows motivated mood at 30-70%', async ({ page }) => {
    // Set up localStorage to simulate a meal eaten 1 hour ago
    await page.evaluate(() => {
      const oneHourAgo = Date.now() - (1 * 60 * 60 * 1000);
      localStorage.setItem('proteinpal_last_meal_time', JSON.stringify(oneHourAgo));

      const today = new Date();
      const dateKey = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');

      const dayData = {
        date: dateKey,
        entries: [{
          id: 'test-1',
          name: 'Protein shake',
          protein: 55,
          category: 'breakfast',
          timestamp: oneHourAgo
        }],
        goal: 160
      };
      localStorage.setItem('proteinpal_data_' + dateKey, JSON.stringify(dayData));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // 55/160 = 34% -> motivated (and 1hr since meal so not full)
    const avatar = page.getByTestId('animal-avatar');
    await expect(avatar).toHaveAttribute('data-mood', 'motivated');
  });

  test('shows happy mood at 70-100%', async ({ page }) => {
    await page.evaluate(() => {
      const oneHourAgo = Date.now() - (1 * 60 * 60 * 1000);
      localStorage.setItem('proteinpal_last_meal_time', JSON.stringify(oneHourAgo));

      const today = new Date();
      const dateKey = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');

      const dayData = {
        date: dateKey,
        entries: [{
          id: 'test-1',
          name: 'Big meal',
          protein: 120,
          category: 'lunch',
          timestamp: oneHourAgo
        }],
        goal: 160
      };
      localStorage.setItem('proteinpal_data_' + dateKey, JSON.stringify(dayData));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // 120/160 = 75% -> happy
    const avatar = page.getByTestId('animal-avatar');
    await expect(avatar).toHaveAttribute('data-mood', 'happy');
  });

  test('shows flexing mood at 100%+', async ({ page }) => {
    await page.evaluate(() => {
      const oneHourAgo = Date.now() - (1 * 60 * 60 * 1000);
      localStorage.setItem('proteinpal_last_meal_time', JSON.stringify(oneHourAgo));

      const today = new Date();
      const dateKey = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');

      const dayData = {
        date: dateKey,
        entries: [{
          id: 'test-1',
          name: 'Huge meal',
          protein: 170,
          category: 'dinner',
          timestamp: oneHourAgo
        }],
        goal: 160
      };
      localStorage.setItem('proteinpal_data_' + dateKey, JSON.stringify(dayData));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // 170/160 = 106% -> flexing
    const avatar = page.getByTestId('animal-avatar');
    await expect(avatar).toHaveAttribute('data-mood', 'flexing');
  });

  test('shows hungry mood when overdue and under goal', async ({ page }) => {
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
          name: 'Small meal',
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

    // 30/160 = 18.75% with 4h elapsed (over default 3h interval) -> hungry
    const avatar = page.getByTestId('animal-avatar');
    await expect(avatar).toHaveAttribute('data-mood', 'hungry');
  });
});
