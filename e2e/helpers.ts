import { Page } from '@playwright/test';

export async function addProteinEntry(
  page: Page,
  name: string,
  protein: number,
  category?: string
) {
  const nameInput = page.getByTestId('entry-name-input');
  await nameInput.fill(name);

  // Food suggest has a 150ms debounce. Wait for it to potentially fire.
  await page.waitForTimeout(300);

  // Dismiss food suggest dropdown if it appeared
  const dropdown = page.getByTestId('food-suggest-dropdown');
  if (await dropdown.isVisible().catch(() => false)) {
    await page.keyboard.press('Escape');
    // Wait until dropdown is fully hidden
    await dropdown.waitFor({ state: 'hidden', timeout: 2000 }).catch(() => {});
  }

  await page.getByTestId('entry-protein-input').fill(String(protein));
  if (category) {
    await page.getByTestId(`category-${category}`).click();
  }
  await page.getByTestId('add-entry-button').click();
}

export async function openSettings(page: Page) {
  await page.getByTestId('settings-button').click();
}

export async function closeSettings(page: Page) {
  await page.getByTestId('settings-panel').locator('button').filter({ hasText: '×' }).click();
}

export async function clearLocalStorage(page: Page) {
  await page.evaluate(() => {
    localStorage.clear();
    localStorage.setItem('proteinpal_onboarding_complete', 'true');
  });
  await page.reload();
  await page.waitForLoadState('networkidle');
}
