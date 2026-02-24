import { test, expect } from '@playwright/test';
import { addProteinEntry, clearLocalStorage, openSettings } from './helpers';

test.describe('Cheat Day System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('cheat day toggle is visible and shows remaining days', async ({ page }) => {
    const toggle = page.getByTestId('cheat-day-toggle');
    await expect(toggle).toBeVisible();
    await expect(page.getByTestId('cheat-days-remaining')).toContainText('1 left');
  });

  test('toggling cheat day on shows active state', async ({ page }) => {
    const toggle = page.getByTestId('cheat-day-toggle');
    await toggle.click();
    await expect(toggle).toHaveClass(/cheat-day-toggle--active/);
    await expect(page.getByTestId('cheat-days-remaining')).toContainText('Relax!');
  });

  test('toggling cheat day off restores inactive state', async ({ page }) => {
    const toggle = page.getByTestId('cheat-day-toggle');
    await toggle.click();
    await expect(toggle).toHaveClass(/cheat-day-toggle--active/);

    await toggle.click();
    await expect(toggle).not.toHaveClass(/cheat-day-toggle--active/);
    await expect(page.getByTestId('cheat-days-remaining')).toContainText('1 left');
  });

  test('cheat day persists after page reload', async ({ page }) => {
    await page.getByTestId('cheat-day-toggle').click();
    await expect(page.getByTestId('cheat-day-toggle')).toHaveClass(/cheat-day-toggle--active/);

    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId('cheat-day-toggle')).toHaveClass(/cheat-day-toggle--active/);
    await expect(page.getByTestId('cheat-days-remaining')).toContainText('Relax!');
  });

  test('cheat day disables when no remaining days', async ({ page }) => {
    // Set cheatDaysPerWeek to 0 so no cheat days available
    await page.evaluate(() => {
      const key = 'proteinpal_settings';
      const settings = JSON.parse(localStorage.getItem(key) || '{}');
      settings.cheatDaysPerWeek = 0;
      localStorage.setItem(key, JSON.stringify(settings));
    });
    await page.reload();
    await page.waitForLoadState('networkidle');

    const toggle = page.getByTestId('cheat-day-toggle');
    await expect(toggle).toBeDisabled();
    await expect(page.getByTestId('cheat-days-remaining')).toContainText('0 left');
  });

  test('cheat day affects mood — avatar stays positive', async ({ page }) => {
    // Without cheat day, no entries = tired mood
    const avatar = page.getByTestId('animal-avatar');
    await expect(avatar).toHaveAttribute('data-mood', 'tired');

    // Toggle cheat day on
    await page.getByTestId('cheat-day-toggle').click();

    // With cheat day and no entries, mood should be "motivated" (positive)
    await expect(avatar).toHaveAttribute('data-mood', 'motivated');
  });

  test('cheat day shows toast on activation', async ({ page }) => {
    await page.getByTestId('cheat-day-toggle').click();

    // Should see cheat day toast
    const toast = page.locator('.toast--success');
    await expect(toast).toBeVisible();
    await expect(toast).toContainText('Cheat day activated');
  });

  test('settings allows changing cheat days per week', async ({ page }) => {
    await openSettings(page);

    const value = page.getByTestId('cheat-days-value');
    await expect(value).toContainText('1');

    // Increase to 2
    await page.getByTestId('cheat-days-increase').click();
    await expect(value).toContainText('2');

    // Decrease back to 1
    await page.getByTestId('cheat-days-decrease').click();
    await expect(value).toContainText('1');

    // Cannot go below 0
    await page.getByTestId('cheat-days-decrease').click();
    await expect(value).toContainText('0');
    await page.getByTestId('cheat-days-decrease').click();
    await expect(value).toContainText('0');
  });

  test('weekly summary reflects cheat day status', async ({ page }) => {
    // Toggle cheat day on
    await page.getByTestId('cheat-day-toggle').click();

    // Weekly summary should show 1 cheat day used
    const cheatDays = page.getByTestId('weekly-cheat-days');
    await expect(cheatDays).toContainText('1/1 used');
  });
});
