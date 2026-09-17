import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { apiFetch } from '@/lib/api';
import { setToken } from '@/lib/auth';
import type { Player } from '@/types';

export default function LoginRoute() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await apiFetch<{ token: string; player: Player }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(data.token);
      queryClient.clear();
      navigate(data.player.onboardedAt ? '/' : '/onboarding', { replace: true });
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-md border border-ink/10 bg-white p-6 shadow-card">
      <div className="mb-6 text-2xl font-bold">
        courtside<span className="text-primary">.</span>
      </div>
      {error && (
        <div className="mb-3 rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{error}</div>
      )}
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          className="w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full rounded-md border border-ink/15 bg-paper px-3 py-2 text-sm"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>
    </div>
  );
}
