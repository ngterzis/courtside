import { cn } from '@/lib/utils';

interface Props {
  label: string;
  value: string | number;
  delta?: string;
  accent?: boolean;
  className?: string;
}

export function StatCard({ label, value, delta, accent, className }: Props) {
  return (
    <div
      className={cn(
        'rounded-md border border-ink/10 bg-card px-3 py-3 shadow-card lg:px-4 lg:py-4',
        className,
      )}
    >
      <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-70">
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold leading-tight tabular lg:text-3xl">
        {value}
      </div>
      {delta && (
        <div
          className={cn(
            'mt-0.5 text-[11px] font-semibold tabular',
            accent ? 'text-accent' : 'text-ink-70',
          )}
        >
          {delta}
        </div>
      )}
    </div>
  );
}
