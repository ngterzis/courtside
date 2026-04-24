import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Game } from '@/types';
import { Button } from './ui/button';

interface Props {
  game: Game;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function LastGameCard({ game }: Props) {
  const { opponent, homeAway, date, stats, personalBests, coachNote } = game;
  const hasPb = personalBests.length > 0;

  return (
    <div className="rounded-md bg-accent-soft p-4 shadow-card lg:p-5">
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-ink-70">
          Your last game · {formatDate(date)}
        </div>
        {hasPb && (
          <div className="flex items-center gap-1 text-[11px] font-semibold text-accent">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            Personal best
          </div>
        )}
      </div>
      <div className="mt-1 text-xl font-bold tracking-tight lg:text-2xl">
        {homeAway === 'H' ? 'vs' : '@'} {opponent} · {stats.points} PTS
      </div>
      <div className="mt-1 text-xs text-ink-70 tabular">
        {stats.assists} AST · {stats.rebounds} REB · {stats.steals} STL ·{' '}
        {stats.turnovers} TOV
      </div>
      {coachNote && (
        <blockquote className="mt-3 border-l-2 border-accent/60 pl-3 text-sm italic text-ink/85">
          "{coachNote.text}"
          <span className="ml-2 text-[11px] not-italic text-ink-70">
            — {coachNote.authorName}
          </span>
        </blockquote>
      )}
      <div className="mt-3 flex gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to={`/games/${game.id}`}>Full line</Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link to="/games">All games</Link>
        </Button>
      </div>
    </div>
  );
}
