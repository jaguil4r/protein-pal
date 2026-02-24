import { test, expect } from '@playwright/test';
import { addProteinEntry, clearLocalStorage, openSettings } from './helpers';

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getWeekDateKeys(): string[] {
  const now = new Date();
  const monday = new Date(now);
  const day = monday.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(monday.getDate() + diff);
  const keys: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  }
  return keys;
}

test.describe('Weekly Summary Card', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await clearLocalStorage(page);
  });

  test('weekly summary card is visible on load', async ({ page }) => {
    const summary = page.getByTestId('weekly-summary');
    await expect(summary).toBeVisible();
  });

  test('shows correct date range header', async ({ page }) => {
    const range = page.getByTestId('weekly-range');
    await expect(range).toBeVisible();
    // Should contain a date range like "Feb 17 – Feb 23"
    await expect(range).toContainText('–');
  });

  test('shows 7 bars in the chart', async ({ page }) => {
    const chart = page.getByTestId('weekly-chart');
    await expect(chart).toBeVisible();

    // Each day has a bar container
    const days = chart.locator('.weekly-summary__day');
    await expect(days).toHaveCount(7);
  });

  test('today bar is highlighted', async ({ page }) => {
    const todayBar = page.locator('.weekly-summary__day--today');
    await expect(todayBar).toBeVisible();
  });

  test('shows protein goals stat at 0 initially', async ({ page }) => {
    const stat = page.getByTestId('weekly-protein-days');
    await expect(stat).toBeVisible();
    // Initially 0 days hit out of however many days elapsed
    await expect(stat).toContainText('0/');
  });

  test('shows average protein stat', async ({ page }) => {
    const stat = page.getByTestId('weekly-avg-protein');
    await expect(stat).toBeVisible();
    await expect(stat).toContainText('g / day');
  });

  test('shows a focus tip', async ({ page }) => {
    const tip = page.getByTestId('weekly-tip');
    await expect(tip).toBeVisible();
  });

  test('protein goal count updates after adding entries', async ({ page }) => {
    // Default goal is 160g. Add enough to hit it.
    await addProteinEntry(page, 'Chicken', 100, 'lunch');
    await addProteinEntry(page, 'Protein Shake', 60, 'snack');

    // Now today's protein >= 160g, so 1 day should be hit
    const stat = page.getByTestId('weekly-protein-days');
    await expect(stat).toContainText('1/');
  });

  test('average protein updates after adding entries', async ({ page }) => {
    await addProteinEntry(page, 'Chicken', 50, 'lunch');

    const stat = page.getByTestId('weekly-avg-protein');
    // Average should be at least 50g now
    const text = await stat.textContent();
    const match = text?.match(/(\d+)g/);
    expect(match).toBeTruthy();
    expect(Number(match![1])).toBeGreaterThanOrEqual(50);
  });

  test('best day stat appears after adding entries', async ({ page }) => {
    await addProteinEntry(page, 'Big Meal', 120, 'lunch');

    const bestDay = page.getByTestId('weekly-best-day');
    // Should show today as best day with 120g
    await expect(bestDay).toContainText('120g');
  });

  test('workout days picker in settings defaults to M/W/F', async ({ page }) => {
    await openSettings(page);

    const picker = page.getByTestId('workout-days-picker');
    await expect(picker).toBeVisible();

    // Mon (1), Wed (3), Fri (5) should be active
    await expect(page.getByTestId('workout-day-1')).toHaveClass(/settings-workout-day--active/);
    await expect(page.getByTestId('workout-day-3')).toHaveClass(/settings-workout-day--active/);
    await expect(page.getByTestId('workout-day-5')).toHaveClass(/settings-workout-day--active/);

    // Sun (0), Tue (2), Thu (4), Sat (6) should NOT be active
    await expect(page.getByTestId('workout-day-0')).not.toHaveClass(/settings-workout-day--active/);
    await expect(page.getByTestId('workout-day-2')).not.toHaveClass(/settings-workout-day--active/);
    await expect(page.getByTestId('workout-day-4')).not.toHaveClass(/settings-workout-day--active/);
    await expect(page.getByTestId('workout-day-6')).not.toHaveClass(/settings-workout-day--active/);
  });

  test('toggling workout day in settings persists', async ({ page }) => {
    await openSettings(page);

    // Toggle Tuesday (2) on
    await page.getByTestId('workout-day-2').click();
    await expect(page.getByTestId('workout-day-2')).toHaveClass(/settings-workout-day--active/);

    // Toggle Monday (1) off
    await page.getByTestId('workout-day-1').click();
    await expect(page.getByTestId('workout-day-1')).not.toHaveClass(/settings-workout-day--active/);

    // Reload and verify persistence
    await page.reload();
    await page.waitForLoadState('networkidle');
    await openSettings(page);

    await expect(page.getByTestId('workout-day-2')).toHaveClass(/settings-workout-day--active/);
    await expect(page.getByTestId('workout-day-1')).not.toHaveClass(/settings-workout-day--active/);
  });

  test('cheat days shown in weekly summary', async ({ page }) => {
    const cheatDays = page.getByTestId('weekly-cheat-days');
    await expect(cheatDays).toContainText('0/1 used');

    // Activate cheat day
    await page.getByTestId('cheat-day-toggle').click();
    await expect(cheatDays).toContainText('1/1 used');
  });

  test('seeded past data shows correct weekly stats', async ({ page }) => {
    const weekKeys = getWeekDateKeys();
    const todayKey = getTodayKey();

    // Seed data for days up to and including today
    await page.evaluate(({ weekKeys, todayKey }) => {
      const todayIdx = weekKeys.indexOf(todayKey);
      // Seed Mon through today with various protein amounts
      for (let i = 0; i <= todayIdx && i < 7; i++) {
        const key = weekKeys[i];
        const protein = (i + 1) * 40; // 40, 80, 120, 160, 200, ...
        const data = {
          date: key,
          entries: [{
            id: `seed-${i}`,
            name: `Day ${i + 1} meal`,
            protein,
            category: 'lunch',
            timestamp: new Date(key + 'T12:00:00').getTime(),
          }],
          goal: 160,
        };
        localStorage.setItem(`proteinpal_data_${key}`, JSON.stringify(data));
      }
    }, { weekKeys, todayKey });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Weekly summary should reflect seeded data
    const summary = page.getByTestId('weekly-summary');
    await expect(summary).toBeVisible();

    // Average protein should be > 0 (at minimum 40g for a single day)
    const avgText = await page.getByTestId('weekly-avg-protein').textContent();
    const avgMatch = avgText?.match(/(\d+)g/);
    expect(avgMatch).toBeTruthy();
    expect(Number(avgMatch![1])).toBeGreaterThan(0);
  });

  test('workout days completed shows in weekly summary', async ({ page }) => {
    // Default workout days: Mon(1), Wed(3), Fri(5)
    // If today is one of those, we can verify workout tracking
    const stat = page.getByTestId('weekly-workout-days');
    await expect(stat).toBeVisible();
    await expect(stat).toContainText('completed');
  });
});
