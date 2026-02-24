import { test, expect } from '@playwright/test';
import { clearLocalStorage } from './helpers';

test.describe('Food Auto-Suggest', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('dropdown appears when typing 2+ characters', async ({ page }) => {
    const nameInput = page.getByTestId('entry-name-input');
    await nameInput.fill('ch');

    // Wait for debounce
    await page.waitForTimeout(300);

    const dropdown = page.getByTestId('food-suggest-dropdown');
    await expect(dropdown).toBeVisible();

    // Should show food suggest items
    const items = page.getByTestId('food-suggest-item');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('dropdown does not appear for single character', async ({ page }) => {
    const nameInput = page.getByTestId('entry-name-input');
    await nameInput.fill('c');
    await page.waitForTimeout(300);

    await expect(page.getByTestId('food-suggest-dropdown')).toHaveCount(0);
  });

  test('shows matches from food database', async ({ page }) => {
    const nameInput = page.getByTestId('entry-name-input');
    await nameInput.fill('chicken');
    await page.waitForTimeout(300);

    const dropdown = page.getByTestId('food-suggest-dropdown');
    await expect(dropdown).toBeVisible();

    // Should show chicken-related items
    const items = page.getByTestId('food-suggest-item');
    const count = await items.count();
    expect(count).toBeGreaterThanOrEqual(1);

    // First result should contain "Chicken"
    const firstItem = items.first();
    await expect(firstItem).toContainText('Chicken');
  });

  test('selecting a food auto-fills macros', async ({ page }) => {
    const nameInput = page.getByTestId('entry-name-input');
    await nameInput.fill('chicken');
    await page.waitForTimeout(300);

    // Click the first suggestion
    await page.getByTestId('food-suggest-item').first().click();

    // Name should be filled
    const nameValue = await nameInput.inputValue();
    expect(nameValue).toContain('Chicken');

    // Protein should be auto-filled
    const proteinValue = await page.getByTestId('entry-protein-input').inputValue();
    expect(parseInt(proteinValue)).toBeGreaterThan(0);

    // Dropdown should be dismissed
    await expect(page.getByTestId('food-suggest-dropdown')).toHaveCount(0);
  });

  test('Escape key dismisses dropdown', async ({ page }) => {
    const nameInput = page.getByTestId('entry-name-input');
    await nameInput.fill('eggs');
    await page.waitForTimeout(300);

    await expect(page.getByTestId('food-suggest-dropdown')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByTestId('food-suggest-dropdown')).toHaveCount(0);
  });

  test('custom entry still works without selecting from dropdown', async ({ page }) => {
    const nameInput = page.getByTestId('entry-name-input');
    await nameInput.fill('My Custom Food');
    await page.waitForTimeout(300);

    // Dismiss dropdown if visible
    const dropdown = page.getByTestId('food-suggest-dropdown');
    if (await dropdown.isVisible().catch(() => false)) {
      await page.keyboard.press('Escape');
      await page.waitForTimeout(100);
    }

    // Fill protein manually
    await page.getByTestId('entry-protein-input').fill('25');
    await page.getByTestId('add-entry-button').click();

    // Entry should be added
    await expect(page.getByTestId('protein-entry')).toHaveCount(1);
    await expect(page.getByTestId('progress-text')).toContainText('25g');
  });

  test('arrow keys navigate dropdown items', async ({ page }) => {
    const nameInput = page.getByTestId('entry-name-input');
    await nameInput.fill('chicken');
    await page.waitForTimeout(300);

    await expect(page.getByTestId('food-suggest-dropdown')).toBeVisible();

    // Press down arrow to highlight first item
    await page.keyboard.press('ArrowDown');

    // First item should be active
    const activeItem = page.locator('.food-suggest__item--active');
    await expect(activeItem).toHaveCount(1);
  });
});
