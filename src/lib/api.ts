import { clearToken, getToken } from './auth';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  const res = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  if (res.status === 401) {
    if (getToken()) {
      clearToken();
      window.location.replace('/login');
    }
    throw new ApiError('Unauthorized', 401, null);
  }

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError((body as { message?: string })?.message ?? res.statusText, res.status, body);
  }

  return body as T;
}
