# Courtside

[![CI](https://github.com/ngterzis/courtside/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/ngterzis/courtside/actions/workflows/ci.yml)

Player-facing web app for a rec-league basketball league. Players sign in, check their
stats, understand their AI-assigned **archetype** (Playmaker, Efficient Scorer, Glass
Cleaner, …), track progress across a season, browse their game log, and chat with an AI
about their own game.

## Demo

[![Watch the Courtside demo](https://img.youtube.com/vi/d4UmFKxlz5Y/maxresdefault.jpg)](https://youtu.be/d4UmFKxlz5Y)

## Stack

| Concern | Library |
|---|---|
| Build | Vite 5 |
| Framework | React 18 + TypeScript |
| Routing | React Router v6 |
| Server state | TanStack Query v5 |
| Styling | Tailwind CSS v3 |
| Primitives | shadcn/ui style (Radix Slot + CVA), copy-paste not a lib |
| Charts | Recharts |
| Icons | Lucide |
| Linting & formatting | ESLint (typescript-eslint, react-hooks) + Prettier |
| Unit & component tests | Vitest + React Testing Library |
| End-to-end tests | Playwright |

## Getting started

Requires Node 22 or later (`.nvmrc` is provided, so `nvm use` picks it up).

```bash
npm install
npm run dev        # start Vite dev server on http://localhost:5173
```

The dev server proxies `/api/*` to `http://localhost:8000` (see `vite.config.ts`), so run
your backend there. The full API contract the frontend expects lives in
[`BACKEND.md`](./docs/BACKEND.md) — it's the single source of truth for endpoints and JSON shapes.

### Commands

```bash
npm run dev        # start Vite dev server
npm run build      # tsc -b && vite build
npm run typecheck  # tsc -b --noEmit
npm run lint       # ESLint
npm run format     # Prettier (format:check to verify only)
npm run preview    # preview production build
npm test           # unit + component tests (Vitest)
npm run test:watch # Vitest in watch mode
npm run test:e2e   # end-to-end tests (Playwright; builds the app first)
```

## Testing

Tests focus on the logic most likely to break silently, not on layout:

| Layer | What's covered | Where |
|---|---|---|
| Unit | SSE stream parsing: events split across network reads, multi-byte characters split mid-byte, `[DONE]`, malformed events, reader cleanup | `src/lib/sse.test.ts` |
| Unit | Shooting percentages and True Shooting % formulas, including zero-attempt edge cases | `src/lib/stats.test.ts` |
| Unit | `apiFetch`: bearer token, 401 → sign out + redirect, error messages | `src/lib/api.test.ts` |
| Component | Chat: thinking indicator, incremental streaming into rendered markdown, conversation history sent to the API, error and empty-reply states | `src/routes/chat.test.tsx` |
| End-to-end | Sign in → dashboard → ask the chat agent a question → follow-up, on desktop and mobile viewports | `e2e/chat.spec.ts` |

The E2E suite runs against the production build with the API stubbed from
`src/mocks/fixtures.ts` (`e2e/mock-api.ts`), so it needs no backend. Charts and purely
visual components are deliberately left untested: they change often and are better
checked by eye.

First-time E2E setup: `npx playwright install chromium`.

**CI** (`.github/workflows/ci.yml`) runs lint, format check, typecheck, unit/component tests and E2E tests on
every pull request and push to `main`. Deploys only run once CI passes.

## How it works

- **Auth** — JWT stored in `localStorage` and sent as a Bearer token on every request
  (`src/lib/auth.ts`, `src/lib/api.ts`). A `401` clears the token and redirects to `/login`.
- **Route guards** (`src/App.tsx`) — `RequireAuth` gates the app, `RedirectIfAuthed` bounces
  logged-in users away from `/login`, and `RequireOnboarded` sends players with no
  `onboardedAt` to `/onboarding`.
- **Data** — every screen pulls from typed query hooks in `src/lib/queries.ts`
  (`useMe`, `useArchetype`, `useGames`, `useSeasonAverages`, `useTeamRanks`, `useLastGame`, …).
  The backend is authoritative for derived stats; `src/lib/stats.ts` is the client-side
  fallback when a field is absent.
- **Chat** — `/chat` streams responses over SSE from `POST /api/chat`
  (`src/routes/chat.tsx`, parser in `src/lib/sse.ts`).

## Routes

| Route | Screen |
|---|---|
| `/` | Dashboard — archetype hero, stat strip, last game, trend charts |
| `/login` | Email/password sign-in |
| `/onboarding` | Jersey number + position setup (first login) |
| `/archetype` | Archetype detail — radar chart, fit scores, receipt explanation |
| `/archetype/history` | Archetype across seasons |
| `/games` | Game log — card list on mobile, table on desktop |
| `/games/:gameId` | Single-game box score + coach note |
| `/trends` | PTS / TS% / AST–TOV / REB trend charts |
| `/chat` | AI chat about the player's stats (SSE streaming) |
| `/notifications` | Personal bests, stats-ready, coach notes, weekly summary |
| `/settings` | Account + sign out |

Unknown paths redirect to `/`.

## Project layout

```
src/
├── main.tsx                  # ReactDOM root; wraps App in BrowserRouter
├── App.tsx                   # QueryClient + route tree + auth/onboarding guards
├── index.css                 # Tailwind base/components/utilities
│
├── routes/                   # one file per screen (folder for nested routes)
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx      # Sidebar + <Outlet/> + BottomNav + ChatFab
│   │   └── AuthLayout.tsx     # centered card shell for login/onboarding
│   ├── ui/                    # shadcn-style primitives (button, card)
│   ├── Sidebar.tsx            # desktop nav (lg+)
│   ├── BottomNav.tsx          # mobile nav (4 tabs)
│   ├── ChatFab.tsx            # persistent FAB; hidden on /chat
│   ├── ArchetypeHero.tsx      # purple hero card → /archetype
│   ├── StatCard.tsx           # label / value / delta
│   ├── RadarChart.tsx         # team-rank radar for archetype detail
│   ├── TrendChart.tsx         # single-metric line + rolling average
│   ├── DualTrendChart.tsx     # two-metric overlay (AST vs TOV)
│   ├── LastGameCard.tsx       # last-game card with coach note
│   ├── JerseyAvatar.tsx       # circle with jersey number
│   └── SeasonChip.tsx         # season switcher
│
├── lib/
│   ├── api.ts                # apiFetch — Bearer auth, 401 handling, ApiError
│   ├── auth.ts               # token get/set/clear in localStorage
│   ├── queries.ts            # typed TanStack Query hooks (one per endpoint)
│   ├── sse.ts                # readSSE — parses the chat event stream
│   ├── stats.ts              # fgPct / threePct / ftPct / tsPct fallbacks
│   └── utils.ts              # cn() — clsx + tailwind-merge
│
├── mocks/fixtures.ts         # sample data for local dev and E2E API stubs
├── test/                     # Vitest setup + stream helpers
└── types/index.ts            # Player, Season, Game, GameStats, Archetype, …

e2e/                          # Playwright specs + API stubs
docs/
├── BACKEND.md                # API contract the frontend expects
└── design-handoff/           # product spec + wireframes
```

Unit and component tests sit next to the code they cover (`*.test.ts[x]`).

## Design tokens

Tokens from the design handoff are baked into `tailwind.config.js`:

- `bg-primary` `#974ca8` — archetype hero, active nav, primary CTAs
- `bg-primary-soft` `#f0e3f3` — chip backgrounds
- `bg-accent` `#d7622c` — personal bests, accent CTAs
- `bg-accent-soft` `#fbe3d3` — last-game card background
- `text-ink` `#1b1a17` + `text-ink-70/50/30/15` — text hierarchy
- `bg-paper` `#fbfaf6` — page background
- `bg-paper-deep` `#f3f0e8` — sidebar / card alt
- `shadow-card` / `shadow-raised` — resting and lifted cards

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`: run the CI workflow, then build, sync `dist/` to
S3 and invalidate CloudFront (AWS auth via OIDC). Requires the `AWS_FRONTEND_ROLE_ARN`,
`S3_BUCKET`, and `CLOUDFRONT_DISTRIBUTION_ID` repo secrets.

## Related repos

Courtside is split across three repositories:

- **[courtside](https://github.com/ngterzis/courtside)** — this repo; the React + TypeScript frontend.
- **[courtside-backend](https://github.com/ngterzis/courtside-backend)** — API implementing the [`BACKEND.md`](./docs/BACKEND.md) contract.
- **[courtside-infra](https://github.com/ngterzis/courtside-infra)** — infrastructure / deployment (AWS).

## Related docs

- [`docs/BACKEND.md`](./docs/BACKEND.md) — API contract, data models, auth, chat SSE format.
- [`docs/design-handoff/README.md`](./docs/design-handoff/README.md) — product spec and wireframes.

## License

Released under the [GNU AGPLv3 License](./LICENSE).
</content>
</invoke>
