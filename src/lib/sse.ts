// Reads the `/api/chat` SSE stream and yields each text chunk.
// Wire format (see docs/BACKEND.md → Chat): `data: {"text":"..."}\n\n`, ending with `data: [DONE]\n\n`.
export async function* readSSE(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
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
          try {
            const parsed = JSON.parse(data) as { text?: string };
            if (parsed.text) yield parsed.text;
          } catch {
            // ignore malformed events
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
