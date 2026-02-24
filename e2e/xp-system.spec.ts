import { test, expect } from '@playwright/test';
import { addProteinEntry, clearLocalStorage } from './helpers';

test.describe('XP & Level System', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('XP badge shows at level 1 with 0 XP initially', async ({ page }) => {
    const badge = page.getByTestId('xp-badge');
    await expect(badge).toBeVisible();
    await expect(page.getByTestId('xp-level')).toContainText('Lv.1');
    await expect(page.getByTestId('xp-total')).toContainText('0 XP');
  });

  test('earns 10 XP per protein entry', async ({ page }) => {
    await addProteinEntry(page, 'Chicken', 30, 'lunch');
    await expect(page.getByTestId('xp-total')).toContainText('10 XP');

    await addProteinEntry(page, 'Eggs', 20, 'breakfast');
    await expect(page.getByTestId('xp-total')).toContainText('20 XP');
  });

  test('earns milestone XP at 50% goal', async ({ page }) => {
    // Default goal is 160g, so 80g = 50%
    await addProteinEntry(page, 'Big Meal', 80, 'lunch');
    // 10 (entry) + 25 (50% milestone) = 35
    await expect(page.getByTestId('xp-total')).toContainText('35 XP');
  });

  test('earns milestone XP at 100% goal', async ({ page }) => {
    await addProteinEntry(page, 'Meal 1', 80, 'lunch');
    // 10 + 25 (50%) = 35
    await addProteinEntry(page, 'Meal 2', 80, 'dinner');
    // 35 + 10 + 50 (100%) = 95
    // streak bonus: 0 streak × 5 = 0
    await expect(page.getByTestId('xp-total')).toContainText('95 XP');
  });

  test('levels up to level 2 at 100 XP', async ({ page }) => {
    // Pre-seed XP close to level 2
    await page.evaluate(() => {
      const xpData = {
        totalXp: 85,
        level: 1,
        lastEntryAwardDate: '',
        last50Date: '',
        last100Date: '',
        entryCountToday: 0,
      };
      localStorage.setItem('proteinpal_xp', JSON.stringify(xpData));
    });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Adding an entry adds 10 XP → 95
    await addProteinEntry(page, 'Chicken', 30, 'lunch');
    await expect(page.getByTestId('xp-level')).toContainText('Lv.1');

    // Another entry → 105 → level 2
    await addProteinEntry(page, 'Fish', 30, 'dinner');
    await expect(page.getByTestId('xp-level')).toContainText('Lv.2');
  });

  test('avatar shows accessories at level 2+', async ({ page }) => {
    // Pre-seed XP at level 2
    await page.evaluate(() => {
      const xpData = {
        totalXp: 150,
        level: 2,
        lastEntryAwardDate: '',
        last50Date: '',
        last100Date: '',
        entryCountToday: 0,
      };
      localStorage.setItem('proteinpal_xp', JSON.stringify(xpData));
    });
    await page.reload();
    await page.waitForLoadState('networkidle');

    const avatar = page.getByTestId('animal-avatar');
    await expect(avatar).toHaveAttribute('data-level', '2');

    // Accessory overlay SVG should be present
    const accessories = page.locator('.animal-accessories');
    await expect(accessories).toBeVisible();
  });

  test('no accessories shown at level 1', async ({ page }) => {
    const accessories = page.locator('.animal-accessories');
    await expect(accessories).toHaveCount(0);
  });

  test('XP persists across page reload', async ({ page }) => {
    await addProteinEntry(page, 'Chicken', 30, 'lunch');
    await expect(page.getByTestId('xp-total')).toContainText('10 XP');

    await page.reload();
    await page.waitForLoadState('networkidle');

    // XP should still be there
    await expect(page.getByTestId('xp-total')).toContainText('10 XP');
  });

  test('level 5 shows MAX indicator', async ({ page }) => {
    await page.evaluate(() => {
      const xpData = {
        totalXp: 1500,
        level: 5,
        lastEntryAwardDate: '',
        last50Date: '',
        last100Date: '',
        entryCountToday: 0,
      };
      localStorage.setItem('proteinpal_xp', JSON.stringify(xpData));
    });
    await page.reload();
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId('xp-level')).toContainText('Lv.5');
    await expect(page.locator('.xp-badge__max')).toContainText('MAX');
  });

  test('accessories accumulate at higher levels', async ({ page }) => {
    // Pre-seed at level 4 (should have bow tie + crown + bag)
    await page.evaluate(() => {
      const xpData = {
        totalXp: 800,
        level: 4,
        lastEntryAwardDate: '',
        last50Date: '',
        last100Date: '',
        entryCountToday: 0,
      };
      localStorage.setItem('proteinpal_xp', JSON.stringify(xpData));
    });
    await page.reload();
    await page.waitForLoadState('networkidle');

    const avatar = page.getByTestId('animal-avatar');
    await expect(avatar).toHaveAttribute('data-level', '4');

    // Should have bow tie, crown, and bag
    await expect(page.locator('.accessory--bowtie')).toBeVisible();
    await expect(page.locator('.accessory--crown')).toBeVisible();
    await expect(page.locator('.accessory--bag')).toBeVisible();
    // But NOT aura (level 5 only)
    await expect(page.locator('.accessory--aura')).toHaveCount(0);
  });
});
