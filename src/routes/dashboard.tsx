import { useMemo } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ArchetypeHero } from '@/components/ArchetypeHero';
import { StatCard } from '@/components/StatCard';
import { DualTrendChart } from '@/components/DualTrendChart';
import { LastGameCard } from '@/components/LastGameCard';
import { SeasonChip } from '@/components/SeasonChip';
import {
  useArchetype,
  useCurrentSeason,
  useGames,
  useLastGame,
  useMe,
  useSeasonAverages,
  useTeamRanks,
} from '@/lib/queries';
import { fmt1, pct } from '@/lib/stats';

export default function DashboardRoute() {
  const { data: me } = useMe();
  const { data: season } = useCurrentSeason();
  const { data: archetype } = useArchetype();
  const { data: averages } = useSeasonAverages();
  const { data: teamRanks = [] } = useTeamRanks();
  const { data: lastGame } = useLastGame();
  const { data: games = [] } = useGames();

  const astTrend = useMemo(
    () => games.map((g) => ({ date: g.date, value: g.stats.assists, opponent: g.opponent })),
    [games],
  );
  const tovTrend = useMemo(
    () => games.map((g) => ({ date: g.date, value: g.stats.turnovers, opponent: g.opponent })),
    [games],
  );

  const rankLabel = (stat: string) => teamRanks.find((r) => r.stat === stat)?.label;

  const loading = !me || !season || !archetype || !averages || !lastGame;

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8 lg:py-8">
        <div className="h-40 animate-pulse rounded-md bg-paper-deep" />
      </div>
    );
  }

  const firstName = me.name.split(' ')[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-4 lg:px-8 lg:py-8">
      {/* Top bar */}
      <div className="mb-4 flex items-center justify-between lg:mb-6">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-ink-70">{season.label}</div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">hi, {firstName}</h1>
        </div>
        <div className="flex items-center gap-2">
          <SeasonChip season={season} />
          <Link
            to="/notifications"
            aria-label="Notifications"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-ink/15 bg-white text-ink transition-colors hover:bg-paper-deep"
          >
            <Bell className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Archetype hero — V2 lead visual */}
      <ArchetypeHero archetype={archetype} className="mb-4 lg:mb-6" />

      {/* Stat strip */}
      <div className="mb-4 grid grid-cols-4 gap-2 lg:mb-6 lg:gap-3">
        <StatCard label="PTS" value={fmt1(averages.points)} delta={rankLabel('points')} accent />
        <StatCard label="AST" value={fmt1(averages.assists)} delta={rankLabel('assists')} accent />
        <StatCard label="REB" value={fmt1(averages.rebounds)} delta={rankLabel('rebounds')} />
        <StatCard label="TS%" value={pct(averages.tsPct ?? 0)} delta={rankLabel('tsPct')} accent />
      </div>

      {/* Trajectory + last game — single column on mobile, 2-col on desktop */}
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        <div className="rounded-md border border-ink/10 bg-card p-4 shadow-card lg:p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-70">
                Your trajectory
              </div>
              <div className="text-sm font-semibold lg:text-base">Assists vs Turnovers</div>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 font-semibold text-accent-foreground">
                AST
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-ink/15 bg-white px-2 py-0.5 text-ink-70">
                TOV
              </span>
            </div>
          </div>
          <div className="mt-3">
            <DualTrendChart
              primary={astTrend}
              secondary={tovTrend}
              primaryLabel="AST"
              secondaryLabel="TOV"
              height={180}
            />
          </div>
          <p className="mt-2 text-[11px] italic text-ink-70">
            AST up, TOV down — signature Playmaker trend.
          </p>
        </div>

        <LastGameCard game={lastGame} />
      </div>
    </div>
  );
}
