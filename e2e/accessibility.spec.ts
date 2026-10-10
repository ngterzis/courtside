import AxeBuilder from '@axe-core/playwright';
import { expect, test, type Page } from '@playwright/test';
import { mockApi } from './mock-api';

const scan = (page: Page) =>
  new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();

test('login page has no WCAG A/AA violations', async ({ page }) => {
  await mockApi(page, []);
  await page.goto('/login');
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible();

  expect((await scan(page)).violations).toEqual([]);
});

for (const [path, ready] of [
  ['/', 'hi, Jordan'],
  ['/games', 'Every game, every stat'],
  ['/games/g8', 'vs Ravens'],
  ['/trends', 'Your trajectory'],
  ['/archetype', 'Playmaker'],
  ['/chat', 'Why am I a Playmaker?'],
  ['/notifications', 'Notifications'],
] as const) {
  test(`${path} has no WCAG A/AA violations`, async ({ page }) => {
    await mockApi(page, []);
    await page.addInitScript(() => localStorage.setItem('courtside_token', 'e2e-token'));
    await page.goto(path);
    await expect(page.getByText(ready).first()).toBeVisible();

    expect((await scan(page)).violations).toEqual([]);
  });
}
