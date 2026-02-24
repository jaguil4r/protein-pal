import { test, expect } from '@playwright/test';
import { openSettings, clearLocalStorage } from './helpers';

test.describe('Animal Switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('defaults to sloth', async ({ page }) => {
    const avatar = page.getByTestId('animal-avatar');
    await expect(avatar).toHaveAttribute('data-animal', 'sloth');
  });

  test('can switch to panda', async ({ page }) => {
    await openSettings(page);
    await page.getByTestId('animal-option-panda').click();
    await page.getByTestId('settings-panel').locator('button[aria-label="Close settings"]').click();

    const avatar = page.getByTestId('animal-avatar');
    await expect(avatar).toHaveAttribute('data-animal', 'panda');
  });

  test('can switch to bunny', async ({ page }) => {
    await openSettings(page);
    await page.getByTestId('animal-option-bunny').click();
    await page.getByTestId('settings-panel').locator('button[aria-label="Close settings"]').click();

    const avatar = page.getByTestId('animal-avatar');
    await expect(avatar).toHaveAttribute('data-animal', 'bunny');
  });

  test('animal choice persists on reload', async ({ page }) => {
    await openSettings(page);
    await page.getByTestId('animal-option-panda').click();
    await page.getByTestId('settings-panel').locator('button[aria-label="Close settings"]').click();

    await page.reload();
    await page.waitForLoadState('networkidle');

    const avatar = page.getByTestId('animal-avatar');
    await expect(avatar).toHaveAttribute('data-animal', 'panda');
  });

  test('can switch between all three animals', async ({ page }) => {
    const avatar = page.getByTestId('animal-avatar');

    // Start as sloth
    await expect(avatar).toHaveAttribute('data-animal', 'sloth');

    // Switch to panda
    await openSettings(page);
    await page.getByTestId('animal-option-panda').click();
    await page.getByTestId('settings-panel').locator('button[aria-label="Close settings"]').click();
    await expect(avatar).toHaveAttribute('data-animal', 'panda');

    // Switch to bunny
    await openSettings(page);
    await page.getByTestId('animal-option-bunny').click();
    await page.getByTestId('settings-panel').locator('button[aria-label="Close settings"]').click();
    await expect(avatar).toHaveAttribute('data-animal', 'bunny');

    // Switch back to sloth
    await openSettings(page);
    await page.getByTestId('animal-option-sloth').click();
    await page.getByTestId('settings-panel').locator('button[aria-label="Close settings"]').click();
    await expect(avatar).toHaveAttribute('data-animal', 'sloth');
  });
});
