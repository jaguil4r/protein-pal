import { test, expect } from '@playwright/test';
import { openSettings, clearLocalStorage } from './helpers';

test.describe('Protein Goal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('shows default goal of 160g', async ({ page }) => {
    await expect(page.getByTestId('progress-text')).toContainText('160g');
  });

  test('can change goal via settings', async ({ page }) => {
    await openSettings(page);
    // Increase goal by 10 (to 170g)
    await page.getByTestId('goal-increase').click();
    await expect(page.getByTestId('goal-value')).toContainText('170g');

    // Close settings
    await page.getByTestId('settings-panel').locator('button[aria-label="Close settings"]').click();

    // Verify progress text shows new goal
    await expect(page.getByTestId('progress-text')).toContainText('170g');
  });

  test('can decrease goal via settings', async ({ page }) => {
    await openSettings(page);
    // Decrease goal by 10 (to 150g)
    await page.getByTestId('goal-decrease').click();
    await expect(page.getByTestId('goal-value')).toContainText('150g');
  });

  test('goal persists on reload', async ({ page }) => {
    await openSettings(page);
    // Increase goal twice (to 180g)
    await page.getByTestId('goal-increase').click();
    await page.getByTestId('goal-increase').click();
    await expect(page.getByTestId('goal-value')).toContainText('180g');

    // Close and reload
    await page.getByTestId('settings-panel').locator('button[aria-label="Close settings"]').click();
    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId('progress-text')).toContainText('180g');
  });
});
