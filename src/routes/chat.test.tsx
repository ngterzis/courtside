import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ChatRoute from './chat';
import { setToken } from '@/lib/auth';
import { MOCK_CURRENT_SEASON, MOCK_PLAYER } from '@/mocks/fixtures';
import { SSE_DONE, sseEvent, streamFrom } from '@/test/streams';

const encoder = new TextEncoder();

// A response body the test pushes chunks into, to observe the UI mid-stream.
function controllableStream() {
  let controller!: ReadableStreamDefaultController<Uint8Array>;
  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      controller = c;
    },
  });
  return {
    stream,
    push: (text: string) => controller.enqueue(encoder.encode(text)),
    close: () => controller.close(),
  };
}

const json = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });

let chatResponse: () => Response | Promise<Response>;
let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  chatResponse = () => new Response(streamFrom([SSE_DONE]));
  fetchMock = vi.fn((url: string) => {
    if (url === '/api/me') return Promise.resolve(json(MOCK_PLAYER));
    if (url === '/api/seasons/current') return Promise.resolve(json(MOCK_CURRENT_SEASON));
    if (url === '/api/chat') return Promise.resolve(chatResponse());
    return Promise.reject(new Error(`Unexpected fetch: ${url}`));
  });
  vi.stubGlobal('fetch', fetchMock);
});

function renderChat() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter
        initialEntries={['/chat']}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        <ChatRoute />
      </MemoryRouter>
    </QueryClientProvider>,
  );
  return { user: userEvent.setup() };
}

const input = () => screen.getByPlaceholderText('Ask about your stats…');
const sendButton = () => screen.getByRole('button', { name: 'Send' });
const chatRequests = () => fetchMock.mock.calls.filter(([url]) => url === '/api/chat');

describe('ChatRoute', () => {
  it('greets the player by first name and offers suggested questions', async () => {
    renderChat();

    expect(await screen.findByText(/Hey Jordan/)).toBeInTheDocument();
    expect(await screen.findByText(/Spring '26/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Why am I a Playmaker?' })).toBeInTheDocument();
  });

  it('shows thinking dots, then streams the reply in as it arrives', async () => {
    const body = controllableStream();
    chatResponse = () => new Response(body.stream);
    const { user } = renderChat();

    await user.type(input(), 'How has my shooting improved?{Enter}');

    expect(screen.getByText('How has my shooting improved?')).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Thinking' })).toBeInTheDocument();
    // While waiting, the input is locked
    expect(input()).toBeDisabled();

    body.push(sseEvent('Your TS% '));
    expect(await screen.findByText('Your TS%')).toBeInTheDocument();

    body.push(sseEvent('rose to **58%**.'));
    body.push(SSE_DONE);
    body.close();

    const strong = await screen.findByText('58%');
    expect(strong.tagName).toBe('STRONG');
    expect(strong.parentElement).toHaveTextContent('Your TS% rose to 58%.');
    await waitFor(() => expect(input()).toBeEnabled());
  });

  it('shows thinking dots only until the first chunk arrives', async () => {
    const body = controllableStream();
    chatResponse = () => new Response(body.stream);
    const { user } = renderChat();

    await user.click(await screen.findByRole('button', { name: "What's my weakest area?" }));

    expect(screen.getByRole('status', { name: 'Thinking' })).toBeInTheDocument();

    body.push(sseEvent('Turnovers.'));
    await screen.findByText('Turnovers.');
    expect(screen.queryByRole('status', { name: 'Thinking' })).not.toBeInTheDocument();

    body.push(SSE_DONE);
    body.close();
    await waitFor(() => expect(input()).toBeEnabled());
  });

  it('sends the conversation history without the empty assistant placeholder', async () => {
    chatResponse = () => new Response(streamFrom([sseEvent('First answer.'), SSE_DONE]));
    const { user } = renderChat();

    await user.type(input(), 'First question{Enter}');
    await screen.findByText('First answer.');
    await waitFor(() => expect(input()).toBeEnabled());

    await user.type(input(), 'Follow-up{Enter}');
    await waitFor(() => expect(chatRequests()).toHaveLength(2));

    const [, init] = chatRequests()[1];
    expect(JSON.parse(init.body)).toEqual({
      messages: [
        { role: 'user', content: 'First question' },
        { role: 'assistant', content: 'First answer.' },
        { role: 'user', content: 'Follow-up' },
      ],
    });
  });

  it('sends the auth token with the chat request', async () => {
    setToken('tok_123');
    const { user } = renderChat();

    await user.type(input(), 'hi{Enter}');
    await waitFor(() => expect(chatRequests()).toHaveLength(1));

    expect(chatRequests()[0][1].headers).toMatchObject({ Authorization: 'Bearer tok_123' });
  });

  it('shows an error message when the request fails', async () => {
    chatResponse = () => new Response('nope', { status: 500 });
    const { user } = renderChat();

    await user.type(input(), 'hi{Enter}');

    expect(
      await screen.findByText('Sorry, something went wrong. Please try again.'),
    ).toBeInTheDocument();
    expect(input()).toBeEnabled();
  });

  it('shows an error instead of endless thinking dots when the reply is empty', async () => {
    chatResponse = () => new Response(streamFrom([SSE_DONE]));
    const { user } = renderChat();

    await user.type(input(), 'hi{Enter}');

    expect(
      await screen.findByText('Sorry, something went wrong. Please try again.'),
    ).toBeInTheDocument();
  });

  it('ignores blank messages and shift+enter', async () => {
    const { user } = renderChat();

    expect(sendButton()).toBeDisabled();
    await user.type(input(), '   {Enter}');
    await user.type(input(), 'line one{Shift>}{Enter}{/Shift}line two');

    expect(input()).toHaveValue('   line one\nline two');
    expect(chatRequests()).toHaveLength(0);
  });
});
