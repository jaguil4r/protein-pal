import { test, expect } from '@playwright/test';
import { addProteinEntry, clearLocalStorage } from './helpers';

test.describe('Delete Entry', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('can delete an entry', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');
    await addProteinEntry(page, 'Chicken', 42, 'lunch');

    // Verify 2 entries
    await expect(page.getByTestId('protein-entry')).toHaveCount(2);

    // Delete first entry (click the × delete button specifically)
    const firstEntry = page.getByTestId('protein-entry').first();
    await firstEntry.locator('.protein-entry__delete').click();

    // Wait for slide-out animation + removal
    await page.waitForTimeout(400);

    // Should have 1 entry now
    await expect(page.getByTestId('protein-entry')).toHaveCount(1);
  });

  test('total updates after deleting', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');
    await addProteinEntry(page, 'Chicken', 42, 'lunch');

    // Total should be 60g
    await expect(page.getByTestId('progress-text')).toContainText('60g');

    // Delete first entry (18g)
    const firstEntry = page.getByTestId('protein-entry').first();
    await firstEntry.locator('.protein-entry__delete').click();

    // Wait for animation
    await page.waitForTimeout(400);

    // Total should now be 42g
    await expect(page.getByTestId('progress-text')).toContainText('42g');
  });

  test('deleting all entries shows empty state', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');

    // Delete entry
    const entry = page.getByTestId('protein-entry').first();
    await entry.locator('.protein-entry__delete').click();

    // Wait for animation
    await page.waitForTimeout(400);

    // Should show empty message
    await expect(page.getByTestId('entry-list')).toContainText('No entries yet');
    await expect(page.getByTestId('progress-text')).toContainText('0g');
  });

  test('undo delete restores entry', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');
    await addProteinEntry(page, 'Chicken', 42, 'lunch');

    // Wait for add toasts to auto-dismiss
    await page.waitForTimeout(3500);

    // Delete first entry
    const firstEntry = page.getByTestId('protein-entry').first();
    await firstEntry.locator('.protein-entry__delete').click();

    // Wait for animation
    await page.waitForTimeout(400);

    // Warning toast should appear with Undo button
    const warningToast = page.locator('.toast--warning');
    await expect(warningToast).toBeVisible();
    await expect(page.getByTestId('toast-action')).toBeVisible();

    // Click Undo
    await page.getByTestId('toast-action').click();

    // Entry should be restored
    await expect(page.getByTestId('protein-entry')).toHaveCount(2);
    await expect(page.getByTestId('progress-text')).toContainText('60g');
  });
});
