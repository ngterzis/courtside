# Handoff: Courtside — Player-Facing Rec-League Basketball App

> For the developer (or a Claude Code session) picking this up: read this file end-to-end before you write any code.

---

## Overview

**Courtside** is a player-facing app for a recreational basketball league. Players check their own stats, understand their *role* on the team (via an AI-generated "archetype" like **Playmaker** / **Efficient Scorer**), track their progress over a season, and chat with an AI agent about their game. Coaches and admins are out of scope — this is just the player view.

**Core jobs-to-be-done:**
1. "How did I do last game?"
2. "What kind of player am I?"
3. "Am I getting better?"
4. "Ask a question about my own stats in natural language."

---

## About the design files

The files bundled here (`Courtside Wireframes.html` + its companion `.jsx` files) are **design references**, not production code. They were built as a low-fidelity, sketchy wireframe exploration in HTML/React to lock down layout, information architecture, and flow.

**Your task is to recreate these designs in a real React codebase** — the bundled HTML is only a visual spec. Do not ship the HTML. Do not copy the `<div>` trees verbatim. Use the wireframes to understand *what goes where and why*, then build it properly in React + TypeScript.

---

## Fidelity

**Low-fidelity (lofi).** The wireframes intentionally use a hand-sketched aesthetic (Caveat font for annotations, dashed borders for placeholders, crosshatched fills). **Do not ship that aesthetic.** The sketchy style is a *communication* tool for this stage — it signals "this is a structural proposal, not a visual spec."

For the real app, pick a clean modern aesthetic. The wireframes DO commit to:
- **Primary color: purple** (`#974ca8`)
- **Accent color: orange** (`#d7622c`) — used sparingly for personal bests, highlights, CTAs
- **Information architecture** — layout, hierarchy, what's on each screen, navigation structure

Everything else (exact typography, spacing scale, shadow treatments, component chrome) is the developer's call. Use a design system like shadcn/ui, Radix, or Mantine as a baseline.

---

## Recommended Stack

| Concern | Pick | Why |
|---|---|---|
| Build tool | **Vite** | Fast dev, first-class React + TS |
| Language | **TypeScript** | Domain is data-heavy (stats, games); types pay for themselves |
| Framework | **React 18** | Default |
| Routing | **React Router v6** | Simple, stable |
| Server state | **TanStack Query** (React Query) | Fetching stats repeatedly, cache invalidation on new games |
| UI primitives | **shadcn/ui** (Radix + Tailwind) | Accessible, themeable, good looking out of the box |
| Styling | **Tailwind CSS** | Pairs with shadcn/ui, fast iteration |
| Charts | **Recharts** | Good for trend lines / radar; lightweight |
| Icons | **Lucide** | Clean, matches shadcn/ui |
| Forms | **React Hook Form + Zod** | Login form, onboarding |
| AI chat | **Anthropic SDK** (server-side) or proxy through your backend | Never expose the API key client-side |

---

## Screen inventory & routes

The flow map in the wireframes (section 0) is the source of truth. Canonical routes:

```
/login                   → Login screen
/onboarding              → First-run only: jersey #, position
/                        → Player Dashboard (HUB)
/archetype               → Archetype detail page
/archetype/history       → Archetype-over-time view
/games                   → Game log (list)
/games/:gameId           → Game detail
/trends                  → Trends (PTS / TS% / AST-TOV / REB)
/chat                    → AI chat (also opens from FAB on any screen)
/notifications           → Notifications
/settings                → Account, season switcher (modal from here)
```

### Navigation structure

- **Bottom tab bar (mobile)**: Home · Games · Trends · Role (4 tabs). Dashboard is "Home."
- **Left sidebar (desktop)**: same 4 + Chat + Settings.
- **Persistent FAB (purple, bottom-right)**: opens AI chat. Present on every screen except `/chat` itself.
- **Bell icon (top-right of dashboard)**: notifications.
- **Season dropdown (top-right of dashboard)**: opens season switcher modal.

---

## Screens — detail

