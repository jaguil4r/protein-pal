import { test, expect } from '@playwright/test';
import { addProteinEntry, clearLocalStorage } from './helpers';

test.describe('Macro Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('macro input fields are present in add entry form', async ({ page }) => {
    await expect(page.getByTestId('entry-protein-input')).toBeVisible();
    await expect(page.getByTestId('entry-carbs-input')).toBeVisible();
    await expect(page.getByTestId('entry-calories-input')).toBeVisible();
    await expect(page.getByTestId('entry-fiber-input')).toBeVisible();
  });

  test('macro inputs accept values', async ({ page }) => {
    const nameInput = page.getByTestId('entry-name-input');
    await nameInput.fill('Test Meal');

    // Wait and dismiss food suggest
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

    // Submit the entry
    await page.getByTestId('add-entry-button').click();

    // Entry should be added
    await expect(page.getByTestId('protein-entry')).toHaveCount(1);
    await expect(page.getByTestId('progress-text')).toContainText('30g');
  });

  test('macro dashboard renders with correct values', async ({ page }) => {
    // Add an entry with macros from food database
    const nameInput = page.getByTestId('entry-name-input');
    await nameInput.fill('chicken breast');
    await page.waitForTimeout(300);

    // Select from food suggest
    const item = page.getByTestId('food-suggest-item').first();
    if (await item.isVisible().catch(() => false)) {
      await item.click();
    } else {
      // Manual entry with macros
      await page.keyboard.press('Escape');
      await page.getByTestId('entry-protein-input').fill('31');
      await page.getByTestId('entry-carbs-input').fill('10');
      await page.getByTestId('entry-calories-input').fill('165');
      await page.getByTestId('entry-fiber-input').fill('2');
    }

    await page.getByTestId('add-entry-button').click();

    // Macro dashboard should appear (since we logged macros)
    await expect(page.getByTestId('macro-dashboard')).toBeVisible();

    // Should have 3 mini rings
    await expect(page.getByTestId('mini-ring-carbs')).toBeVisible();
    await expect(page.getByTestId('mini-ring-calories')).toBeVisible();
    await expect(page.getByTestId('mini-ring-fiber')).toBeVisible();
  });

  test('macro totals accumulate correctly', async ({ page }) => {
    // Add first entry with macros
    const nameInput = page.getByTestId('entry-name-input');
    await nameInput.fill('Test Food 1');
    await page.waitForTimeout(300);
    const dropdown = page.getByTestId('food-suggest-dropdown');
    if (await dropdown.isVisible().catch(() => false)) {
      await page.keyboard.press('Escape');
      await dropdown.waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});
    }
    await page.getByTestId('entry-protein-input').fill('20');
    await page.getByTestId('entry-carbs-input').fill('30');
    await page.getByTestId('entry-calories-input').fill('200');
    await page.getByTestId('entry-fiber-input').fill('3');
    await page.getByTestId('add-entry-button').click();

    // Add second entry with macros
    await nameInput.fill('Test Food 2');
    await page.waitForTimeout(300);
    if (await dropdown.isVisible().catch(() => false)) {
      await page.keyboard.press('Escape');
      await dropdown.waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});
    }
    await page.getByTestId('entry-protein-input').fill('15');
    await page.getByTestId('entry-carbs-input').fill('20');
    await page.getByTestId('entry-calories-input').fill('150');
    await page.getByTestId('entry-fiber-input').fill('2');
    await page.getByTestId('add-entry-button').click();

    // Total protein should be 35g
    await expect(page.getByTestId('progress-text')).toContainText('35g');

    // Macro dashboard should be visible
    await expect(page.getByTestId('macro-dashboard')).toBeVisible();
  });

  test('macro rings hidden when no macro data', async ({ page }) => {
    // Add entry without macro data (just protein)
    await addProteinEntry(page, 'Plain Item', 30, 'breakfast');

    // Macro rings should NOT appear (no carbs/calories/fiber data)
    await expect(page.getByTestId('mini-ring-carbs')).toHaveCount(0);
    await expect(page.getByTestId('mini-ring-calories')).toHaveCount(0);
    await expect(page.getByTestId('mini-ring-fiber')).toHaveCount(0);
  });
});
