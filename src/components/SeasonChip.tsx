import { ChevronDown } from 'lucide-react';
import type { Season } from '@/types';

interface Props {
  season: Season;
  onClick?: () => void;
}

export function SeasonChip({ season, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1 rounded-full border border-ink/15 bg-white px-3 py-1 text-xs font-medium text-ink shadow-sm transition-colors hover:bg-paper-deep"
    >
      {season.label}
      <ChevronDown className="h-3 w-3 opacity-60" />
    </button>
  );
}
