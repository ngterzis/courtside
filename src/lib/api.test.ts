import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError, apiFetch } from './api';
import { getToken, setToken } from './auth';

const jsonResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('apiFetch', () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  let replaceMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    replaceMock = vi.fn();
    vi.stubGlobal('location', { ...window.location, replace: replaceMock });
  });

  it('returns the parsed JSON body', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: 'p_jordan' }));

    await expect(apiFetch('/api/me')).resolves.toEqual({ id: 'p_jordan' });
  });

  it('sends the bearer token when logged in', async () => {
    setToken('abc123');
    fetchMock.mockResolvedValue(jsonResponse({}));

    await apiFetch('/api/me');

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers).toMatchObject({ Authorization: 'Bearer abc123' });
  });

  it('omits the Authorization header when logged out', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}));

    await apiFetch('/api/me');

    const [, init] = fetchMock.mock.calls[0];
    expect(init.headers).not.toHaveProperty('Authorization');
  });

  it('on 401, clears the token and redirects to /login', async () => {
    setToken('expired');
    fetchMock.mockResolvedValue(jsonResponse({}, 401));

    await expect(apiFetch('/api/me')).rejects.toMatchObject({ status: 401 });
    expect(getToken()).toBeNull();
    expect(replaceMock).toHaveBeenCalledWith('/login');
  });

  it('on 401 without a token (e.g. bad login), does not redirect', async () => {
    fetchMock.mockResolvedValue(jsonResponse({}, 401));

    await expect(apiFetch('/api/auth/login')).rejects.toBeInstanceOf(ApiError);
    expect(replaceMock).not.toHaveBeenCalled();
  });

  it('throws an ApiError with the server message on other failures', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'Game not found' }, 404));

    const error = await apiFetch('/api/games/nope').catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ message: 'Game not found', status: 404, body: { message: 'Game not found' } });
  });

  it('falls back to the status text when the error body is not JSON', async () => {
    fetchMock.mockResolvedValue(new Response('<html>Bad Gateway</html>', { status: 502, statusText: 'Bad Gateway' }));

    await expect(apiFetch('/api/me')).rejects.toMatchObject({ message: 'Bad Gateway', status: 502 });
  });
});
