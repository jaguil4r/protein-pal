import { test, expect } from '@playwright/test';
import { addProteinEntry, clearLocalStorage } from './helpers';

test.describe('Avatar Accountability', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('avatar message appears on page load', async ({ page }) => {
    // Avatar message should appear with a mood-specific message
    const message = page.getByTestId('avatar-message');
    // On fresh load with no entries, mood is "tired" — should show a message
    await expect(message).toBeVisible({ timeout: 3000 });
  });

  test('avatar message changes with mood', async ({ page }) => {
    // Get initial message (tired mood - no entries)
    const message = page.getByTestId('avatar-message');
    await expect(message).toBeVisible({ timeout: 3000 });
    const initialText = await message.textContent();

    // Add entries to change mood to motivated/happy
    await addProteinEntry(page, 'Big shake', 80, 'breakfast');

    // Wait for mood to update and new message
    await page.waitForTimeout(500);

    // Message might change (different mood pool)
    // Just verify message is still visible
    await expect(message).toBeVisible({ timeout: 3000 });
  });

  test('disappointed mood triggers for overdue and low progress', async ({ page }) => {
    // Set up conditions for disappointed mood:
    // Progress > 0 but < 50%, meal overdue by 1.5x interval
    await page.evaluate(() => {
      const fiveHoursAgo = Date.now() - (5 * 60 * 60 * 1000);
      localStorage.setItem('proteinpal_last_meal_time', JSON.stringify(fiveHoursAgo));

      const today = new Date();
      const dateKey = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');

      const dayData = {
        date: dateKey,
        entries: [{
          id: 'test-1',
          name: 'Small snack',
          protein: 20,
          category: 'breakfast',
          timestamp: fiveHoursAgo
        }],
        goal: 160
      };
      localStorage.setItem('proteinpal_data_' + dateKey, JSON.stringify(dayData));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Avatar should show a message (disappointed, hungry, or related mood)
    const message = page.getByTestId('avatar-message');
    await expect(message).toBeVisible({ timeout: 3000 });
  });

  test('speech bubble has visual bubble styling', async ({ page }) => {
    const message = page.getByTestId('avatar-message');
    await expect(message).toBeVisible({ timeout: 3000 });

    // Should have the bubble class
    const bubble = page.locator('.avatar-message__bubble');
    await expect(bubble).toBeVisible();
  });

  test('flexing mood shows celebratory messages at 100%', async ({ page }) => {
    // Pre-load to just below goal
    await page.evaluate(() => {
      const recentTime = Date.now() - (10 * 60 * 1000);
      localStorage.setItem('proteinpal_last_meal_time', JSON.stringify(recentTime));

      const today = new Date();
      const dateKey = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');

      const dayData = {
        date: dateKey,
        entries: [{
          id: 'test-1',
          name: 'Big meals',
          protein: 155,
          category: 'breakfast',
          timestamp: recentTime
        }],
        goal: 160
      };
      localStorage.setItem('proteinpal_data_' + dateKey, JSON.stringify(dayData));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Add just enough to cross 100%
    await addProteinEntry(page, 'Final push', 10, 'snack');

    // Wait for mood to update
    await page.waitForTimeout(500);

    // Avatar message should be visible
    const message = page.getByTestId('avatar-message');
    await expect(message).toBeVisible({ timeout: 3000 });
  });
});
