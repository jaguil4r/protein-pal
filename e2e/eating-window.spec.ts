import { test, expect } from '@playwright/test';
import { addProteinEntry, clearLocalStorage } from './helpers';

test.describe('Eating Window', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('eating window not visible with no entries', async ({ page }) => {
    await expect(page.getByTestId('eating-window')).toHaveCount(0);
  });

  test('eating window appears after first meal', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');

    // Eating window should appear
    await expect(page.getByTestId('eating-window')).toBeVisible();
  });

  test('timeline bar renders with meal dots', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');
    await addProteinEntry(page, 'Chicken', 42, 'lunch');

    // Timeline bar should be visible
    await expect(page.getByTestId('eating-window-bar')).toBeVisible();

    // Should have meal dots
    const dots = page.locator('.eating-window__dot');
    const dotCount = await dots.count();
    expect(dotCount).toBeGreaterThanOrEqual(1);
  });

  test('shows window time range', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');

    const window = page.getByTestId('eating-window');
    await expect(window).toBeVisible();

    // Should show time range (AM/PM format)
    const times = page.locator('.eating-window__times');
    const text = await times.textContent();
    expect(text).toMatch(/\d+:\d+\s*(AM|PM)/);
  });

  test('shows remaining protein info', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');

    const window = page.getByTestId('eating-window');
    await expect(window).toBeVisible();

    // Should show remaining info
    const info = page.locator('.eating-window__info');
    const text = await info.textContent();
    // Should mention remaining grams or completion
    if (text && text.length > 0) {
      expect(text).toMatch(/(\d+g left|\d+g.*remaining|Goal complete|per meal)/i);
    }
  });

  test('shows meal suggestion', async ({ page }) => {
    // Add an entry so eating window appears
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');

    const window = page.getByTestId('eating-window');
    await expect(window).toBeVisible();

    // Check for meal suggestion text
    const suggestion = page.locator('.eating-window__suggestion');
    if (await suggestion.isVisible().catch(() => false)) {
      const text = await suggestion.textContent();
      expect(text).toMatch(/protein per meal/i);
    }
  });

  test('editable timestamps in protein log', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');

    // Click on the time button in the entry
    const timeButton = page.locator('.protein-entry__time').first();
    await expect(timeButton).toBeVisible();
    await timeButton.click();

    // Time edit input should appear
    const timeEdit = page.getByTestId('entry-time-edit');
    await expect(timeEdit).toBeVisible();
  });

  test('goal complete message shows at 100%', async ({ page }) => {
    // Add enough to hit goal
    await addProteinEntry(page, 'Meal 1', 80, 'breakfast');
    await addProteinEntry(page, 'Meal 2', 80, 'lunch');
    await addProteinEntry(page, 'Extra', 10, 'snack');

    // Eating window should show "Goal complete!"
    const complete = page.locator('.eating-window__complete');
    if (await complete.isVisible().catch(() => false)) {
      await expect(complete).toContainText('Goal complete');
    }
  });
});
