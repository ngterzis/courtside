import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Archetype } from '@/types';
import { cn } from '@/lib/utils';

interface Props {
  archetype: Archetype;
  variant?: 'compact' | 'full';
  className?: string;
}

export function ArchetypeHero({ archetype, variant = 'compact', className }: Props) {
  const full = variant === 'full';

  return (
    <Link
      to="/archetype"
      className={cn(
        'group relative block overflow-hidden rounded-md bg-primary text-primary-foreground shadow-card transition-shadow hover:shadow-raised',
        full ? 'p-7 lg:p-9' : 'p-5 lg:p-7',
        className,
      )}
    >
      {/* Subtle decorative ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10"
      />
      <div className="relative">
        <div className="text-xs uppercase tracking-wider text-white/70">You are a</div>
        <div
          className={cn(
            'font-bold leading-none tracking-tight',
            full ? 'mt-2 text-5xl lg:text-6xl' : 'mt-1 text-3xl lg:text-4xl',
          )}
        >
          {archetype.primary}
        </div>
        <div className={cn('text-white/80', full ? 'mt-2 text-lg' : 'mt-1 text-sm')}>
          / {archetype.secondary}
        </div>

        <hr className="my-4 border-t border-dashed border-white/25" />

        <p className={cn('text-white/90', full ? 'text-base leading-relaxed' : 'text-sm leading-relaxed')}>
          {archetype.explanation}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-[10px] font-mono uppercase tracking-wider text-white/60">
            AI-generated · updated today
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold opacity-90 transition-opacity group-hover:opacity-100">
            Why? <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
