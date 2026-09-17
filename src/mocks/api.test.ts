import { describe, expect, it } from 'vitest';
import { mockChatReply, resolveMockRequest, toChunks } from './api';
import { MOCK_GAMES } from './fixtures';

describe('mock API', () => {
  // Every endpoint the app calls must be mocked, or `npm run dev:mock` shows a broken page
  it.each([
    ['POST', '/api/auth/login'],
    ['GET', '/api/me'],
    ['POST', '/api/me/onboard'],
    ['GET', '/api/seasons'],
    ['GET', '/api/seasons/current'],
    ['GET', '/api/me/archetype'],
    ['GET', '/api/me/archetype/history'],
    ['GET', '/api/me/season-averages'],
    ['GET', '/api/me/team-ranks'],
    ['GET', '/api/me/games'],
    ['GET', '/api/me/games/last'],
    ['GET', `/api/games/${MOCK_GAMES[0].id}`],
    ['GET', '/api/me/notifications'],
    ['POST', '/api/me/notifications/n1/read'],
  ])('%s %s responds with 200', (method, path) => {
    expect(resolveMockRequest(method, path).status).toBe(200);
  });

  it('returns 404 for unknown games and endpoints', () => {
    expect(resolveMockRequest('GET', '/api/games/nope').status).toBe(404);
    expect(resolveMockRequest('DELETE', '/api/me').status).toBe(404);
  });

  it('picks a chat reply by topic and splits it into chunks that rebuild it exactly', () => {
    const reply = mockChatReply('Why am I a Playmaker?');

    expect(reply).toMatch(/Playmaker/);
    expect(toChunks(reply).join('')).toBe(reply);
    expect(mockChatReply('anything else')).toMatch(/14\.6 PTS/);
  });
});
