import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { RadarChart } from '@/components/RadarChart';
import { useArchetype, useMe, useTeamRanks } from '@/lib/queries';

export default function ArchetypeRoute() {
  const { data: me } = useMe();
  const { data: archetype } = useArchetype();
  const { data: teamRanks } = useTeamRanks();

  const radarData = useMemo(() => {
    const rankMap = Object.fromEntries((teamRanks ?? []).map((r) => [r.stat, r.percentile]));
    const receiptMap = Object.fromEntries((archetype?.receipt ?? []).map((r) => [r.stat, r.percentile]));
    return [
      { axis: 'AST', value: rankMap['assists'] ?? receiptMap['AST/g'] ?? 50 },
      { axis: 'STL', value: rankMap['steals'] ?? 50 },
      { axis: 'TS%', value: receiptMap['TS%'] ?? 50 },
      { axis: 'PTS', value: receiptMap['PTS/g'] ?? 50 },
      { axis: 'REB', value: rankMap['rebounds'] ?? 50 },
      { axis: '3PT%', value: rankMap['threePct'] ?? 50 },
    ];
  }, [teamRanks, archetype]);

  if (!archetype || !me) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 lg:px-8">
        <div className="space-y-4">
          <div className="h-52 animate-pulse rounded-xl bg-paper-deep" />
          <div className="h-72 animate-pulse rounded-xl bg-paper-deep" />
          <div className="h-44 animate-pulse rounded-xl bg-paper-deep" />
        </div>
      </div>
    );
  }

  const jerseyLabel = `#${me.jerseyNumber} · ${me.position.charAt(0)}`;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 pt-4 lg:px-8">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 bg-white transition-colors hover:bg-paper-deep"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span className="text-sm font-semibold tracking-wide">Your Role</span>
        <div className="w-8" />
      </div>

      {/* ── A: Hero card ────────────────────────────────────── */}
      <div
        className="relative mb-4 overflow-hidden rounded-xl p-5 text-white shadow-raised lg:p-8"
        style={{
          background: 'linear-gradient(150deg, #974ca8 0%, #5a2260 100%)',
        }}
      >
        {/* Decorative rings */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-white/10 lg:h-64 lg:w-64"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-8 -right-4 h-28 w-28 rounded-full bg-white/[0.07] lg:h-40 lg:w-40"
        />

        <div className="relative">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-white/60">
              Primary
            </span>
            <span className="font-mono text-[10px] text-white/50">{jerseyLabel}</span>
          </div>

          <div className="text-4xl font-extrabold leading-none tracking-tight lg:text-5xl">
            {archetype.primary}
          </div>
          <div className="mt-1 text-sm text-white/75 lg:text-base">+ {archetype.secondary}</div>

          <hr className="my-4 border-t border-dashed border-white/25" />

          <p className="text-[15px] italic leading-snug text-white/90 lg:text-base">
            "{archetype.explanation}"
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
              AI-generated · updated today
            </span>
          </div>
        </div>
      </div>

      {/* ── B: Radar + archetype score bars ─────────────────── */}
      <div className="mb-4 rounded-xl border border-ink/10 bg-card p-4 shadow-card lg:p-6">
        <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-ink-70">
          Your profile · shape of your game
        </div>

        <div className="lg:flex lg:items-center lg:gap-8">
          <div className="lg:w-1/2">
            <RadarChart data={radarData} size={220} />
          </div>

          <div className="lg:hidden">
            <hr className="my-4 border-t border-dashed border-ink/15" />
          </div>

          <div className="space-y-2.5 lg:w-1/2">
            {(archetype.scores ?? []).map((s) => (
              <div key={s.name} className="flex items-center gap-3">
                <div
                  className="w-36 shrink-0 text-[11px] lg:w-40"
                  style={{ fontWeight: s.isPrimary || s.isSecondary ? 600 : 400 }}
                >
                  {s.name}
                </div>
                <div className="relative h-2 flex-1 overflow-hidden rounded-full border border-ink/15 bg-paper-deep">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all"
                    style={{
                      width: `${s.score}%`,
                      background: s.isPrimary ? '#d7622c' : s.isSecondary ? '#974ca8' : '#1b1a17',
                      opacity: s.isPrimary || s.isSecondary ? 1 : 0.35,
                    }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right font-mono text-[10px] text-ink-50">
                  {s.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── C: Receipt ──────────────────────────────────────── */}
      <div className="rounded-xl border border-ink/10 bg-card p-4 shadow-card lg:p-6">
        <div className="mb-3 text-[10px] font-semibold uppercase tracking-wider text-ink-70">
          How you earned it
        </div>

        <div
          className="rounded-lg bg-paper-deep p-4 font-mono text-[11px] leading-[1.85]"
          style={{ borderLeft: '3px solid #974ca8' }}
        >
          <div className="flex justify-between text-ink-50">
            <span>─── RECEIPT ───</span>
            <span>{jerseyLabel}</span>
          </div>
          <hr className="my-1.5 border-dashed border-ink/15" />
          {archetype.receipt.map((line) => (
            <div key={line.stat} className="flex justify-between">
              <span className="text-ink">
                {line.stat}&nbsp;
                <span className="font-bold">{line.value}</span>
                <span className="ml-1 text-ink-50">({line.percentile}th pctl.)</span>
              </span>
              <span className="ml-2 shrink-0 text-ink-70">{line.comment}</span>
            </div>
          ))}
          <hr className="my-1.5 border-dashed border-ink/15" />
          <div className="flex justify-between font-bold">
            <span>{archetype.primary.toUpperCase()}</span>
            <span style={{ color: '#d7622c' }}>
              {archetype.scores?.find((s) => s.isPrimary)?.score ?? ''} ★
            </span>
          </div>
          <div className="flex justify-between text-ink-70">
            <span>{archetype.secondary.toUpperCase()}</span>
            <span>{archetype.scores?.find((s) => s.isSecondary)?.score ?? ''}</span>
          </div>
        </div>

        <div className="mt-4 flex gap-3">
          <Link
            to="/chat"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: '#d7622c' }}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Ask AI why
          </Link>
        </div>
      </div>
    </div>
  );
}