### 1. Login (`/login`)

- Email + password. Magic-link optional.
- Two variants in wireframes: (A) standard form card, (B) league-themed split layout. Pick A; B is aspirational.
- On success: if user has completed onboarding → `/`, else → `/onboarding`.

### 2. Onboarding (`/onboarding`)

- 3 steps, first run only: **Jersey #** → **Position** (Guard/Forward/Center) → **Confirm**.
- Persist to user profile. Never show again.
- Keep it fast — this is a league app, not a social network. No avatar upload, no bio.

### 3. Player Dashboard (`/`) — **THE HUB**

This is the screen that matters most. Three variants were explored in wireframes; **V2 (archetype-first hero) is the chosen direction** — user feedback preferred the role as the lead visual.

**Layout (mobile, V2):**
- Top bar: greeting ("hi, Jordan"), season label.
- **Archetype hero card** (purple bg, full width, ~180px tall): "You are a **Playmaker** / Efficient Scorer" + 1-sentence AI explanation + "Why? →" link to `/archetype`.
- **Stat strip**: 4 cards — PTS, AST, REB, TS% (season averages).
- **Trajectory chart**: AST-vs-TOV overlay line chart.
- **Last game card**: accent-bg (orange-soft), headline format "vs Ravens · 22 PTS", personal-best star if applicable.
- **FAB** (chat) + **bottom nav**.

**Layout (desktop, V2):** same content, 2-column role hero (text left, radar chart right), then 4-up stat strip, then 2-column trend + recent-games.

**Data:** requires `currentSeason`, `archetype`, `seasonAverages`, `lastGame`, `trend` for the charts.

### 4. Archetype detail (`/archetype`)

Combined version (section 4 of wireframes):
- Archetype card (same hero style, larger)
- **Radar chart** — 6 axes (AST, STL, TS%, PTS, REB, 3PT%)
- **"Receipt" explanation**: plaintext breakdown of *why* the AI assigned this archetype ("5.3 AST with 2.4 TOV... TS 56%..."). Think of this as showing the work.
- Secondary archetype chip
- "View history" link → `/archetype/history` (archetype over seasons)

### 5. Game log (`/games`)

- **Mobile**: card list. Each card shows opponent, date, PTS / AST / REB headline, personal-best star if applicable, coach-note snippet if present.
- **Desktop**: full table with 11 columns (DATE, OPP, H/A, PTS, REB, AST, STL, BLK, TOV, FG%, TS%).
- Filters: season, home/away, personal-bests-only.
- Tap a row → `/games/:gameId` for the full box score + coach note.

### 6. Trends (`/trends`)

