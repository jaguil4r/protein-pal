import { test, expect } from '@playwright/test';
import { addProteinEntry, clearLocalStorage } from './helpers';

test.describe('Circular Progress', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('ring renders with track and arc', async ({ page }) => {
    await expect(page.getByTestId('progress-ring')).toBeVisible();
    await expect(page.getByTestId('progress-arc')).toBeVisible();

    // Should have SVG track circle
    const track = page.locator('.progress-ring__track');
    await expect(track).toBeVisible();
  });

  test('arc fills proportionally via stroke-dashoffset', async ({ page }) => {
    // At 0%, offset should be at full circumference
    const fullOffset = await page.getByTestId('progress-arc').evaluate((el) =>
      parseFloat(el.getAttribute('stroke-dashoffset') || '0')
    );
    expect(fullOffset).toBeGreaterThan(500);

    // Add 80g (50% of 160g)
    await addProteinEntry(page, 'Shake', 80, 'breakfast');

    // Wait for transition
    await page.waitForFunction(() => {
      const arc = document.querySelector('[data-testid="progress-arc"]');
      if (!arc) return false;
      const offset = parseFloat(arc.getAttribute('stroke-dashoffset') || '999');
      return offset < 300;
    }, { timeout: 3000 });

    const halfOffset = await page.getByTestId('progress-arc').evaluate((el) =>
      parseFloat(el.getAttribute('stroke-dashoffset') || '0')
    );

    // At 50%, offset should be roughly half the full offset
    expect(halfOffset).toBeLessThan(fullOffset * 0.7);
    expect(halfOffset).toBeGreaterThan(fullOffset * 0.3);
  });

  test('color tier classes apply correctly', async ({ page }) => {
    const arc = page.getByTestId('progress-arc');

    // Add 20g -> low
    await addProteinEntry(page, 'Snack', 20, 'snack');
    await expect(arc).toHaveClass(/progress-ring__arc--low/);
  });

  test('shows complete tier at 100%', async ({ page }) => {
    await addProteinEntry(page, 'Meal 1', 80, 'breakfast');
    await addProteinEntry(page, 'Meal 2', 80, 'lunch');
    await addProteinEntry(page, 'Meal 3', 10, 'snack');

    const arc = page.getByTestId('progress-arc');
    await expect(arc).toHaveClass(/progress-ring__arc--complete/);
  });

  test('shows percentage and grams in center', async ({ page }) => {
    await addProteinEntry(page, 'Eggs', 40, 'breakfast');

    // Check visible text
    const percent = page.locator('.progress-ring__percent');
    await expect(percent).toContainText('25%');

    const grams = page.locator('.progress-ring__grams');
    await expect(grams).toContainText('40g/160g');
  });

  test('milestone celebration at 50%', async ({ page }) => {
    // Add 80g to hit 50%
    await addProteinEntry(page, 'Big shake', 80, 'breakfast');

    // Should set data-celebration attribute
    const ring = page.getByTestId('progress-ring');
    await expect(ring).toHaveAttribute('data-celebration', '50');
  });

  test('milestone celebration at 100%', async ({ page }) => {
    // Pre-load 150g (93.75%) via localStorage — above 75% threshold but below 100%
    await page.evaluate(() => {
      const oneHourAgo = Date.now() - (1 * 60 * 60 * 1000);
      localStorage.setItem('proteinpal_last_meal_time', JSON.stringify(oneHourAgo));

      const today = new Date();
      const dateKey = today.getFullYear() + '-' +
        String(today.getMonth() + 1).padStart(2, '0') + '-' +
        String(today.getDate()).padStart(2, '0');

      const dayData = {
        date: dateKey,
        entries: [{
          id: 'test-1',
          name: 'Pre-loaded',
          protein: 150,
          category: 'breakfast',
          timestamp: oneHourAgo
        }],
        goal: 160
      };
      localStorage.setItem('proteinpal_data_' + dateKey, JSON.stringify(dayData));
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Now add 20g to cross 100% (only crosses 100% threshold, not 75%)
    await addProteinEntry(page, 'Final meal', 20, 'lunch');

    const ring = page.getByTestId('progress-ring');
    await expect(ring).toHaveAttribute('data-celebration', '100');
  });
});
