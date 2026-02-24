import { test, expect } from '@playwright/test';
import { addProteinEntry, clearLocalStorage } from './helpers';

test.describe('Coach Mode / Suggestion Toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('shows suggestion toggle with Snack Ideas active by default', async ({ page }) => {
    // Add a small entry so eating window is active and snack suggestions appear
    await addProteinEntry(page, 'Eggs', 12, 'breakfast');

    const toggle = page.getByTestId('suggestion-toggle');
    await expect(toggle).toBeVisible();

    // Snack tab should be active
    await expect(page.getByTestId('suggestion-tab-snack')).toHaveClass(/suggestion-toggle__pill--active/);

    // SnackSuggestion should be visible
    await expect(page.getByTestId('snack-suggestion')).toBeVisible();
  });

  test('switches to Coach Mode when Plan My Day tab is clicked', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 12, 'breakfast');

    await page.getByTestId('suggestion-tab-coach').click();

    // Coach tab should be active
    await expect(page.getByTestId('suggestion-tab-coach')).toHaveClass(/suggestion-toggle__pill--active/);

    // Coach Mode should be visible
    await expect(page.getByTestId('coach-mode')).toBeVisible();

    // SnackSuggestion should not be visible
    await expect(page.getByTestId('snack-suggestion')).not.toBeVisible();
  });

  test('switching back to Snack Ideas shows original SnackSuggestion', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 12, 'breakfast');

    // Switch to coach then back
    await page.getByTestId('suggestion-tab-coach').click();
    await expect(page.getByTestId('coach-mode')).toBeVisible();

    await page.getByTestId('suggestion-tab-snack').click();
    await expect(page.getByTestId('snack-suggestion')).toBeVisible();
    await expect(page.getByTestId('snack-list')).toBeVisible();
  });

  test('Coach Mode header shows remaining protein and meal count', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 12, 'breakfast');
    await page.getByTestId('suggestion-tab-coach').click();

    const header = page.getByTestId('coach-mode-header');
    await expect(header).toBeVisible();

    // Default goal is 160g, logged 12g, so 148g remaining
    await expect(header).toContainText('148g remaining');
    // Should mention number of meals
    await expect(header).toContainText(/\d+ meals? left/);
  });

  test('Coach Mode displays meal slot cards', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 12, 'breakfast');
    await page.getByTestId('suggestion-tab-coach').click();

    const slots = page.getByTestId('coach-meal-slot');
    const count = await slots.count();
    expect(count).toBeGreaterThan(0);

    // Each slot should have an Add All button
    const addButtons = page.getByTestId('coach-add-all');
    const btnCount = await addButtons.count();
    expect(btnCount).toBeGreaterThan(0);
  });

  test('each meal slot shows food names and protein amounts', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 12, 'breakfast');
    await page.getByTestId('suggestion-tab-coach').click();

    const firstSlot = page.getByTestId('coach-meal-slot').first();
    // Should contain at least one food name from coach foods pool
    const slotText = await firstSlot.textContent();
    expect(slotText).toBeTruthy();
    // Should contain protein amounts (e.g., "30g", "31g", etc.)
    expect(slotText).toMatch(/\d+g/);
  });

  test('Add All button logs the combined meal entry', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 12, 'breakfast');
    await page.getByTestId('suggestion-tab-coach').click();

    const firstAddAll = page.getByTestId('coach-add-all').first();
    await firstAddAll.click();

    // A toast should appear confirming the add (use .last() since the initial entry also created a toast)
    await expect(page.locator('.toast').last()).toContainText(/Added \d+g protein/);
  });

  test('Add All button shows checkmark after clicking', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 12, 'breakfast');
    await page.getByTestId('suggestion-tab-coach').click();

    const firstAddAll = page.getByTestId('coach-add-all').first();
    await firstAddAll.click();

    // The slot should now show "Added!" instead of the button
    const addedIndicator = page.getByTestId('coach-slot-added').first();
    await expect(addedIndicator).toBeVisible();
    await expect(addedIndicator).toContainText('Added!');
  });

  test('hides when protein goal is met', async ({ page }) => {
    // Default goal is 160g — add enough to exceed it
    await addProteinEntry(page, 'Big Meal 1', 80, 'lunch');
    await addProteinEntry(page, 'Big Meal 2', 80, 'dinner');

    const toggle = page.getByTestId('suggestion-toggle');
    await expect(toggle).not.toBeVisible();
  });

  test('meal slot target proteins sum approximately to remaining protein', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 12, 'breakfast');
    await page.getByTestId('suggestion-tab-coach').click();

    // Read the header to get remaining protein
    const headerText = await page.getByTestId('coach-mode-header').textContent();
    const remainingMatch = headerText?.match(/(\d+)g remaining/);
    expect(remainingMatch).toBeTruthy();
    const remaining = Number(remainingMatch![1]);

    // Read each slot's target
    const slots = page.getByTestId('coach-meal-slot');
    const count = await slots.count();
    let totalTarget = 0;
    for (let i = 0; i < count; i++) {
      const slotText = await slots.nth(i).textContent();
      const targetMatch = slotText?.match(/~(\d+)g target/);
      if (targetMatch) totalTarget += Number(targetMatch[1]);
    }

    // Targets should sum to approximately the remaining protein (within rounding tolerance)
    expect(totalTarget).toBeGreaterThanOrEqual(remaining - count);
    expect(totalTarget).toBeLessThanOrEqual(remaining + count);
  });
});
