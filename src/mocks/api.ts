import {
  MOCK_ARCHETYPE,
  MOCK_CURRENT_SEASON,
  MOCK_GAMES,
  MOCK_NOTIFICATIONS,
  MOCK_PLAYER,
  MOCK_SEASON_AVERAGES,
  MOCK_SEASONS,
  MOCK_TEAM_RANKS,
} from './fixtures';

// The fake backend, as plain data. Shared by mock mode (`npm run dev:mock`, via MSW)
// and the Playwright suite (via page.route), so both stay in step with docs/BACKEND.md.

export interface MockResponse {
  status: number;
  body: unknown;
}

const ok = (body: unknown): MockResponse => ({ status: 200, body });
const notFound = (message: string): MockResponse => ({ status: 404, body: { message } });

const lastGame = MOCK_GAMES[MOCK_GAMES.length - 1];

export function resolveMockRequest(method: string, pathname: string): MockResponse {
  const key = `${method} ${pathname}`;

  switch (key) {
    case 'POST /api/auth/login':
      return ok({ token: 'mock-token', player: MOCK_PLAYER });
    case 'GET /api/me':
      return ok(MOCK_PLAYER);
    case 'POST /api/me/onboard':
      return ok(MOCK_PLAYER);
    case 'GET /api/seasons':
      return ok(MOCK_SEASONS);
    case 'GET /api/seasons/current':
      return ok(MOCK_CURRENT_SEASON);
    case 'GET /api/me/archetype':
      return ok(MOCK_ARCHETYPE);
    case 'GET /api/me/archetype/history':
      return ok([MOCK_ARCHETYPE]);
    case 'GET /api/me/season-averages':
      return ok(MOCK_SEASON_AVERAGES);
    case 'GET /api/me/team-ranks':
      return ok(MOCK_TEAM_RANKS);
    case 'GET /api/me/games':
      return ok({ games: MOCK_GAMES, total: MOCK_GAMES.length });
    case 'GET /api/me/games/last':
      return ok(lastGame);
    case 'GET /api/me/notifications':
      return ok(MOCK_NOTIFICATIONS);
  }

  const game = pathname.match(/^\/api\/games\/([^/]+)$/);
  if (method === 'GET' && game) {
    const found = MOCK_GAMES.find((g) => g.id === game[1]);
    return found ? ok(found) : notFound('Game not found');
  }

  if (method === 'POST' && /^\/api\/me\/notifications\/[^/]+\/read$/.test(pathname)) {
    return ok({});
  }

  return notFound(`No mock for ${key}`);
}

// ── Chat ──────────────────────────────────────────────────────────────────────

const CHAT_REPLIES: Array<{ match: RegExp; reply: string }> = [
  {
    match: /shoot|ts%|efficien/i,
    reply:
      'Your shooting has trended up all season. **TS% is 56%**, and over your last three ' +
      'games your FG% averaged 51%, compared with 30% in your first game vs the Jets.\n\n' +
      'Your three best scoring games (18, 19 and 22 points) were also your three best by FG%.',
  },
  {
    match: /weak/i,
    reply:
      'Your **3PT% (37.5%)** is your lowest-ranked stat, in the bottom half of the team.\n\n' +
      '- You take 4.8 threes a game, so small gains add up\n' +
      '- Turnovers are no longer a weakness: 4 in your first game, 1.3 a game over your last three',
  },
  {
    match: /playmaker|role|archetype/i,
    reply:
      "You're a **Playmaker** because you lead the team in assists (**5.0 per game**, 92nd " +
      'percentile) with a strong 2.1 assist-to-turnover ratio. Your efficient scoring earns ' +
      'you **Efficient Scorer** as a secondary role.',
  },
];

const DEFAULT_REPLY =
  'Across 8 games you average **14.6 PTS, 5.0 AST and 7.5 REB**. Your best game was the ' +
  'last one: a personal-best 22 points and 7 assists vs the Ravens.';

export function mockChatReply(question: string): string {
  return CHAT_REPLIES.find(({ match }) => match.test(question))?.reply ?? DEFAULT_REPLY;
}

/** Splits a reply into word-sized chunks, the way a model streams tokens. */
export function toChunks(reply: string): string[] {
  return reply.match(/\S+\s*/g) ?? [];
}

export const sseEvent = (text: string) => `data: ${JSON.stringify({ text })}\n\n`;
export const SSE_DONE = 'data: [DONE]\n\n';
