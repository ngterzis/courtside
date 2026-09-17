export { SSE_DONE, sseEvent } from '@/mocks/api';

const encoder = new TextEncoder();

// Builds a ReadableStream that delivers each chunk as a separate read(),
// the way a real network response arrives in arbitrary pieces.
export function streamFrom(chunks: Array<string | Uint8Array>): ReadableStream<Uint8Array> {
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(typeof chunk === 'string' ? encoder.encode(chunk) : chunk);
      }
      controller.close();
    },
  });
}
