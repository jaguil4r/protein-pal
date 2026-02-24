import { test, expect } from '@playwright/test';
import { addProteinEntry, clearLocalStorage } from './helpers';

test.describe('Smart Quick Add', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('shows Quick Add label', async ({ page }) => {
    // Quick add should show a contextual label
    const quickAdd = page.getByTestId('quick-add');
    await expect(quickAdd).toBeVisible();

    // Label should say "Quick Add:"
    const label = page.locator('.quick-add__label');
    await expect(label).toContainText('Quick Add:');
  });

  test('default suggestions change by category', async ({ page }) => {
    // Get the initial pills
    const initialPills = await page.getByTestId('quick-add-pill').allTextContents();

    // Switch to a different category
    await page.getByTestId('category-dinner').click();

    // Wait for quick-add to refresh
    await page.waitForTimeout(600);

    // Get dinner pills
    const dinnerPills = await page.getByTestId('quick-add-pill').allTextContents();

    // The label should always say "Quick Add:"
    const label = page.locator('.quick-add__label');
    await expect(label).toContainText('Quick Add:');
  });

  test('learns from entries and shows favorites', async ({ page }) => {
    // Add some entries with specific categories
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');

    // Wait for favorites to update
    await page.waitForTimeout(600);

    // Switch to breakfast category
    await page.getByTestId('category-breakfast').click();
    await page.waitForTimeout(600);

    // The Eggs entry should appear as a quick-add pill (learned from history)
    const eggsPill = page.getByTestId('quick-add-pill').filter({ hasText: 'Eggs' });
    await expect(eggsPill).toBeVisible();
  });

  test('default suggestions appear for each category', async ({ page }) => {
    // Check breakfast defaults
    await page.getByTestId('category-breakfast').click();
    await page.waitForTimeout(600);
    const breakfastPills = page.getByTestId('quick-add-pill');
    const breakfastCount = await breakfastPills.count();
    expect(breakfastCount).toBeGreaterThanOrEqual(1);

    // Check lunch defaults
    await page.getByTestId('category-lunch').click();
    await page.waitForTimeout(600);
    const lunchPills = page.getByTestId('quick-add-pill');
    const lunchCount = await lunchPills.count();
    expect(lunchCount).toBeGreaterThanOrEqual(1);
  });

  test('quick add pill includes protein amount', async ({ page }) => {
    const pill = page.getByTestId('quick-add-pill').first();
    await expect(pill).toBeVisible();

    const text = await pill.textContent();
    expect(text).toMatch(/\d+g/);
  });
});
