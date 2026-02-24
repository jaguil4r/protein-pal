import { test, expect } from '@playwright/test';
import { clearLocalStorage } from './helpers';

test.describe('Serving Size Picker', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('serving sizes appear when selecting a food from database', async ({ page }) => {
    const nameInput = page.getByTestId('entry-name-input');
    await nameInput.fill('cottage');
    await page.waitForTimeout(300);

    // Select "Cottage Cheese" from dropdown
    const item = page.getByTestId('food-suggest-item').filter({ hasText: 'Cottage Cheese' });
    if (await item.isVisible().catch(() => false)) {
      await item.click();
    } else {
      await page.getByTestId('food-suggest-item').first().click();
    }

    // Serving picker should appear
    await expect(page.getByTestId('serving-picker')).toBeVisible();

    // Should have serving options
    const options = page.getByTestId('serving-option');
    const count = await options.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });

  test('changing serving recalculates macros', async ({ page }) => {
    const nameInput = page.getByTestId('entry-name-input');
    await nameInput.fill('cottage');
    await page.waitForTimeout(300);

    // Select "Cottage Cheese" from dropdown
    const item = page.getByTestId('food-suggest-item').filter({ hasText: 'Cottage Cheese' });
    if (await item.isVisible().catch(() => false)) {
      await item.click();
    } else {
      await page.getByTestId('food-suggest-item').first().click();
    }

    // Get initial protein value
    const initialProtein = await page.getByTestId('entry-protein-input').inputValue();

    // Click a different serving size
    const options = page.getByTestId('serving-option');
    const count = await options.count();
    if (count >= 2) {
      // Click the last option (usually the largest serving)
      await options.last().click();

      // Protein value should change
      const newProtein = await page.getByTestId('entry-protein-input').inputValue();
      expect(newProtein).not.toBe(initialProtein);
    }
  });

  test('serving picker not visible for custom entries', async ({ page }) => {
    const nameInput = page.getByTestId('entry-name-input');
    await nameInput.fill('My Custom Food XYZ');
    await page.waitForTimeout(300);

    // Dismiss dropdown if visible
    const dropdown = page.getByTestId('food-suggest-dropdown');
    if (await dropdown.isVisible().catch(() => false)) {
      await page.keyboard.press('Escape');
    }

    // Serving picker should NOT be visible
    await expect(page.getByTestId('serving-picker')).toHaveCount(0);
  });

  test('selected serving is highlighted', async ({ page }) => {
    const nameInput = page.getByTestId('entry-name-input');
    await nameInput.fill('eggs');
    await page.waitForTimeout(300);

    // Select a food item
    const item = page.getByTestId('food-suggest-item').first();
    if (await item.isVisible().catch(() => false)) {
      await item.click();

      // If serving picker appears, check for active state
      const picker = page.getByTestId('serving-picker');
      if (await picker.isVisible().catch(() => false)) {
        const activeOption = page.locator('.serving-picker__option--active');
        await expect(activeOption).toHaveCount(1);
      }
    }
  });
});
