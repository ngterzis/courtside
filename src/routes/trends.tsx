import { useMemo, useState } from 'react';
import { useCurrentSeason, useGames } from '@/lib/queries';
import { tsPct as computeTS, fmt1, pct } from '@/lib/stats';
import { TrendChart } from '@/components/TrendChart';
import { DualTrendChart } from '@/components/DualTrendChart';
import type { TrendPoint } from '@/types';

type Range = 'season' | 'last5';

const RANGE_LABELS: Record<Range, string> = {
  season: 'Season',
  last5: 'Last 5',
};

function avg(points: TrendPoint[]): number {
  if (points.length === 0) return 0;
  return points.reduce((s, p) => s + p.value, 0) / points.length;
}

export default function TrendsRoute() {
  const [range, setRange] = useState<Range>('season');
  const { data: games = [], isLoading } = useGames();
  const { data: season } = useCurrentSeason();

  const filtered = useMemo(() => {
    switch (range) {
      case 'last5': return games.slice(-5);
      default:      return games;
    }
  }, [games, range]);

  const ptsTrend  = filtered.map((g): TrendPoint => ({ date: g.date, value: g.stats.points,    opponent: g.opponent }));
  const tsTrend   = filtered.map((g): TrendPoint => ({ date: g.date, value: Math.round(computeTS(g.stats) * 100), opponent: g.opponent }));
  const astTrend  = filtered.map((g): TrendPoint => ({ date: g.date, value: g.stats.assists,   opponent: g.opponent }));
  const rebTrend  = filtered.map((g): TrendPoint => ({ date: g.date, value: g.stats.rebounds,  opponent: g.opponent }));
  const tovTrend  = filtered.map((g): TrendPoint => ({ date: g.date, value: g.stats.turnovers, opponent: g.opponent }));

  const charts: Array<{ key: string; label: string; data: TrendPoint[]; unit?: string }> = [
    { key: 'PTS',  label: 'Points',            data: ptsTrend  },
    { key: 'TS%',  label: 'True Shooting %',   data: tsTrend, unit: '%' },
    { key: 'AST',  label: 'Assists',            data: astTrend  },
    { key: 'REB',  label: 'Rebounds',           data: rebTrend  },
  ];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6 lg:px-8">
        <div className="h-8 w-48 animate-pulse rounded bg-paper-deep" />
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-44 animate-pulse rounded-xl bg-paper-deep" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-10 pt-4 lg:px-8 lg:pt-8">
      {/* Header */}
      <div className="mb-4 lg:mb-6">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Your trajectory</h1>
        <p className="mt-0.5 text-[12px] text-ink-70">
          {season?.label ?? 'Season'} · game-by-game · dashed = 3-game rolling avg
        </p>
      </div>

      {/* Range filter pills */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {(Object.keys(RANGE_LABELS) as Range[]).map((r) => (
          <button
            key={r}
            onClick={() => setRange(r)}
            className={[
              'shrink-0 rounded-full border px-3.5 py-1 text-[12px] font-semibold transition-colors',
              range === r
                ? 'border-primary bg-primary text-white'
                : 'border-ink/15 bg-white text-ink hover:bg-paper-deep',
            ].join(' ')}
          >
            {RANGE_LABELS[r]}
          </button>
        ))}
      </div>

      {/* Individual metric charts — 2-col on desktop */}
      <div className="mb-4 grid gap-4 lg:grid-cols-2 lg:gap-5">
        {charts.map(({ key, label, data, unit }) => (
          <div key={key} className="rounded-xl border border-ink/10 bg-card p-4 shadow-card lg:p-5">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-70">
                  {key}
                </div>
                <div className="text-sm font-semibold">{label}</div>
              </div>
              {data.length > 0 && (
                <div className="rounded-full border border-ink/15 bg-paper-deep px-2.5 py-0.5 font-mono text-[11px] text-ink-70">
                  avg {unit === '%' ? pct(avg(data) / 100) : fmt1(avg(data))}
                </div>
              )}
            </div>
            {data.length === 0 ? (
              <div className="flex h-32 items-center justify-center text-[12px] text-ink-50">
                No games for this filter
              </div>
            ) : (
              <TrendChart data={data} label={key} rollingAvg height={160} />
            )}
          </div>
        ))}
      </div>

      {/* AST vs TOV combined — full width */}
      <div className="rounded-xl border border-ink/10 bg-card p-4 shadow-card lg:p-5">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-70">
              Signature chart
            </div>
            <div className="text-sm font-semibold">Assists vs Turnovers</div>
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
        {astTrend.length === 0 ? (
          <div className="flex h-32 items-center justify-center text-[12px] text-ink-50">
            No games for this filter
          </div>
        ) : (
          <DualTrendChart
            primary={astTrend}
            secondary={tovTrend}
            primaryLabel="AST"
            secondaryLabel="TOV"
            height={200}
          />
        )}
        {astTrend.length > 0 && (
          <p className="mt-2 text-[11px] italic text-ink-70">
            AST up, TOV down — signature Playmaker trend.
          </p>
        )}
      </div>
    </div>
  );
}