- Separate chart per metric: PTS, TS%, AST, REB.
- Plus a combined **AST vs TOV** overlay (signature chart — it's how Playmakers are judged).
- Time range selector: last 5 / season / all-time.
- 3-game rolling average shown as dashed line on each chart.

### 7. AI chat (`/chat`)

- Chat interface. Suggested questions at launch: "How did I do last game?" / "What should I work on?" / "Why am I a Playmaker?"
- Context auto-injected server-side: player's recent games, season averages, archetype.
- Messages stream. Show "thinking" state.
- Triggered from FAB (any screen) or suggested-question chips on dashboard/archetype.

### 8. Notifications (`/notifications`)

Grouped by **Today / This week / Weekly summary**. 5 trigger types:
1. Personal best unlocked
2. Stats ready for last game
3. New coach note
4. Archetype changed
5. Weekly summary (Sunday digest)

### 9. Season switcher (modal, from any screen)

- Lists current + all historical seasons.
- Switching scopes the entire app to that season. Dashboard, Games, Trends all re-query.
- Archetype history is special-cased: it's cross-season by design.

---

## Reusable components

Build these once, use everywhere:

| Component | Props | Used on |
|---|---|---|
| `<ArchetypeHero variant='full' | 'compact'>` | archetype, secondary, explanation | Dashboard, Archetype |
| `<StatCard>` | label, value, delta?, trend? | Dashboard, Archetype |
| `<TrendChart>` | data, metric, rollingAvg? | Dashboard, Trends |
| `<DualTrendChart>` | primaryData, secondaryData, labels | Dashboard (AST/TOV), Trends |
| `<RadarChart>` | axes, values | Archetype |
| `<RankBar>` | label, percentile, valueLabel | Archetype (you-vs-team) |
| `<GameCard variant='list' | 'detail'>` | game | Game log, Dashboard "recent" |
| `<GameTable>` | games, columns | Game log desktop |
| `<JerseyAvatar>` | number, size | Everywhere |
| `<SeasonChip>` | season, onClick | Top bar |
| `<BottomNav>` | activeRoute | Mobile layout |
| `<Sidebar>` | activeRoute | Desktop layout |
| `<ChatFab>` | — | Layout shell |
| `<NotificationItem variant>` | notification | Notifications |
| `<CoachNote>` | text, author, date | Game detail, dashboard |
| `<PersonalBestBadge>` | stat | Inline on games |

---

## Data model

TypeScript interfaces, roughly:

```ts
type PlayerId = string;
type GameId = string;
type SeasonId = string;

interface Player {
  id: PlayerId;
  name: string;
  jerseyNumber: number;
  position: 'Guard' | 'Forward' | 'Center';
  teamId: string;
  onboardedAt: string | null;  // ISO, null = hasn't onboarded
}

interface Season {
  id: SeasonId;
  label: string;              // "Spring '26"
  startDate: string;
  endDate: string | null;     // null = active season
}

interface Game {
  id: GameId;
  seasonId: SeasonId;
  date: string;               // ISO
  opponent: string;
  homeAway: 'H' | 'A';
  result: 'W' | 'L';
  teamScore: number;
  opponentScore: number;
  // player's personal line:
  stats: GameStats;
  personalBests: Array<keyof GameStats>;  // stats that were PBs in this game
  coachNote?: CoachNote;
}

interface GameStats {
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  fgMade: number;
  fgAttempted: number;
  threeMade: number;
  threeAttempted: number;
  ftMade: number;
  ftAttempted: number;
  // derived (can be computed client-side):
  fgPct?: number;
  threePct?: number;
  ftPct?: number;
  tsPct?: number;
}

interface SeasonAverages extends GameStats {
  gamesPlayed: number;
  seasonId: SeasonId;
}

interface Archetype {
  primary: ArchetypeName;
  secondary: ArchetypeName;
  explanation: string;              // 1-2 sentence AI-generated prose
  receipt: Array<{                  // "show the work"
    stat: string;
    value: string;
    percentile: number;
    comment: string;
  }>;
  assignedAt: string;
  seasonId: SeasonId;
}

type ArchetypeName =
  | 'Playmaker' | 'Efficient Scorer' | 'Glass Cleaner'
  | 'Defensive Anchor' | '3&D Wing' | 'Rim Protector'
  | 'Spark Plug' | 'Floor General' | 'Hustle Player';

interface CoachNote {
  id: string;
  gameId: GameId;
  authorName: string;
  text: string;
  createdAt: string;
}

interface Notification {
  id: string;
  type: 'personal_best' | 'stats_ready' | 'coach_note' | 'archetype_changed' | 'weekly_summary';
  payload: Record<string, any>;
  createdAt: string;
  readAt: string | null;
}

interface TeamRank {  // percentile of player vs own team
  stat: keyof GameStats;
  percentile: number;  // 0-100
  label: string;       // "#1 on team" / "above avg" / "below avg"
}
```

---

## API contract

REST-ish, JSON. Auth via httpOnly session cookie.

```
POST   /api/auth/login                { email, password }
POST   /api/auth/logout
GET    /api/me                        → Player
POST   /api/me/onboard                { jerseyNumber, position }

GET    /api/seasons                   → Season[]
GET    /api/seasons/current           → Season

GET    /api/me/archetype?seasonId=…   → Archetype
GET    /api/me/archetype/history      → Archetype[]   (cross-season)

GET    /api/me/games?seasonId=…&limit=…&offset=…
                                      → { games: Game[], total: number }
GET    /api/games/:id                 → Game

GET    /api/me/season-averages?seasonId=…  → SeasonAverages
GET    /api/me/team-ranks?seasonId=…       → TeamRank[]
GET    /api/me/trends?metric=pts&range=season → { points: Array<{date, value}> }

GET    /api/me/notifications          → Notification[]
POST   /api/me/notifications/:id/read

POST   /api/chat                      { messages }  → SSE stream
```

**TanStack Query keys:**
```ts
['me']
['seasons']
['seasons', 'current']
['archetype', seasonId]
['games', { seasonId, filters }]
['game', gameId]
['season-averages', seasonId]
['team-ranks', seasonId]
['trends', { metric, range }]
['notifications']
```

Invalidate `games`, `season-averages`, `team-ranks`, `trends`, `archetype` when a new game is logged (push notification with type `stats_ready`).

---

## State management

- **Server state** → TanStack Query. Period. No duplicating in Redux/Zustand.
- **UI state** (active season, sidebar collapsed, chat panel open) → Zustand store, tiny.
- **Auth** → session cookie + `useQuery(['me'])`. If it 401s, redirect to `/login`.

```ts
// stores/ui-store.ts
interface UIState {
  activeSeasonId: string | null;   // null = current
  chatOpen: boolean;
  setActiveSeasonId: (id: string | null) => void;
  setChatOpen: (open: boolean) => void;
}
```

---

## Design tokens

```ts
// tokens.ts
export const colors = {
  primary: '#974ca8',       // Courtside purple — archetype hero, CTAs, active nav
  primarySoft: '#f0e3f3',   // Chip backgrounds, soft highlights
  accent: '#d7622c',        // Orange — personal bests, star icons, sparingly
  accentSoft: '#fbe3d3',    // Last-game card bg
  ink: '#1b1a17',           // Primary text, borders
  ink70: 'rgba(27,26,23,0.72)',  // Secondary text
  ink50: 'rgba(27,26,23,0.5)',   // Tertiary text
  ink15: 'rgba(27,26,23,0.15)',  // Subtle dividers
  paper: '#fbfaf6',         // Background (off-white, warm)
  paperDeep: '#f3f0e8',     // Card alt / sidebar bg
  success: '#2d8659',
  danger: '#c03a3a',
};

// Radius: 6 (inputs), 10 (cards), 999 (pills/chips/FAB)
// Spacing: 4/8/12/16/20/24/32 (multiples of 4)
// Shadow: '0 1px 2px rgba(0,0,0,.06), 0 2px 6px rgba(0,0,0,.04)' for resting cards
// Focus ring: 2px solid primary, offset 2px
```

**Typography (for the real build — wireframes use Inter + Caveat for sketchiness; drop Caveat):**
- Body & UI: **Inter** (or your preferred neutral sans). Weights 400 / 500 / 600 / 700.
- Numbers/stats: same font, tabular figures (`font-variant-numeric: tabular-nums`).
- Display (stat hero numbers, archetype name): same font, 600-700 weight, tight tracking.
- **Do not use** Caveat, Patrick Hand, or any hand-drawn font in production.

---

## Interactions & behavior

- **FAB** → slide-up chat drawer on mobile, right-side panel on desktop. Persistent across routes.
- **Archetype hero** → tap anywhere on the card to go to `/archetype`. "Why?" link is the affordance.
- **Game card** → tap to go to detail. Long-press (mobile) for quick actions: share line, add reaction to coach note.
- **Personal best** → orange star + subtle pulse on first view. Mark as seen client-side.
- **Trends charts** → tap a point to show tooltip with date + value. Scrub to see all games.
- **Season switcher** → bottom sheet (mobile) / dropdown (desktop). Switching triggers refetch everywhere.
- **Pull-to-refresh** on dashboard, game log, trends (mobile).
- **Empty states** mandatory for: no games yet (show "Your first game is coming up"), no archetype (need ≥3 games), no notifications.

---

## File structure (suggested)

```
src/
  main.tsx
  App.tsx                      // router + providers
  routes/
    login.tsx
    onboarding.tsx
    dashboard.tsx
    archetype/index.tsx
    archetype/history.tsx
    games/index.tsx
    games/[id].tsx
    trends.tsx
    chat.tsx
    notifications.tsx
  components/
    ArchetypeHero.tsx
    StatCard.tsx
    TrendChart.tsx
    DualTrendChart.tsx
    RadarChart.tsx
    RankBar.tsx
    GameCard.tsx
    GameTable.tsx
    JerseyAvatar.tsx
    CoachNote.tsx
    PersonalBestBadge.tsx
    ChatFab.tsx
    SeasonSwitcher.tsx
    BottomNav.tsx
    Sidebar.tsx
    NotificationItem.tsx
    layout/
      AppLayout.tsx             // shell with nav + FAB
      AuthLayout.tsx            // login/onboarding shell
  lib/
    api.ts                     // fetch wrappers
    queries.ts                 // query keys + hooks
    stats.ts                   // TS%, FG%, etc. calculations
    tokens.ts                  // colors, spacing
  stores/
    ui-store.ts
  types/
    index.ts                   // all TS interfaces
```

---

## Assets

- **No imagery** in the wireframes beyond placeholders. You'll want a single app icon / favicon.
- **Icons**: Lucide covers everything (`Bell`, `MessageSquare`, `Star`, `TrendingUp`, `Home`, `BarChart3`, `User`, `Settings`).
- **Fonts**: Inter from Google Fonts or a self-hosted copy.

---

## Files in this bundle

| File | What it is |
|---|---|
| `README.md` | This doc |
| `Courtside Wireframes.html` | Main wireframe canvas — open in a browser to see all screens |
| `wireframe-kit.jsx` | Shared primitives (colors, `<Spark>`, `<Radar>`, `<PhoneFrame>`, etc.) |
| `wf-flowmap.jsx` | **Section 0 — navigation flow map.** Start here. |
| `wf-login.jsx` | Section 1 — login + onboarding |
| `wf-dashboard.jsx` | Section 2 — dashboard (3 variants × mobile+desktop). V2 is chosen. |
| `wf-archetype.jsx` | Section 3 — archetype detail variants |
| `wf-archetype-combined.jsx` | Section 4 — chosen combined archetype page |
| `wf-chat.jsx` | Section 5 — AI chat |
| `wf-more.jsx` | Section 6 — game log, trends, season switcher, notifications |
| `design-canvas.jsx` | Canvas host component (scaffolding, not a real app component) |

**To view the wireframes:** open `Courtside Wireframes.html` in a browser. Use the canvas controls to zoom into sections. Section 0 (flow map) is the orientation — read it first.

---

## Open questions for the PM / designer

1. **Archetype taxonomy** — we sketched 9 archetypes; final list needs sign-off.
2. **Archetype assignment rules** — is it pure AI prompt, or rule-based with AI naming? Affects caching/latency.
3. **Coach note authoring** — out of scope for player app, but where do they come from? Admin tool? SMS ingest?
4. **Game stats entry** — same question. Scorekeeper app? Manual league admin entry? CSV import?
5. **Multi-team players** — can a player be on >1 team in a season? Design currently assumes no.
6. **Push notifications** — web push only, or native wrapper later (Capacitor/Expo)?

---

## Build order (suggested)

1. Scaffold Vite + React + TS + Tailwind + shadcn/ui.
2. Set up routing shell + `AppLayout` with bottom nav / sidebar / FAB.
3. Mock API layer (MSW) with realistic fixtures — one player, one season, 8 games.
4. Build the **Dashboard** (`V2` layout) end-to-end against mocks. This proves the whole system.
5. Archetype detail, game log, trends — repeat.
6. AI chat (last — needs real backend).
7. Wire real API, remove MSW.

Ship dashboard + game log as v0.1. Archetype + chat = v0.2.
