import { useSyncExternalStore } from 'react';

// Aurora Serverless auto-pauses when idle. The first request after a pause gets a 503
// `database_resuming` (see docs/BACKEND.md → Error envelope); we wait and retry it while
// DatabaseResumingDialog tells the user what's going on.

const DEFAULT_RETRY_MS = 3_000;
// Resuming usually takes ~15s; past this, hand the 503 back to the caller as a normal error.
export const MAX_RESUME_WAIT_MS = 90_000;

let waiting = 0;
const listeners = new Set<() => void>();

function changeWaiting(delta: number) {
  waiting += delta;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const isResuming = () => waiting > 0;

export function useDatabaseResuming(): boolean {
  return useSyncExternalStore(subscribe, isResuming);
}

async function isResumeError(res: Response): Promise<boolean> {
  if (res.status !== 503) return false;
  const body = await res
    .clone()
    .json()
    .catch(() => null);
  return (body as { error?: string } | null)?.error === 'database_resuming';
}

function retryDelayMs(res: Response): number {
  const seconds = Number(res.headers.get('Retry-After'));
  return seconds > 0 ? seconds * 1000 : DEFAULT_RETRY_MS;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchWithResumeRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  let res = await fetch(input, init);
  if (!(await isResumeError(res))) return res;

  const deadline = Date.now() + MAX_RESUME_WAIT_MS;
  changeWaiting(1);
  try {
    while (await isResumeError(res)) {
      const delay = retryDelayMs(res);
      if (Date.now() + delay > deadline) break;
      await sleep(delay);
      res = await fetch(input, init);
    }
    return res;
  } finally {
    changeWaiting(-1);
  }
}
