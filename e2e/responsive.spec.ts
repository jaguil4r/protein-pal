import { test, expect } from '@playwright/test';
import { addProteinEntry, clearLocalStorage } from './helpers';

test.describe('Responsive Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('no horizontal scroll on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();

    const hasHScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHScroll).toBe(false);
  });

  test('content is centered on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.reload();

    const mainEl = page.locator('.app__main');
    const box = await mainEl.boundingBox();
    const viewportWidth = 1440;

    if (box) {
      // Main content should be roughly centered
      const leftMargin = box.x;
      const rightMargin = viewportWidth - (box.x + box.width);
      // Margins should be roughly equal (within 50px)
      expect(Math.abs(leftMargin - rightMargin)).toBeLessThan(50);
    }
  });

  test('all core elements visible on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 412, height: 915 });
    await page.reload();

    // Header visible
    await expect(page.locator('.header')).toBeVisible();

    // Avatar visible
    await expect(page.getByTestId('animal-avatar')).toBeVisible();

    // Progress ring visible
    await expect(page.getByTestId('progress-ring')).toBeVisible();

    // Add entry form visible
    await expect(page.getByTestId('entry-name-input')).toBeVisible();
    await expect(page.getByTestId('add-entry-button')).toBeVisible();

    // Entry list visible
    await expect(page.getByTestId('entry-list')).toBeVisible();
  });

  test('settings panel works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();

    await page.getByTestId('settings-button').click();
    await expect(page.getByTestId('settings-panel')).toBeVisible();

    // Animal options should be visible
    await expect(page.getByTestId('animal-option-sloth')).toBeVisible();
    await expect(page.getByTestId('animal-option-panda')).toBeVisible();
    await expect(page.getByTestId('animal-option-bunny')).toBeVisible();
  });

  test('add entry works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();

    await addProteinEntry(page, 'Eggs', 18, 'breakfast');

    await expect(page.getByTestId('protein-entry')).toHaveCount(1);
    await expect(page.getByTestId('progress-text')).toContainText('18g');
  });

  test('touch targets are at least 44px on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.reload();

    // Check add button size
    const addBtn = page.getByTestId('add-entry-button');
    const addBox = await addBtn.boundingBox();
    if (addBox) {
      expect(addBox.height).toBeGreaterThanOrEqual(44);
    }

    // Check dark mode toggle
    const toggleBtn = page.getByTestId('dark-mode-toggle');
    const toggleBox = await toggleBtn.boundingBox();
    if (toggleBox) {
      expect(toggleBox.height).toBeGreaterThanOrEqual(44);
      expect(toggleBox.width).toBeGreaterThanOrEqual(44);
    }
  });
});
