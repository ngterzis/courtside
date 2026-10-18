// Reads the `/api/chat` SSE stream and yields one typed event per `data:` line.
// Wire format (see docs/BACKEND.md → Chat): `data: {"text":"..."}\n\n`,
// `data: {"status":"..."}\n\n` while the agent queries the database,
// `data: {"feedback":"<token>"}\n\n` to rate the answer, ending with `data: [DONE]\n\n`.
// Unknown fields are ignored so the server can add event kinds safely.
export type ChatStreamEvent =
  | { type: 'text'; text: string }
  | { type: 'status'; status: string }
  | { type: 'feedback'; token: string };

export async function* readSSE(body: ReadableStream<Uint8Array>): AsyncGenerator<ChatStreamEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() ?? '';
      for (const part of parts) {
        for (const line of part.split('\n')) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') return;
          let parsed: { text?: unknown; status?: unknown; feedback?: unknown };
          try {
            parsed = JSON.parse(data);
          } catch {
            continue; // ignore malformed events
          }
          if (typeof parsed.text === 'string' && parsed.text) {
            yield { type: 'text', text: parsed.text };
          } else if (typeof parsed.status === 'string' && parsed.status) {
            yield { type: 'status', status: parsed.status };
          } else if (typeof parsed.feedback === 'string' && parsed.feedback) {
            yield { type: 'feedback', token: parsed.feedback };
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
