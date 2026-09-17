import { expect, test } from '@playwright/test';
import { mockApi } from './mock-api';

test('player signs in, lands on the dashboard, and asks the agent a question', async ({ page }) => {
  const api = await mockApi(page, [
    'You averaged **5.0 assists** ',
    'this season, ',
    'up from 3 in your first game.',
  ]);

  // Unauthenticated visitors are sent to the login page
  await page.goto('/');
  await expect(page).toHaveURL(/\/login$/);

  await page.getByPlaceholder('Email').fill('jordan@example.com');
  await page.getByPlaceholder('Password').fill('hunter2');
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Dashboard renders from the API data
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole('heading', { name: 'hi, Jordan' })).toBeVisible();
  await expect(page.getByText('Assists vs Turnovers')).toBeVisible();

  // Open the chat and pick a suggested question
  await page.getByRole('button', { name: 'Open AI chat' }).click();
  await expect(page).toHaveURL(/\/chat$/);
  await page.getByRole('button', { name: 'How has my shooting improved?' }).click();

  // The streamed chunks are joined into one rendered markdown reply
  const reply = page.getByText('You averaged 5.0 assists this season, up from 3 in your first game.');
  await expect(reply).toBeVisible();
  await expect(reply.locator('strong')).toHaveText('5.0 assists');

  // Once the stream ends the player can ask a follow-up, and the history is sent along
  const input = page.getByPlaceholder('Ask about your stats…');
  await expect(input).toBeEnabled();
  await input.fill('And my turnovers?');
  await input.press('Enter');

  await expect.poll(() => api.chatRequests.length).toBe(2);
  expect(api.chatRequests[1]).toEqual({
    messages: [
      { role: 'user', content: 'How has my shooting improved?' },
      {
        role: 'assistant',
        content: 'You averaged **5.0 assists** this season, up from 3 in your first game.',
      },
      { role: 'user', content: 'And my turnovers?' },
    ],
  });
});
