import type { Page, Route } from '@playwright/test';
import {
  MOCK_ARCHETYPE,
  MOCK_CURRENT_SEASON,
  MOCK_GAMES,
  MOCK_PLAYER,
  MOCK_SEASON_AVERAGES,
  MOCK_SEASONS,
  MOCK_TEAM_RANKS,
} from '../src/mocks/fixtures';

// Stubs the backend with the fixture data, so the E2E suite runs against the
// production build without a real API.
const routes: Record<string, unknown> = {
  'GET /api/me': MOCK_PLAYER,
  'GET /api/seasons': MOCK_SEASONS,
  'GET /api/seasons/current': MOCK_CURRENT_SEASON,
  'GET /api/me/archetype': MOCK_ARCHETYPE,
  'GET /api/me/archetype/history': [MOCK_ARCHETYPE],
  'GET /api/me/season-averages': MOCK_SEASON_AVERAGES,
  'GET /api/me/team-ranks': MOCK_TEAM_RANKS,
  'GET /api/me/games': { games: MOCK_GAMES, total: MOCK_GAMES.length },
  'GET /api/me/games/last': MOCK_GAMES[MOCK_GAMES.length - 1],
  'GET /api/me/notifications': [],
  'POST /api/auth/login': { token: 'e2e-token', player: MOCK_PLAYER },
};

export interface MockApi {
  /** Body of every POST /api/chat request, in order. */
  chatRequests: unknown[];
}

export async function mockApi(page: Page, chatReply: string[]): Promise<MockApi> {
  const api: MockApi = { chatRequests: [] };

  await page.route('**/api/**', async (route: Route) => {
    const request = route.request();
    const { pathname } = new URL(request.url());
    const key = `${request.method()} ${pathname}`;

    if (key === 'POST /api/chat') {
      api.chatRequests.push(request.postDataJSON());
      const body =
        chatReply.map((text) => `data: ${JSON.stringify({ text })}\n\n`).join('') + 'data: [DONE]\n\n';
      return route.fulfill({ status: 200, contentType: 'text/event-stream', body });
    }

    if (key in routes) return route.fulfill({ json: routes[key] });
    return route.fulfill({ status: 404, json: { message: `No mock for ${key}` } });
  });

  return api;
}
