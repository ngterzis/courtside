import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useGames } from './queries';
import { MOCK_GAMES } from '@/mocks/fixtures';

function wrapper({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

describe('useGames', () => {
  it('returns games oldest first when the API sends them newest first', async () => {
    const newestFirst = [...MOCK_GAMES].sort((a, b) => b.date.localeCompare(a.date));
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve(
          new Response(JSON.stringify({ games: newestFirst, total: newestFirst.length }), {
            status: 200,
          }),
        ),
      ),
    );

    const { result } = renderHook(() => useGames(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    const dates = result.current.data!.map((g) => g.date);
    expect(dates).toEqual([...dates].sort());
    expect(dates).toHaveLength(MOCK_GAMES.length);
  });
});
