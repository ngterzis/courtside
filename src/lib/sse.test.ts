import { describe, expect, it } from 'vitest';
import { readSSE } from './sse';
import { SSE_DONE, sseEvent, streamFrom } from '@/test/streams';

async function collect(stream: ReadableStream<Uint8Array>) {
  const chunks: string[] = [];
  for await (const chunk of readSSE(stream)) chunks.push(chunk);
  return chunks;
}

describe('readSSE', () => {
  it('yields the text of each event in order', async () => {
    const stream = streamFrom([sseEvent('You '), sseEvent('averaged '), sseEvent('5.0 AST'), SSE_DONE]);

    expect(await collect(stream)).toEqual(['You ', 'averaged ', '5.0 AST']);
  });

  it('handles several events arriving in a single read', async () => {
    const stream = streamFrom([sseEvent('a') + sseEvent('b') + sseEvent('c') + SSE_DONE]);

    expect(await collect(stream)).toEqual(['a', 'b', 'c']);
  });

  it('reassembles an event split across two reads', async () => {
    const event = sseEvent('split in half');
    const mid = Math.floor(event.length / 2);
    const stream = streamFrom([event.slice(0, mid), event.slice(mid), SSE_DONE]);

    expect(await collect(stream)).toEqual(['split in half']);
  });

  it('decodes a multi-byte character split across two reads', async () => {
    const bytes = new TextEncoder().encode(sseEvent('nice 🏀'));
    // The emoji is the last 4 bytes before `"}\n\n`; cut through the middle of it
    const cut = bytes.length - 6;
    const stream = streamFrom([bytes.slice(0, cut), bytes.slice(cut), SSE_DONE]);

    expect(await collect(stream)).toEqual(['nice 🏀']);
  });

  it('preserves markdown newlines inside the JSON payload', async () => {
    const stream = streamFrom([sseEvent('**PTS**\n\n- 14.6'), SSE_DONE]);

    expect(await collect(stream)).toEqual(['**PTS**\n\n- 14.6']);
  });

  it('stops at [DONE] and ignores anything after it', async () => {
    const stream = streamFrom([sseEvent('kept'), SSE_DONE, sseEvent('dropped')]);

    expect(await collect(stream)).toEqual(['kept']);
  });

  it('finishes cleanly if the stream closes without [DONE]', async () => {
    const stream = streamFrom([sseEvent('partial')]);

    expect(await collect(stream)).toEqual(['partial']);
  });

  it('skips malformed JSON, non-data lines, and empty text', async () => {
    const stream = streamFrom([
      'data: {not json}\n\n',
      ': keep-alive comment\n\n',
      'event: ping\n\n',
      sseEvent(''),
      sseEvent('ok'),
      SSE_DONE,
    ]);

    expect(await collect(stream)).toEqual(['ok']);
  });

  it('releases the reader lock when finished', async () => {
    const stream = streamFrom([sseEvent('x'), SSE_DONE]);
    await collect(stream);

    expect(stream.locked).toBe(false);
  });

  it('releases the reader lock when the consumer stops early', async () => {
    const stream = streamFrom([sseEvent('first'), sseEvent('second'), SSE_DONE]);
    for await (const _ of readSSE(stream)) break;

    expect(stream.locked).toBe(false);
  });
});
