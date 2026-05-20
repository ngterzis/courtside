import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { useGame } from '@/lib/queries';
import {
  fgPct as calcFgPct,
  threePct as calcThreePct,
  ftPct as calcFtPct,
  tsPct as calcTsPct,
  pct,
} from '@/lib/stats';
import type { GameStats } from '@/types';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatNoteDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface StatCellProps {
  label: string;
  value: string | number;
  sub?: string;
  isPb?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

function StatCell({ label, value, sub, isPb, size = 'md' }: StatCellProps) {
  const valueSize =
    size === 'lg' ? 'text-4xl' : size === 'sm' ? 'text-lg' : 'text-2xl';

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-md border px-3 py-3 text-center ${
        isPb ? 'border-accent/30 bg-accent/5' : 'border-ink/10 bg-card'
      }`}
    >
      <div className={`flex items-center gap-1 font-bold leading-none tabular ${valueSize} ${isPb ? 'text-accent' : ''}`}>
        {value}
        {isPb && <Star className="h-3.5 w-3.5 flex-shrink-0 fill-accent text-accent" />}
      </div>
      {sub && (
        <div className="mt-0.5 font-mono text-[10px] text-ink-50">{sub}</div>
      )}
      <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-70">
        {label}
      </div>
    </div>
  );
}

interface ShootingRowProps {
  label: string;
  made: number;
  attempted: number;
  pctValue: number;
  isPb?: boolean;
}

function ShootingRow({ label, made, attempted, pctValue, isPb }: ShootingRowProps) {
  return (
    <div className={`rounded-md border px-4 py-3 ${isPb ? 'border-accent/30 bg-accent/5' : 'border-ink/10 bg-card'}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-70">{label}</span>
        <div className="flex items-center gap-1.5">
          {isPb && <Star className="h-3 w-3 fill-accent text-accent" />}
          <span className={`font-bold tabular ${isPb ? 'text-accent' : ''}`}>
            {pct(pctValue)}
          </span>
        </div>
      </div>
      <div className="mt-1.5 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10">
          <div
            className={`h-full rounded-full transition-all ${isPb ? 'bg-accent' : 'bg-primary'}`}
            style={{ width: `${Math.min(pctValue * 100, 100)}%` }}
          />
        </div>
        <span className="w-10 text-right font-mono text-[11px] text-ink-70">
          {made}/{attempted}
        </span>
      </div>
    </div>
  );
}

