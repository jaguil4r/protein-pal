import { test, expect } from '@playwright/test';
import { clearLocalStorage, openSettings, closeSettings } from './helpers';

test.describe('Macro Badges Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('macro badges visible by default when data exists', async ({ page }) => {
    const nameInput = page.getByTestId('entry-name-input');
    await nameInput.fill('Test Meal');
    await page.waitForTimeout(300);
    const dropdown = page.getByTestId('food-suggest-dropdown');
    if (await dropdown.isVisible().catch(() => false)) {
      await page.keyboard.press('Escape');
      await dropdown.waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});
    }
    await page.getByTestId('entry-protein-input').fill('30');
    await page.getByTestId('entry-carbs-input').fill('45');
    await page.getByTestId('entry-calories-input').fill('400');
    await page.getByTestId('entry-fiber-input').fill('5');
    await page.getByTestId('add-entry-button').click();

    await expect(page.getByTestId('mini-ring-carbs')).toBeVisible();
    await expect(page.getByTestId('mini-ring-calories')).toBeVisible();
    await expect(page.getByTestId('mini-ring-fiber')).toBeVisible();
  });

  test('toggle pills are visible on main page', async ({ page }) => {
    await expect(page.getByTestId('macro-toggle-btn')).toBeVisible();
    await expect(page.getByTestId('water-toggle-btn')).toBeVisible();
  });

  test('macro pill toggle hides macro rings', async ({ page }) => {
    const nameInput = page.getByTestId('entry-name-input');
    await nameInput.fill('Test Meal');
    await page.waitForTimeout(300);
    const dropdown = page.getByTestId('food-suggest-dropdown');
    if (await dropdown.isVisible().catch(() => false)) {
      await page.keyboard.press('Escape');
      await dropdown.waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});
    }
    await page.getByTestId('entry-protein-input').fill('30');
    await page.getByTestId('entry-carbs-input').fill('45');
    await page.getByTestId('entry-calories-input').fill('400');
    await page.getByTestId('entry-fiber-input').fill('5');
    await page.getByTestId('add-entry-button').click();

    await expect(page.getByTestId('mini-ring-carbs')).toBeVisible();

    // Click the macros pill toggle on the main page
    await page.getByTestId('macro-toggle-btn').click();

    await expect(page.getByTestId('mini-ring-carbs')).toHaveCount(0);
    await expect(page.getByTestId('mini-ring-calories')).toHaveCount(0);
    await expect(page.getByTestId('mini-ring-fiber')).toHaveCount(0);

    // Water should still be visible
    await expect(page.getByTestId('water-tracker')).toBeVisible();
  });

  test('water pill toggle hides water tracker', async ({ page }) => {
    await expect(page.getByTestId('water-tracker')).toBeVisible();

    // Click the water pill toggle
    await page.getByTestId('water-toggle-btn').click();

    await expect(page.getByTestId('water-tracker')).toHaveCount(0);
  });

  test('pill toggle state persists after reload', async ({ page }) => {
    await page.getByTestId('macro-toggle-btn').click();
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Macro pill should still be inactive (dimmed)
    const macroPill = page.getByTestId('macro-toggle-btn');
    await expect(macroPill).not.toHaveClass(/macro-dashboard__toggle-pill--active/);
  });

  test('pill toggle syncs with settings toggle', async ({ page }) => {
    // Toggle off via main page pill
    await page.getByTestId('macro-toggle-btn').click();

    // Open settings and verify settings toggle is also off
    await openSettings(page);
    const settingsToggle = page.getByTestId('settings-show-macros-toggle');
    await expect(settingsToggle).not.toHaveClass(/settings-toggle--active/);
  });

  test('settings toggle syncs with pill toggle', async ({ page }) => {
    // Toggle off via settings
    await openSettings(page);
    await page.getByTestId('settings-show-macros-toggle').click();
    await closeSettings(page);

    // Pill should be inactive
    const macroPill = page.getByTestId('macro-toggle-btn');
    await expect(macroPill).not.toHaveClass(/macro-dashboard__toggle-pill--active/);
  });

  test('macros toggle defaults to on', async ({ page }) => {
    const macroPill = page.getByTestId('macro-toggle-btn');
    await expect(macroPill).toHaveClass(/macro-dashboard__toggle-pill--active/);
  });

  test('water toggle defaults to on', async ({ page }) => {
    const waterPill = page.getByTestId('water-toggle-btn');
    await expect(waterPill).toHaveClass(/macro-dashboard__toggle-pill--active/);
  });

  test('both can be toggled off and rings section hides', async ({ page }) => {
    await page.getByTestId('macro-toggle-btn').click();
    await page.getByTestId('water-toggle-btn').click();

    // Rings section should not exist, but toggle pills still visible
    await expect(page.getByTestId('mini-ring-carbs')).toHaveCount(0);
    await expect(page.getByTestId('water-tracker')).toHaveCount(0);
    await expect(page.getByTestId('macro-toggle-btn')).toBeVisible();
    await expect(page.getByTestId('water-toggle-btn')).toBeVisible();
  });
});
