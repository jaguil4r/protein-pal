import { test, expect } from '@playwright/test';
import { clearLocalStorage, openSettings, closeSettings } from './helpers';

test.describe('Water Tracker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('water tracker is visible by default', async ({ page }) => {
    await expect(page.getByTestId('water-tracker')).toBeVisible();
    await expect(page.getByTestId('water-add-btn')).toBeVisible();
  });

  test('water mini-ring shows 0oz initially', async ({ page }) => {
    const waterRing = page.getByTestId('mini-ring-water');
    await expect(waterRing).toBeVisible();
    await expect(waterRing).toContainText('0oz');
  });

  test('clicking +8oz increments water display', async ({ page }) => {
    await page.getByTestId('water-add-btn').click();
    const waterRing = page.getByTestId('mini-ring-water');
    await expect(waterRing).toContainText('8oz');

    await page.getByTestId('water-add-btn').click();
    await expect(waterRing).toContainText('16oz');
  });

  test('water persists after reload', async ({ page }) => {
    await page.getByTestId('water-add-btn').click();
    await page.getByTestId('water-add-btn').click();
    await page.reload();
    await page.waitForLoadState('networkidle');
    const waterRing = page.getByTestId('mini-ring-water');
    await expect(waterRing).toContainText('16oz');
  });

  test('adding water shows toast', async ({ page }) => {
    await page.getByTestId('water-add-btn').click();
    await expect(page.locator('.toast').last()).toContainText('+8oz water');
  });

  test('water tracker can be hidden via settings', async ({ page }) => {
    await expect(page.getByTestId('water-tracker')).toBeVisible();
    await openSettings(page);
    await page.getByTestId('settings-show-water-toggle').click();
    await closeSettings(page);
    await expect(page.getByTestId('water-tracker')).toHaveCount(0);
  });

  test('water tracker visibility persists after reload', async ({ page }) => {
    await openSettings(page);
    await page.getByTestId('settings-show-water-toggle').click();
    await closeSettings(page);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.getByTestId('water-tracker')).toHaveCount(0);
  });

  test('water goal defaults to 64oz', async ({ page }) => {
    await openSettings(page);
    await expect(page.getByTestId('water-goal-value')).toContainText('64oz');
  });

  test('water goal can be increased', async ({ page }) => {
    await openSettings(page);
    await page.getByTestId('water-goal-increase').click();
    await expect(page.getByTestId('water-goal-value')).toContainText('72oz');
  });

  test('water goal can be decreased', async ({ page }) => {
    await openSettings(page);
    await page.getByTestId('water-goal-decrease').click();
    await expect(page.getByTestId('water-goal-value')).toContainText('56oz');
  });

  test('water goal has minimum of 8oz', async ({ page }) => {
    await openSettings(page);
    // Click decrease many times to reach minimum
    for (let i = 0; i < 10; i++) {
      await page.getByTestId('water-goal-decrease').click();
    }
    await expect(page.getByTestId('water-goal-value')).toContainText('8oz');
  });

  test('water goal hidden when water tracker toggled off', async ({ page }) => {
    await openSettings(page);
    await expect(page.getByTestId('water-goal-value')).toBeVisible();
    await page.getByTestId('settings-show-water-toggle').click();
    await expect(page.getByTestId('water-goal-value')).toHaveCount(0);
  });
});
