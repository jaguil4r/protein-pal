import { test, expect } from '@playwright/test';
import { clearLocalStorage } from './helpers';

test.describe('Dark Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('starts in light mode', async ({ page }) => {
    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBe('light');
  });

  test('can toggle to dark mode', async ({ page }) => {
    await page.getByTestId('dark-mode-toggle').click();

    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBe('dark');
  });

  test('can toggle back to light mode', async ({ page }) => {
    await page.getByTestId('dark-mode-toggle').click();
    await page.getByTestId('dark-mode-toggle').click();

    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBe('light');
  });

  test('dark mode changes background color', async ({ page }) => {
    const lightBg = await page.evaluate(() =>
      getComputedStyle(document.body).backgroundColor
    );

    await page.getByTestId('dark-mode-toggle').click();

    // Wait for transition
    await page.waitForTimeout(400);

    const darkBg = await page.evaluate(() =>
      getComputedStyle(document.body).backgroundColor
    );

    expect(lightBg).not.toBe(darkBg);
  });

  test('dark mode persists on reload', async ({ page }) => {
    await page.getByTestId('dark-mode-toggle').click();

    await page.reload();
    await page.waitForLoadState('networkidle');

    const theme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    );
    expect(theme).toBe('dark');
  });

  test('header shows Brotein Pal in brotein mode', async ({ page }) => {
    await page.getByTestId('dark-mode-toggle').click();
    await expect(page.locator('.header__title')).toHaveText('Brotein Pal');
  });

  test('header shows Protein Pal in light mode', async ({ page }) => {
    await expect(page.locator('.header__title')).toHaveText('Protein Pal');
  });

  test('settings shows Brotein Mode label', async ({ page }) => {
    await page.getByTestId('settings-button').click();
    await expect(page.getByText('Brotein Mode')).toBeVisible();
  });
});
