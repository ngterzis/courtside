import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import type { IncomingMessage, ServerResponse } from 'node:http';

// ── Mock response generator ───────────────────────────────────────────────────
// References real fixture data so the UI feels live during development.
// Swap this whole plugin out (or remove it) when a real backend is wired.

function generateMockResponse(lastUserMessage: string): string {
  const m = lastUserMessage.toLowerCase();

  if (m.includes('last game') || m.includes('ravens') || m.includes('personal best')) {
    return (
      'Your last game against the Ravens was your best of the season — 22 points on ' +
      '8-of-14 shooting with 7 assists and zero turnovers. That\'s as clean as it gets. ' +
      'Your AST-to-TOV ratio for that game was effectively infinite, and the 22 points is a ' +
      'season high. Coach Mel noticed too: "Best floor-general game all season. Keep attacking middle gaps."'
    );
  }

  if (m.includes('shoot') || m.includes('ts%') || m.includes('true shooting') || m.includes('efficient')) {
    return (
      'Shooting efficiency has been climbing all season. Your True Shooting % started at 40% ' +
      'in game one and hit 63% in your last two games — your season average sits at 56%, ' +
      'comfortably above the team average. The driver is shot quality: you\'re getting to the ' +
      'line more and not forcing threes on bad looks.'
    );
  }

  if (m.includes('playmaker') || m.includes('role') || m.includes('archetype') || m.includes('why am i')) {
    return (
      'You earned the Playmaker tag through three things: 5.0 assists per game (92nd percentile ' +
      'on the team), a 2.1 AST-to-TOV ratio (85th percentile), and efficient scoring — 56% True ' +
      'Shooting means you\'re not padding your points total with bad shots. Playmakers create value ' +
      'for others without burning possessions. That\'s exactly what your numbers show this season.'
    );
  }

  if (m.includes('work on') || m.includes('improve') || m.includes('weak') || m.includes('worst')) {
    return (
      'By the numbers, your clearest growth area is three-point shooting — 37.5% on 4.8 attempts ' +
      'per game, which is the 38th percentile on the team. It\'s not bad, but it\'s the one place ' +
      'you\'re most below average. Your driving game and playmaking are elite; if the three-ball ' +
      'improves even a little, it opens up huge floor-spacing opportunities for your team.'
    );
  }

  if (m.includes('assist') || m.includes('ast') || m.includes('pass')) {
    return (
      'You\'re leading the team in assists at 5.0 per game — 92nd percentile on the roster. ' +
      'More importantly, your assist-to-turnover ratio is 2.1 and trending upward: you had ' +
      '4 turnovers in game one and zero in your last game. That\'s the signature improvement ' +
      'of a developing Playmaker.'
    );
  }

  if (m.includes('rebound') || m.includes('reb')) {
    return (
      'Solid rebounding for a guard — 7.5 per game, which is the 64th percentile on the team. ' +
      'That\'s well above what you\'d expect from a guard. Your best single game was 10 rebounds ' +
      'against the Stars on March 21.'
    );
  }

  if (m.includes('turnover') || m.includes('tov') || m.includes('ball')) {
    return (
      'Ball security has been a real improvement this season. You had 4 turnovers in game one ' +
      'and zero in your last game vs the Ravens. Season average is 2.4 per game — manageable ' +
      'given your 5.0 assists. The trajectory is what matters here, and it\'s pointing the right way.'
    );
  }

  return (
    'You\'re having a strong Spring \'26 season — 14.6 points, 5.0 assists, and 7.5 rebounds ' +
    'per game across 8 games, with efficiency trending up (TS% 56%). The Playmaker designation ' +
    'fits well. What would you like to dig into?'
  );
}

// ── SSE streaming helper ──────────────────────────────────────────────────────

async function streamChatResponse(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  const body = JSON.parse(Buffer.concat(chunks).toString()) as {
    messages: Array<{ role: string; content: string }>;
  };

  const lastUser = [...(body.messages ?? [])]
    .reverse()
    .find((m) => m.role === 'user');
  const text = generateMockResponse(lastUser?.content ?? '');

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Brief thinking pause before first token
  await new Promise((r) => setTimeout(r, 600));

  const words = text.split(' ');
  for (const word of words) {
    await new Promise((r) => setTimeout(r, 38));
    res.write(`data: ${JSON.stringify({ text: word + ' ' })}\n\n`);
  }

  res.write('data: [DONE]\n\n');
  res.end();
}

// ─────────────────────────────────────────────────────────────────────────────

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'mock-chat-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url !== '/api/chat' || req.method !== 'POST') return next();
          streamChatResponse(req, res).catch((err) => {
            console.error('[mock-chat-api]', err);
            if (!res.headersSent) {
              res.statusCode = 500;
              res.end();
            }
          });
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
