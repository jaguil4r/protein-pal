import { test, expect } from '@playwright/test';
import { addProteinEntry, clearLocalStorage } from './helpers';

test.describe('Snack Suggestion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('shows snack suggestions when protein goal not met', async ({ page }) => {
    // Add a small entry so eating window is active and hoursRemaining > 0
    await addProteinEntry(page, 'Eggs', 12, 'breakfast');

    const suggestion = page.getByTestId('snack-suggestion');
    await expect(suggestion).toBeVisible();
    await expect(suggestion).toContainText('High-Protein Snack Ideas');
  });

  test('displays 3 snack items', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 12, 'breakfast');

    const items = page.getByTestId('snack-item');
    await expect(items).toHaveCount(3);
  });

  test('each snack item shows name, serving detail, and protein grams', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 12, 'breakfast');

    const firstItem = page.getByTestId('snack-item').first();
    // Should have a name
    await expect(firstItem.locator('.snack-suggestion__name')).toBeVisible();
    // Should have protein amount ending with 'g'
    await expect(firstItem.locator('.snack-suggestion__protein')).toContainText(/\d+g/);
    // Should have detail with serving info
    await expect(firstItem.locator('.snack-suggestion__detail')).toBeVisible();
  });

  test('shuffle button changes suggestions', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 12, 'breakfast');

    // Get initial suggestion names
    const getNames = async () => {
      const items = page.getByTestId('snack-item');
      const count = await items.count();
      const names: string[] = [];
      for (let i = 0; i < count; i++) {
        const name = await items.nth(i).locator('.snack-suggestion__name').textContent();
        if (name) names.push(name);
      }
      return names;
    };

    const initialNames = await getNames();
    expect(initialNames.length).toBe(3);

    // Click shuffle
    await page.getByTestId('snack-shuffle').click();

    const newNames = await getNames();
    expect(newNames.length).toBe(3);

    // At least one name should differ (with 60+ foods, extremely likely)
    const allSame = initialNames.every((n, i) => n === newNames[i]);
    expect(allSame).toBe(false);
  });

  test('hides when protein goal is met', async ({ page }) => {
    // Default goal is 160g — add enough to exceed it
    await addProteinEntry(page, 'Big Meal 1', 80, 'lunch');
    await addProteinEntry(page, 'Big Meal 2', 80, 'dinner');

    const suggestion = page.getByTestId('snack-suggestion');
    await expect(suggestion).not.toBeVisible();
  });

  test('shows context tip about remaining protein', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 12, 'breakfast');

    // Context tip should mention per-meal or remaining info
    const context = page.getByTestId('snack-context');
    await expect(context).toBeVisible();
    await expect(context).toContainText(/\d+g/);
  });
});
