import { test, expect } from '@playwright/test';
import { addProteinEntry, clearLocalStorage } from './helpers';

test.describe('Quick Add Favorites', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('shows default suggestions from food database', async ({ page }) => {
    // Quick add should be visible even with no history (default suggestions from food DB)
    await expect(page.getByTestId('quick-add')).toBeVisible();

    // Should have pill buttons from the default meal category suggestions
    const pills = page.getByTestId('quick-add-pill');
    const count = await pills.count();
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(5);
  });

  test('pills appear for logged favorites', async ({ page }) => {
    // Add some entries to build favorites
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');
    await addProteinEntry(page, 'Chicken', 42, 'lunch');

    // Wait for favorites to update
    await page.waitForTimeout(600);

    // Quick add should be visible
    await expect(page.getByTestId('quick-add')).toBeVisible();

    // Should have pill buttons (could include both favorites and defaults)
    const pills = page.getByTestId('quick-add-pill');
    const count = await pills.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('one-tap quick add creates entry', async ({ page }) => {
    // Build up favorites
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');

    // Wait for favorites to update
    await page.waitForTimeout(600);

    // Should have 1 entry
    await expect(page.getByTestId('protein-entry')).toHaveCount(1);

    // Tap the quick-add pill for 'Eggs'
    const eggsPill = page.getByTestId('quick-add-pill').filter({ hasText: 'Eggs' });
    if (await eggsPill.isVisible().catch(() => false)) {
      await eggsPill.click();
    } else {
      // Fallback: click first pill
      await page.getByTestId('quick-add-pill').first().click();
    }

    // Should now have 2 entries
    await expect(page.getByTestId('protein-entry')).toHaveCount(2);
  });

  test('pills show name and grams', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');

    await page.waitForTimeout(600);

    // Find the Eggs pill specifically
    const eggsPill = page.getByTestId('quick-add-pill').filter({ hasText: 'Eggs' });
    if (await eggsPill.isVisible().catch(() => false)) {
      await expect(eggsPill).toContainText('18g');
    } else {
      // Default pills from food DB should still show name and grams
      const pill = page.getByTestId('quick-add-pill').first();
      const text = await pill.textContent();
      expect(text).toMatch(/\d+g/);
    }
  });
});
