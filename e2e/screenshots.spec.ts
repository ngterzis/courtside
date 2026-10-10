import { expect, test, type Page } from '@playwright/test';
import { mockChatReply, toChunks } from '../src/mocks/api';
import { mockApi } from './mock-api';

// Not part of the test suite: `npm run screenshots` regenerates the README images.
const OUT = 'docs/screenshots';

async function signIn(page: Page, chatReply: Parameters<typeof mockApi>[1] = []) {
  await mockApi(page, chatReply);
  await page.addInitScript(() => localStorage.setItem('courtside_token', 'screenshot-token'));
}

// Recharts animates lines in; wait for it to settle before capturing
const settle = (page: Page) => page.waitForTimeout(1500);

test.describe('desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });

  test('dashboard', async ({ page }) => {
    await signIn(page);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'hi, Jordan' })).toBeVisible();
    await settle(page);
    await page.screenshot({ path: `${OUT}/dashboard.png` });
  });

  test('archetype', async ({ page }) => {
    await signIn(page);
    await page.goto('/archetype');
    await expect(page.getByText('Playmaker').first()).toBeVisible();
    await settle(page);
    await page.screenshot({ path: `${OUT}/archetype.png` });
  });

  test('chat', async ({ page }) => {
    await signIn(page, (question) => toChunks(mockChatReply(question)));
    await page.goto('/chat');

    await page.getByRole('button', { name: 'How has my shooting improved?' }).click();
    await expect(page.getByText('three best by FG%.')).toBeVisible();

    const input = page.getByPlaceholder('Ask about your stats…');
    await expect(input).toBeEnabled();
    await input.fill('Why am I a Playmaker?');
    await input.press('Enter');
    await expect(page.getByText('as a secondary role.')).toBeVisible();

    await page.screenshot({ path: `${OUT}/chat.png` });
  });
});

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });

  test('dashboard', async ({ page }) => {
    await signIn(page);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'hi, Jordan' })).toBeVisible();
    await settle(page);
    await page.screenshot({ path: `${OUT}/dashboard-mobile.png` });
  });
});
