import { test, expect } from '@playwright/test';
import { addProteinEntry, clearLocalStorage } from './helpers';

test.describe('Progress Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('starts at 0%', async ({ page }) => {
    await expect(page.getByTestId('progress-text')).toContainText('0g');
    await expect(page.getByTestId('progress-text')).toContainText('0%');

    // Progress ring arc should have full offset (no fill)
    const arc = page.getByTestId('progress-arc');
    const offset = await arc.evaluate((el) => el.getAttribute('stroke-dashoffset'));
    // offset should equal the full circumference (2 * PI * 85 ≈ 534)
    expect(parseFloat(offset!)).toBeGreaterThan(500);
  });

  test('progress ring fills proportionally', async ({ page }) => {
    // Add 80g (50% of 160g goal)
    await addProteinEntry(page, 'Protein shake', 80, 'breakfast');

    await expect(page.getByTestId('progress-text')).toContainText('80g');
    await expect(page.getByTestId('progress-text')).toContainText('50%');

    // Wait for CSS transition on dashoffset (0.6s)
    await page.waitForFunction(() => {
      const arc = document.querySelector('[data-testid="progress-arc"]');
      if (!arc) return false;
      const offset = parseFloat(arc.getAttribute('stroke-dashoffset') || '999');
      // At 50%, offset should be roughly half of circumference (~267)
      return offset < 300 && offset > 200;
    }, { timeout: 3000 });
  });

  test('shows correct color for low progress', async ({ page }) => {
    await addProteinEntry(page, 'Snack', 20, 'snack');

    // 20/160 = 12.5% -> low tier (red/coral)
    const arc = page.getByTestId('progress-arc');
    await expect(arc).toHaveClass(/progress-ring__arc--low/);
  });

  test('shows correct color for mid progress', async ({ page }) => {
    await addProteinEntry(page, 'Meal 1', 50, 'breakfast');

    // 50/160 = 31% -> mid tier
    const arc = page.getByTestId('progress-arc');
    await expect(arc).toHaveClass(/progress-ring__arc--mid/);
  });

  test('shows correct color for high progress', async ({ page }) => {
    await addProteinEntry(page, 'Meal 1', 60, 'breakfast');
    await addProteinEntry(page, 'Meal 2', 60, 'lunch');

    // 120/160 = 75% -> high tier
    const arc = page.getByTestId('progress-arc');
    await expect(arc).toHaveClass(/progress-ring__arc--high/);
  });

  test('shows gold for 100%+ progress', async ({ page }) => {
    await addProteinEntry(page, 'Meal 1', 80, 'breakfast');
    await addProteinEntry(page, 'Meal 2', 80, 'lunch');
    await addProteinEntry(page, 'Meal 3', 10, 'snack');

    // 170/160 = 106% -> complete tier
    const arc = page.getByTestId('progress-arc');
    await expect(arc).toHaveClass(/progress-ring__arc--complete/);
    await expect(page.getByTestId('progress-text')).toContainText('106%');
  });
});
