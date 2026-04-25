import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useGames, useCurrentSeason } from '@/lib/queries';
import {
  fgPct as calcFgPct,
  threePct as calcThreePct,
  ftPct as calcFtPct,
  tsPct as calcTsPct,
  pct,
} from '@/lib/stats';
import type { Game } from '@/types';

type Filter = 'all' | 'home' | 'away' | 'best';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'home', label: 'Home' },
  { id: 'away', label: 'Away' },
  { id: 'best', label: '★ Best' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function applyFilter(games: Game[], filter: Filter): Game[] {
  if (filter === 'home') return games.filter((g) => g.homeAway === 'H');
  if (filter === 'away') return games.filter((g) => g.homeAway === 'A');
  if (filter === 'best') return games.filter((g) => g.personalBests.length > 0);
  return games;
}

export default function GamesRoute() {
  const [filter, setFilter] = useState<Filter>('all');
  const navigate = useNavigate();
  const { data: games, isLoading: gamesLoading } = useGames();
  const { data: season, isLoading: seasonLoading } = useCurrentSeason();

  if (gamesLoading || seasonLoading || !games || !season) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8 lg:py-8">
        <div className="h-40 animate-pulse rounded-md bg-paper-deep" />
      </div>
    );
  }

  const sorted = [...games].sort((a, b) => b.date.localeCompare(a.date));
  const filtered = applyFilter(sorted, filter);
  const pbCount = games.filter((g) => g.personalBests.length > 0).length;

  return (
    <div className="mx-auto max-w-5xl px-4 py-4 lg:px-8 lg:py-8">
      {/* Header */}
      <div className="mb-4 lg:mb-6">
        <div className="text-[11px] uppercase tracking-wider text-ink-70">Game log</div>
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Every game, every stat</h1>
        <p className="mt-0.5 text-sm text-ink-70">
          {season.label} · {games.length} games
          {pbCount > 0 && ` · ${pbCount} personal best${pbCount > 1 ? 's' : ''}`}
        </p>
      </div>

      {/* Filter pills */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:mb-5">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex-shrink-0 rounded-full border px-3 py-1 text-sm font-medium transition-colors ${
              filter === f.id
                ? 'border-primary bg-primary text-white'
                : 'border-ink/15 bg-white text-ink-70 hover:border-ink/30 hover:text-ink'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Mobile: card list ── */}
      <div className="space-y-3 lg:hidden">
        {filtered.map((game) => {
          const { stats, personalBests } = game;
          const hasPb = personalBests.length > 0;

          return (
            <Link
              key={game.id}
              to={`/games/${game.id}`}
              className={`block rounded-md border p-3 shadow-card transition-opacity hover:opacity-90 ${
                hasPb
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-ink/10 bg-card'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-sm font-bold">
                    {game.homeAway === 'H' ? 'vs' : '@'} {game.opponent}
                    {hasPb && <Star className="h-3.5 w-3.5 flex-shrink-0 fill-accent text-accent" />}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-70">
                    {formatDate(game.date)} · {game.homeAway} ·{' '}
                    <span className={game.result === 'W' ? 'text-success font-semibold' : 'text-danger font-semibold'}>
                      {game.result}
                    </span>
                    {' '}
                    {game.teamScore}–{game.opponentScore}
                  </div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className={`text-2xl font-extrabold leading-none ${hasPb ? 'text-primary' : 'text-ink'}`}>
                    {stats.points}
                  </div>
                  <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-ink-70">PTS</div>
                </div>
              </div>
              <div className="mt-2 font-mono text-[11px] text-ink-70">
                <span className="mr-3.5">{stats.rebounds} REB</span>
                <span className="mr-3.5">{stats.assists} AST</span>
                <span className="mr-3.5">{stats.steals} STL</span>
                <span className="mr-3.5">{stats.turnovers} TOV</span>
                <span>{pct(calcFgPct(stats))} FG</span>
              </div>
              {game.coachNote && (
                <blockquote className="mt-2.5 border-t border-dashed border-ink/20 pt-2.5 text-sm italic text-ink/80">
                  "{game.coachNote.text}"
                  <span className="ml-1.5 text-[11px] not-italic text-ink-70">
                    — {game.coachNote.authorName}
                  </span>
                </blockquote>
              )}
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-10 text-center text-sm text-ink-70">No games match this filter.</div>
        )}
        {filtered.length > 0 && (
          <div className="py-4 text-center text-[11px] text-ink-70">— end of season so far —</div>
        )}
      </div>

      {/* ── Desktop: full table ── */}
      <div className="hidden lg:block">
        <div className="overflow-hidden rounded-md border border-ink/10 bg-card shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink/15 bg-paper-deep">
                  {['DATE', 'OPP', 'H/A', 'PTS', 'REB', 'AST', 'STL', 'TOV', 'PF', 'FG%', '3PT%', 'FT%', 'TS%', 'NOTE'].map((h) => (
                    <th
                      key={h}
                      className="whitespace-nowrap px-3 py-2.5 text-left font-mono text-[10px] font-bold uppercase tracking-wider text-ink-70"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((game) => {
                  const { stats, personalBests } = game;
                  const hasPb = personalBests.length > 0;

                  return (
                    <tr
                      key={game.id}
                      onClick={() => navigate(`/games/${game.id}`)}
                      className={`cursor-pointer border-b border-dashed border-ink/10 last:border-0 transition-colors hover:bg-paper-deep/60 ${
                        hasPb ? 'bg-primary/5' : ''
                      }`}
                    >
                      <td className="whitespace-nowrap px-3 py-2.5 font-mono text-[11px] text-ink-70">
                        {formatDate(game.date)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-[11px] font-semibold">
                        {game.homeAway === 'H' ? 'vs' : '@'} {game.opponent}
                        {hasPb && <Star className="ml-1.5 inline h-3 w-3 fill-accent text-accent" />}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[11px]">{game.homeAway}</td>
                      <td className={`px-3 py-2.5 font-mono text-[11px] font-bold ${hasPb ? 'text-primary' : ''}`}>
                        {stats.points}
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[11px]">{stats.rebounds}</td>
                      <td className="px-3 py-2.5 font-mono text-[11px]">{stats.assists}</td>
                      <td className="px-3 py-2.5 font-mono text-[11px]">{stats.steals}</td>
                      <td className="px-3 py-2.5 font-mono text-[11px]">{stats.turnovers}</td>
                      <td className="px-3 py-2.5 font-mono text-[11px]">{stats.fouls}</td>
                      <td className="px-3 py-2.5 font-mono text-[11px]">{pct(calcFgPct(stats))}</td>
                      <td className="px-3 py-2.5 font-mono text-[11px]">{pct(calcThreePct(stats))}</td>
                      <td className="px-3 py-2.5 font-mono text-[11px]">{pct(calcFtPct(stats))}</td>
                      <td className={`px-3 py-2.5 font-mono text-[11px] ${hasPb ? 'font-bold text-primary' : ''}`}>
                        {pct(calcTsPct(stats))}
                      </td>
                      <td className="px-3 py-2.5 text-[11px] text-ink-70">
                        {game.coachNote ? (
                          <Link
                            to={`/games/${game.id}`}
                            className="inline-flex items-center gap-1 text-ink-70 underline-offset-2 hover:text-ink hover:underline"
                            title={game.coachNote.text}
                          >
                            ✉︎ note
                          </Link>
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-10 text-center text-sm text-ink-70">No games match this filter.</div>
          )}
        </div>
        <div className="mt-3 text-center text-[11px] text-ink-70">— end of season so far —</div>
      </div>
    </div>
  );
}
