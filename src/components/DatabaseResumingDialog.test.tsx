import { act, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { fetchWithResumeRetry } from '@/lib/dbResuming';
import { DatabaseResumingDialog } from './DatabaseResumingDialog';

describe('DatabaseResumingDialog', () => {
  it('shows while a request waits for the database to resume, then disappears', async () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce(
          new Response(JSON.stringify({ error: 'database_resuming' }), { status: 503 }),
        )
        .mockResolvedValueOnce(new Response('{}')),
    );
    render(<DatabaseResumingDialog />);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();

    const pending = fetchWithResumeRetry('/api/me');
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(screen.getByRole('alertdialog', { name: 'Waking up Courtside' })).toBeInTheDocument();

    await act(() => vi.advanceTimersByTimeAsync(3_000));
    await pending;
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
