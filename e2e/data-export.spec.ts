import { test, expect } from '@playwright/test';
import { addProteinEntry, openSettings, clearLocalStorage } from './helpers';

test.describe('Data Export', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('can export JSON', async ({ page }) => {
    // Add some entries
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');
    await addProteinEntry(page, 'Chicken', 42, 'lunch');
    await addProteinEntry(page, 'Yogurt', 15, 'snack');

    await openSettings(page);

    // Listen for download
    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('export-json-button').click();
    const download = await downloadPromise;

    // Verify filename
    expect(download.suggestedFilename()).toMatch(/proteinpal-export.*\.json$/);

    // Read and verify content
    const content = await (await download.createReadStream()).toArray();
    const json = JSON.parse(Buffer.concat(content).toString());

    expect(Array.isArray(json)).toBe(true);
    expect(json.length).toBeGreaterThan(0);
    expect(json[0].entries.length).toBe(3);
    expect(json[0].entries[0].name).toBe('Eggs');
    expect(json[0].entries[1].name).toBe('Chicken');
    expect(json[0].entries[2].name).toBe('Yogurt');
  });

  test('can export CSV', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 18, 'breakfast');
    await addProteinEntry(page, 'Chicken', 42, 'lunch');

    await openSettings(page);

    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('export-csv-button').click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/proteinpal-export.*\.csv$/);

    const content = await (await download.createReadStream()).toArray();
    const csv = Buffer.concat(content).toString();

    // Should have header + 2 data rows
    const lines = csv.trim().split('\n');
    expect(lines.length).toBe(3);
    expect(lines[0]).toContain('Date');
    expect(lines[0]).toContain('Entry Name');
    expect(lines[0]).toContain('Protein (g)');
    expect(csv).toContain('Eggs');
    expect(csv).toContain('Chicken');
  });
});
