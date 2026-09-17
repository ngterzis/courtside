import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useArchetypeHistory, useSeasons } from '@/lib/queries';
import type { Archetype, Season } from '@/types';

function seasonLabel(archetype: Archetype, seasons: Season[]): string {
  const match = seasons.find((s) => s.id === archetype.seasonId);
  return match?.label ?? archetype.seasonId;
}

function PercentileBar({ value }: { value: number }) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-ink/10">
      <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
    </div>
  );
}

function ArchetypeCard({ archetype, label }: { archetype: Archetype; label: string }) {
  return (
    <div className="rounded-xl border border-ink/10 bg-card p-5 shadow-card">
      {/* Season label */}
      <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-ink-70">
        {label}
      </div>

      {/* Role badges */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-primary px-3 py-0.5 text-sm font-bold text-white">
          {archetype.primary}
        </span>
        <span className="rounded-full border border-ink/20 bg-paper-deep px-3 py-0.5 text-sm font-semibold text-ink-70">
          {archetype.secondary}
        </span>
      </div>

      {/* Explanation */}
      <p className="mb-4 text-sm leading-relaxed text-ink/80 italic">"{archetype.explanation}"</p>

      {/* Receipt */}
      {archetype.receipt.length > 0 && (
        <div className="space-y-2.5">
          {archetype.receipt.map((line) => (
            <div key={line.stat}>
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] font-semibold text-ink">{line.stat}</span>
                  <span className="font-mono text-[11px] text-ink-70">{line.value}</span>
                </div>
                <span className="text-[11px] text-ink-50">{line.comment}</span>
              </div>
              <PercentileBar value={line.percentile} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ArchetypeHistoryRoute() {
  const { data: history, isLoading: historyLoading } = useArchetypeHistory();
  const { data: seasons = [], isLoading: seasonsLoading } = useSeasons();

  const isLoading = historyLoading || seasonsLoading;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
        <div className="mb-6 h-6 w-40 animate-pulse rounded bg-paper-deep" />
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-48 animate-pulse rounded-xl bg-paper-deep" />
          ))}
        </div>
      </div>
    );
  }

  const entries = history ?? [];

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-4 lg:px-8 lg:pt-8">
      {/* Back nav */}
      <Link
        to="/archetype"
        className="mb-5 inline-flex items-center gap-1.5 text-sm text-ink-70 transition-colors hover:text-ink lg:mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        My role
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-70">
          Archetype
        </div>
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Your role evolution</h1>
        <p className="mt-0.5 text-sm text-ink-70">How your game has evolved across seasons.</p>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-ink/15 py-16 text-center text-sm text-ink-50">
          No archetype history yet.
        </div>
      ) : (
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-4 top-5 hidden h-[calc(100%-2.5rem)] w-px bg-ink/10 lg:block" />

          <div className="space-y-5">
            {entries.map((archetype, i) => (
              <div key={archetype.seasonId} className="lg:flex lg:gap-6">
                {/* Timeline dot */}
                <div className="hidden lg:flex lg:w-8 lg:flex-shrink-0 lg:flex-col lg:items-center">
                  <div
                    className={`mt-5 h-3 w-3 rounded-full border-2 ${
                      i === 0 ? 'border-primary bg-primary' : 'border-ink/30 bg-paper'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <ArchetypeCard archetype={archetype} label={seasonLabel(archetype, seasons)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
