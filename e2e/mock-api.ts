import type { Page } from '@playwright/test';
import { resolveMockRequest, SSE_DONE, sseEvent } from '../src/mocks/api';

export interface MockApi {
  /** Body of every POST /api/chat request, in order. */
  chatRequests: unknown[];
}

// Serves the shared mock backend (src/mocks/api.ts) to the page. The chat reply is fixed
// per test so assertions don't depend on the canned answers used by mock mode.
export async function mockApi(page: Page, chatReply: string[]): Promise<MockApi> {
  const api: MockApi = { chatRequests: [] };

  await page.route('**/api/**', async (route) => {
    const request = route.request();
    const { pathname } = new URL(request.url());

    if (request.method() === 'POST' && pathname === '/api/chat') {
      api.chatRequests.push(request.postDataJSON());
      const body = chatReply.map(sseEvent).join('') + SSE_DONE;
      return route.fulfill({ status: 200, contentType: 'text/event-stream', body });
    }

    const { status, body } = resolveMockRequest(request.method(), pathname);
    return route.fulfill({ status, json: body });
  });

  return api;
}
