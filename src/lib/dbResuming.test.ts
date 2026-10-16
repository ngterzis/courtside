import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MAX_RESUME_WAIT_MS, fetchWithResumeRetry, useDatabaseResuming } from './dbResuming';

const jsonResponse = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  });

const resuming = () =>
  jsonResponse({ error: 'database_resuming', message: '…' }, 503, { 'Retry-After': '5' });

describe('fetchWithResumeRetry', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.useFakeTimers();
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('retries after Retry-After while the database resumes, flagging it meanwhile', async () => {
    fetchMock.mockResolvedValueOnce(resuming()).mockResolvedValueOnce(jsonResponse({ ok: true }));
    const { result } = renderHook(() => useDatabaseResuming());

    const pending = fetchWithResumeRetry('/api/me');
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(result.current).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await act(() => vi.advanceTimersByTimeAsync(5_000));
    const res = await pending;

    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(result.current).toBe(false);
  });

  it('does not retry other errors', async () => {
    fetchMock.mockResolvedValueOnce(jsonResponse({ error: 'internal_error' }, 500));
    await expect(fetchWithResumeRetry('/api/me')).resolves.toMatchObject({ status: 500 });

    fetchMock.mockResolvedValueOnce(jsonResponse({ error: 'service_unavailable' }, 503));
    await expect(fetchWithResumeRetry('/api/me')).resolves.toMatchObject({ status: 503 });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('gives up and returns the 503 once the wait limit is reached', async () => {
    fetchMock.mockImplementation(async () => resuming());
    const { result } = renderHook(() => useDatabaseResuming());

    const pending = fetchWithResumeRetry('/api/me');
    await act(() => vi.advanceTimersByTimeAsync(MAX_RESUME_WAIT_MS + 5_000));
    const res = await pending;

    expect(res.status).toBe(503);
    expect(fetchMock).toHaveBeenCalledTimes(MAX_RESUME_WAIT_MS / 5_000 + 1);
    expect(result.current).toBe(false);
  });
});
