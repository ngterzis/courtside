import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import type { Player, Position } from '@/types';

const POSITIONS: Position[] = ['Guard', 'Forward', 'Center'];

export default function OnboardingRoute() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [position, setPosition] = useState<Position | ''>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!position) {
      setError('Please select a position.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await apiFetch<Player>('/api/me/onboard', {
        method: 'POST',
        body: JSON.stringify({ jerseyNumber: Number(jerseyNumber), position }),
      });
      await queryClient.invalidateQueries({ queryKey: ['me'] });
      navigate('/', { replace: true });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-md border border-ink/10 bg-white p-6 shadow-card">
      <div className="mb-1 text-2xl font-bold">
        courtside<span className="text-primary">.</span>
      </div>
      <p className="mb-6 text-sm text-ink-70">Let's set up your player profile.</p>
      {error && (
        <div className="mb-3 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{error}</div>
      )}
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-ink-70">
            Jersey number
          </label>
          <input
            className="w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm"
            type="number"
            min={0}
            max={99}
            placeholder="e.g. 23"
            value={jerseyNumber}
            onChange={(e) => setJerseyNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-ink-70">
            Position
          </label>
          <div className="flex gap-2">
            {POSITIONS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPosition(p)}
                className={[
                  'flex-1 rounded-md border py-2 text-sm font-semibold transition-colors',
                  position === p
                    ? 'border-primary bg-primary text-white'
                    : 'border-ink/15 bg-paper text-ink hover:border-ink/30',
                ].join(' ')}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading || !position || !jerseyNumber}>
          {loading ? 'Saving…' : 'Get started'}
        </Button>
      </form>
    </div>
  );
}
