# Courtside

Player-facing app for a rec-league basketball league. Players check their stats, understand their AI-assigned *archetype* (Playmaker, Efficient Scorer, etc.), track progress across a season, and chat with an AI about their game.

Product spec and wireframes live in [`design_handoff/README.md`](./design/README.md) — read that for the *why*. This README covers the *what*: the code as it currently stands.

## Current status

v0.0.1 — scaffold stage. The routing shell and the **Dashboard (V2 layout)** are built against mock data. Everything else is a placeholder route.

## Stack

| Concern | Library |
|---|---|
| Build | Vite 5 |
| Framework | React 18 + TypeScript |
| Routing | React Router v6 |
| Server state | TanStack Query v5 (mock-backed for now) |
| UI state | Zustand |
| Styling | Tailwind CSS v3 |
| Primitives | shadcn/ui style (Radix Slot + CVA), copy-paste not a lib |
| Charts | Recharts |
| Icons | Lucide |

## Commands

```bash
npm install
npm run dev        # start Vite dev server
npm run build      # tsc -b && vite build
npm run typecheck  # tsc -b --noEmit
npm run preview    # preview production build
```

## File layout

```
src/
├── main.tsx                    # ReactDOM root; wraps App in BrowserRouter
├── App.tsx                     # QueryClient + <Routes>; all canonical routes wired
├── index.css                   # Tailwind base/components/utilities + focus ring
│
├── routes/                     # One file per screen (folder for nested routes)
│   ├── dashboard.tsx           # ✅ Built — V2 archetype-hero layout
│   ├── login.tsx               # minimal form; submit → /
│   ├── onboarding.tsx          # placeholder
│   ├── archetype/index.tsx     # placeholder
│   ├── archetype/history.tsx   # placeholder
│   ├── games/index.tsx         # placeholder
│   ├── games/detail.tsx        # placeholder; reads :gameId param
│   ├── trends.tsx              # placeholder
│   ├── chat.tsx                # placeholder
│   ├── notifications.tsx       # placeholder
│   ├── settings.tsx            # placeholder
│   └── _placeholder.tsx        # shared <Placeholder/> for unbuilt routes
│
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx       # Sidebar + <Outlet/> + BottomNav + ChatFab
│   │   └── AuthLayout.tsx      # Centered card shell for login/onboarding
│   ├── ui/                     # shadcn-style primitives (copy-paste, not a dep)
│   │   ├── button.tsx          # CVA variants: default/accent/outline/ghost/onDark/solidLight
│   │   └── card.tsx
│   ├── Sidebar.tsx             # desktop nav (lg+); hidden on mobile
│   ├── BottomNav.tsx           # mobile nav (4 tabs); hidden lg+
│   ├── ChatFab.tsx             # persistent purple FAB; hidden on /chat
│   ├── ArchetypeHero.tsx       # purple hero card; links to /archetype
│   ├── StatCard.tsx            # label / value / delta — used in stat strip
│   ├── TrendChart.tsx          # single-metric line + 3-game rolling avg
│   ├── DualTrendChart.tsx      # two-metric overlay (signature AST vs TOV)
│   ├── LastGameCard.tsx        # accent-soft card w/ coach-note block
│   ├── JerseyAvatar.tsx        # purple-soft circle with jersey number
│   └── SeasonChip.tsx          # "Spring '26 ▾" — opens season switcher (TODO)
│
├── lib/
│   ├── utils.ts                # cn() — clsx + tailwind-merge
│   ├── stats.ts                # fgPct / threePct / ftPct / tsPct / pct / fmt1
│   └── queries.ts              # useMe / useArchetype / useGames / useTrend etc.
│                               #   Query keys match README spec exactly.
│                               #   Backed by mock fixtures + 120ms delay.
│
├── mocks/
│   └── fixtures.ts             # 1 player, 3 seasons, 8 games, archetype, trends
│
├── stores/
│   └── ui-store.ts             # Zustand: activeSeasonId, chatOpen
│
└── types/
    └── index.ts                # Player, Season, Game, GameStats, Archetype, etc.
```

## How the dashboard wires together

`routes/dashboard.tsx` is the reference for how every other screen should be built:

1. Pull data via the typed query hooks in `lib/queries.ts` (`useMe`, `useArchetype`, `useSeasonAverages`, `useLastGame`, `useTrend`).
2. Compose reusable components from `components/`. No inline styles, no ad-hoc layout.
3. Mobile-first: single column; use `lg:` breakpoints to switch to multi-column.

Loading states are handled at the route level for now (simple skeleton). Error boundaries are not yet wired.

## Design tokens

All tokens from the handoff `tokens.ts` are baked into `tailwind.config.js`:

- `bg-primary` `#974ca8` — archetype hero, active nav, primary CTAs
- `bg-primary-soft` `#f0e3f3` — chip backgrounds
- `bg-accent` `#d7622c` — personal bests, accent CTAs
- `bg-accent-soft` `#fbe3d3` — last-game card background
- `text-ink` `#1b1a17` + `text-ink-70/50/30/15` — text hierarchy
- `bg-paper` `#fbfaf6` — page background
- `bg-paper-deep` `#f3f0e8` — sidebar / card alt
- `shadow-card` / `shadow-raised` — resting and lifted cards
- `rounded-sm` (6px inputs), `rounded-md` (10px cards), `rounded-full` (pills/FAB)

**Do not** import the wireframe `WK.*` constants or reintroduce the `Caveat` hand-drawn font — those were for the sketchy handoff only.

## Routing

All canonical routes from the handoff are wired. `AppLayout` is the shell for authenticated app routes; `AuthLayout` is the split for `/login` and `/onboarding`. Unknown paths redirect to `/`.

| Route | Status |
|---|---|
| `/` | ✅ Dashboard V2 |
| `/login` | stub form (submit → `/`) |
| `/onboarding` | placeholder |
| `/archetype`, `/archetype/history` | placeholder |
| `/games`, `/games/:gameId` | placeholder |
| `/trends` | placeholder |
| `/chat` | placeholder (FAB opens it) |
| `/notifications` | placeholder (bell icon opens it) |
| `/settings` | placeholder |

## What's next

Per the handoff's build order:

1. Archetype detail (`/archetype`) — radar chart, receipt explanation.
2. Game log (`/games`) — card list mobile, 11-column table desktop.
3. Trends (`/trends`) — PTS / TS% / AST-TOV / REB charts.
4. AI chat (`/chat`) — needs real backend.
5. Swap mock `lib/queries.ts` for a real `lib/api.ts` once the API exists.