export default function GameDetailRoute() {
  const { gameId } = useParams<{ gameId: string }>();
  const { data: game, isLoading, isFetched } = useGame(gameId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8 lg:py-8">
        <div className="mb-4 h-6 w-32 animate-pulse rounded bg-paper-deep" />
        <div className="h-40 animate-pulse rounded-md bg-paper-deep" />
      </div>
    );
  }

  if (isFetched && !game) {
    return <Navigate to="/games" replace />;
  }

  if (!game) return null;

  const { stats, personalBests } = game;
  const isPb = (stat: keyof GameStats) => personalBests.includes(stat);
  const hasPb = personalBests.length > 0;

  const gameFgPct = stats.fgPct ?? calcFgPct(stats);
  const gameThreePct = stats.threePct ?? calcThreePct(stats);
  const gameFtPct = stats.ftPct ?? calcFtPct(stats);
  const gameTsPct = stats.tsPct ?? calcTsPct(stats);

  return (
    <div className="mx-auto max-w-5xl px-4 py-4 lg:px-8 lg:py-8">
      {/* Back nav */}
      <Link
        to="/games"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-70 transition-colors hover:text-ink lg:mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Game log
      </Link>

      {/* Game header */}
      <div
        className={`mb-5 rounded-md border p-4 lg:p-5 ${
          hasPb ? 'border-accent/30 bg-accent/5' : 'border-ink/10 bg-card shadow-card'
        }`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-ink-70">
              {formatDate(game.date)}
            </div>
            <h1 className="mt-0.5 text-xl font-bold tracking-tight lg:text-2xl">
              {game.homeAway === 'H' ? 'vs' : '@'} {game.opponent}
              {hasPb && (
                <span className="ml-2 inline-flex items-center gap-1 text-sm font-semibold text-accent">
                  <Star className="h-4 w-4 fill-accent text-accent" />
                  Personal best
                </span>
              )}
            </h1>
            <div className="mt-1 font-mono text-sm text-ink-70">
              {game.homeAway === 'H' ? 'Home' : 'Away'}
            </div>
          </div>
          <div
            className={`flex flex-col items-end rounded-md border px-4 py-2.5 ${
              game.result === 'W'
                ? 'border-success/30 bg-success/5'
                : 'border-danger/30 bg-danger/5'
            }`}
          >
            <div
              className={`text-2xl font-extrabold leading-none tabular ${
                game.result === 'W' ? 'text-success' : 'text-danger'
              }`}
            >
              {game.result === 'W' ? 'W' : 'L'}
            </div>
            <div className="mt-0.5 font-mono text-sm text-ink-70 tabular">
              {game.teamScore}–{game.opponentScore}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        {/* Left column */}
        <div className="space-y-5">
          {/* Key stats */}
          <section>
            <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink-70">
              Your line
            </div>
            {/* PTS hero + REB/AST */}
            <div className="mb-2 grid grid-cols-3 gap-2">
              <StatCell
                label="PTS"
                value={stats.points}
                isPb={isPb('points')}
                size="lg"
              />
              <StatCell
                label="REB"
                value={stats.rebounds}
                isPb={isPb('rebounds')}
              />
              <StatCell
                label="AST"
                value={stats.assists}
                isPb={isPb('assists')}
              />
            </div>
            {/* Secondary stats */}
            <div className="grid grid-cols-4 gap-2">
              <StatCell label="STL" value={stats.steals} isPb={isPb('steals')} size="sm" />
              <StatCell label="BLK" value={stats.blocks} isPb={isPb('blocks')} size="sm" />
              <StatCell label="TOV" value={stats.turnovers} size="sm" />
              <StatCell label="PF" value={stats.fouls} size="sm" />
            </div>
          </section>

          {/* Shooting */}
          <section>
            <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink-70">
              Shooting
            </div>
            <div className="space-y-2">
              <ShootingRow
                label="Field goals"
                made={stats.fgMade}
                attempted={stats.fgAttempted}
                pctValue={gameFgPct}
                isPb={isPb('fgPct')}
              />
              <ShootingRow
                label="3-pointers"
                made={stats.threeMade}
                attempted={stats.threeAttempted}
                pctValue={gameThreePct}
                isPb={isPb('threePct')}
              />
              <ShootingRow
                label="Free throws"
                made={stats.ftMade}
                attempted={stats.ftAttempted}
                pctValue={gameFtPct}
                isPb={isPb('ftPct')}
              />
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Efficiency */}
          <section>
            <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink-70">
              Efficiency
            </div>
            <div
              className={`rounded-md border p-4 ${
                isPb('tsPct') ? 'border-accent/30 bg-accent/5' : 'border-ink/10 bg-card shadow-card'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">True Shooting %</div>
                  <div className="mt-0.5 text-[11px] text-ink-70">
                    Points scored per shooting opportunity
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 text-3xl font-bold tabular ${isPb('tsPct') ? 'text-accent' : ''}`}>
                  {pct(gameTsPct)}
                  {isPb('tsPct') && <Star className="h-5 w-5 fill-accent text-accent" />}
                </div>
              </div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/10">
                <div
                  className={`h-full rounded-full ${isPb('tsPct') ? 'bg-accent' : 'bg-primary'}`}
                  style={{ width: `${Math.min(gameTsPct * 100, 100)}%` }}
                />
              </div>
            </div>
          </section>

          {/* Coach note */}
          {game.coachNote && (
            <section>
              <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink-70">
                Coach note
              </div>
              <div className="rounded-md border border-primary/20 bg-primary/5 p-4 shadow-card">
                <blockquote className="text-base italic leading-relaxed text-ink/85">
                  "{game.coachNote.text}"
                </blockquote>
                <div className="mt-3 flex items-center justify-between text-[11px] text-ink-70">
                  <span className="font-semibold">{game.coachNote.authorName}</span>
                  <span className="font-mono">{formatNoteDate(game.coachNote.createdAt)}</span>
                </div>
              </div>
            </section>
          )}

          {/* Empty state when no coach note */}
          {!game.coachNote && (
            <section>
              <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-wider text-ink-70">
                Coach note
              </div>
              <div className="rounded-md border border-dashed border-ink/15 px-4 py-6 text-center text-sm text-ink-50">
                No coach note for this game yet.
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
