import { delay, http, HttpResponse } from 'msw';
import { setupWorker } from 'msw/browser';
import {
  mockChatReply,
  resolveMockRequest,
  SSE_DONE,
  sseEvent,
  sseFeedback,
  sseStatus,
  toChunks,
} from './api';

const encoder = new TextEncoder();

const handlers = [
  http.post('/api/chat', async ({ request }) => {
    const { messages } = (await request.json()) as { messages: Array<{ content: string }> };
    const chunks = toChunks(mockChatReply(messages[messages.length - 1]?.content ?? ''));

    // Mirror the real agent: a feedback token, a tool-lookup status, then the reply
    // word by word with a short pause.
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        controller.enqueue(encoder.encode(sseFeedback('mock-feedback-token')));
        await delay(300);
        controller.enqueue(encoder.encode(sseStatus('Looking up your games…')));
        await delay(600);
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(sseEvent(chunk)));
          await delay(35);
        }
        controller.enqueue(encoder.encode(SSE_DONE));
        controller.close();
      },
    });
    return new HttpResponse(stream, { headers: { 'Content-Type': 'text/event-stream' } });
  }),

  http.all('/api/*', async ({ request }) => {
    await delay(150);
    const { status, body } = resolveMockRequest(request.method, new URL(request.url).pathname);
    return HttpResponse.json(body as Record<string, unknown>, { status });
  }),
];

export const worker = setupWorker(...handlers);
