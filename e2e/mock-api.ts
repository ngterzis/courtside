import type { Page } from '@playwright/test';
import { resolveMockRequest, SSE_DONE, sseEvent } from '../src/mocks/api';

export interface MockApi {
  /** Body of every POST /api/chat request, in order. */
  chatRequests: unknown[];
}

// Serves the shared mock backend (src/mocks/api.ts) to the page. Tests pass a fixed chat
// reply so assertions don't depend on mock mode's canned answers; a function picks the
// reply from the latest question.
type ChatReply = string[] | ((question: string) => string[]);

export async function mockApi(page: Page, chatReply: ChatReply): Promise<MockApi> {
  const api: MockApi = { chatRequests: [] };

  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const { pathname } = new URL(request.url());

    if (request.method() === 'POST' && pathname === '/api/chat') {
      const payload = request.postDataJSON() as { messages: Array<{ content: string }> };
      api.chatRequests.push(payload);
      const question = payload.messages[payload.messages.length - 1]?.content ?? '';
      const chunks = typeof chatReply === 'function' ? chatReply(question) : chatReply;
      const body = chunks.map(sseEvent).join('') + SSE_DONE;
      return route.fulfill({ status: 200, contentType: 'text/event-stream', body });
    }

    const { status, body } = resolveMockRequest(request.method(), pathname);
    return route.fulfill({ status, json: body });
  });

  return api;
}
