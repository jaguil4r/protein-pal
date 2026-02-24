import { test, expect } from '@playwright/test';
import { addProteinEntry, clearLocalStorage } from './helpers';

test.describe('Toast Notifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('toast appears on add entry', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');

    // Toast should appear
    await expect(page.getByTestId('toast')).toBeVisible();
    await expect(page.getByTestId('toast')).toContainText('Added 18g protein!');
  });

  test('toast auto-dismisses', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');

    await expect(page.getByTestId('toast')).toBeVisible();

    // Wait for auto-dismiss (3s + buffer)
    await page.waitForTimeout(4000);

    await expect(page.getByTestId('toast')).toHaveCount(0);
  });

  test('delete toast has undo action', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');

    // Wait for add toast to dismiss
    await page.waitForTimeout(3500);

    // Delete entry using the specific delete button
    const entry = page.getByTestId('protein-entry').first();
    await entry.locator('.protein-entry__delete').click();

    // Wait for delete animation
    await page.waitForTimeout(400);

    // Delete toast should appear with Undo
    const deleteToast = page.getByTestId('toast').filter({ hasText: 'Removed' });
    await expect(deleteToast).toBeVisible();
    await expect(page.getByTestId('toast-action')).toContainText('Undo');
  });

  test('undo restores deleted entry via toast', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');
    await addProteinEntry(page, 'Chicken', 42, 'lunch');

    // Wait for add toasts to clear
    await page.waitForTimeout(3500);

    // Delete first entry using the specific delete button
    const firstEntry = page.getByTestId('protein-entry').first();
    await firstEntry.locator('.protein-entry__delete').click();

    // Wait for delete animation
    await page.waitForTimeout(400);

    // Should have 1 entry
    await expect(page.getByTestId('protein-entry')).toHaveCount(1);

    // Click Undo
    await page.getByTestId('toast-action').click();

    // Entry restored - should have 2 again
    await expect(page.getByTestId('protein-entry')).toHaveCount(2);
  });

  test('can dismiss toast manually', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');

    await expect(page.getByTestId('toast')).toBeVisible();

    // Click dismiss button
    await page.locator('.toast__dismiss').click();

    await expect(page.getByTestId('toast')).toHaveCount(0);
  });
});
