import { test, expect } from '@playwright/test';
import { addProteinEntry, clearLocalStorage } from './helpers';

test.describe('Remaining Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('shows "Xg/Yg" format at 0%', async ({ page }) => {
    const grams = page.locator('.progress-ring__grams');
    await expect(grams).toContainText('0g/160g');
  });

  test('updates remaining as entries are added', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 40, 'breakfast');

    const grams = page.locator('.progress-ring__grams');
    await expect(grams).toContainText('40g/160g');
  });

  test('changes to "Goal crushed!" at 100%', async ({ page }) => {
    await addProteinEntry(page, 'Meal 1', 80, 'breakfast');
    await addProteinEntry(page, 'Meal 2', 80, 'lunch');
    await addProteinEntry(page, 'Extra', 10, 'snack');

    const grams = page.locator('.progress-ring__grams');
    await expect(grams).toContainText('Goal crushed!');
  });

  test('shows correct remaining after multiple entries', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');
    await addProteinEntry(page, 'Chicken', 42, 'lunch');

    // 18 + 42 = 60g logged out of 160g goal
    const grams = page.locator('.progress-ring__grams');
    await expect(grams).toContainText('60g/160g');
  });

  test('percentage still shows correctly', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 40, 'breakfast');

    // 40/160 = 25%
    const percent = page.locator('.progress-ring__percent');
    await expect(percent).toContainText('25%');
  });

  test('sr-only text still has full details', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 40, 'breakfast');

    // Hidden text should have original format for accessibility
    const srText = page.getByTestId('progress-text');
    await expect(srText).toContainText('40g');
    await expect(srText).toContainText('160g');
  });
});
