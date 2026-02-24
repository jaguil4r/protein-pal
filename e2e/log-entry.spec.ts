import { test, expect } from '@playwright/test';
import { addProteinEntry, clearLocalStorage } from './helpers';

test.describe('Log Entry', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('can add a protein entry', async ({ page }) => {
    await addProteinEntry(page, 'Chicken breast', 42, 'lunch');

    // Verify entry appears in log
    const entry = page.getByTestId('protein-entry').first();
    await expect(entry).toContainText('Chicken breast');
    await expect(entry).toContainText('42g');
  });

  test('progress updates after adding entry', async ({ page }) => {
    await addProteinEntry(page, 'Protein shake', 30, 'breakfast');

    await expect(page.getByTestId('progress-text')).toContainText('30g');
    await expect(page.getByTestId('progress-text')).toContainText('19%');
  });

  test('can add multiple entries', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');
    await addProteinEntry(page, 'Chicken', 42, 'lunch');

    const entries = page.getByTestId('protein-entry');
    await expect(entries).toHaveCount(2);

    // Total should be 60g
    await expect(page.getByTestId('progress-text')).toContainText('60g');
  });

  test('clears form after submission', async ({ page }) => {
    await addProteinEntry(page, 'Yogurt', 15, 'breakfast');

    await expect(page.getByTestId('entry-name-input')).toHaveValue('');
    await expect(page.getByTestId('entry-protein-input')).toHaveValue('');
  });

  test('add button is disabled when fields are empty', async ({ page }) => {
    await expect(page.getByTestId('add-entry-button')).toBeDisabled();
  });
});
