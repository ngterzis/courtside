import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send } from 'lucide-react';
import { useMe, useCurrentSeason } from '@/lib/queries';
import { cn } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

// ── Suggested questions ───────────────────────────────────────────────────────

const SUGGESTED: Array<{ group: string; questions: string[] }> = [
  {
    group: 'Based on your last game',
    questions: [
      'How did I rack up 7 assists vs the Ravens?',
      'Why was that a personal best?',
    ],
  },
  {
    group: 'About your season',
    questions: [
      'How has my shooting improved?',
      "What's my weakest area?",
      'Why am I a Playmaker?',
      'How do I compare to the team in assists?',
    ],
  },
];

// ── Thinking dots ─────────────────────────────────────────────────────────────

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="inline-block h-2 w-2 rounded-full bg-ink/30"
          style={{ animation: `bounce 1s ${delay}ms infinite` }}
        />
      ))}
    </div>
  );
}

// ── SSE stream reader ─────────────────────────────────────────────────────────

async function* readSSE(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
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

// ── Component ─────────────────────────────────────────────────────────────────

export default function ChatRoute() {
  const { data: me } = useMe();
  const { data: season } = useCurrentSeason();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const firstName = me?.name.split(' ')[0] ?? 'there';

  // Auto-scroll on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [input]);

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || streaming) return;

    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: 'user', content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);
    setStreaming(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      for await (const token of readSSE(res.body)) {
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + token } : m)),
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: 'Sorry, something went wrong. Please try again.' }
            : m,
        ),
      );
    } finally {
      setStreaming(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  const empty = messages.length === 0;

  return (
    <div className="flex h-[calc(100dvh-80px)] flex-col lg:h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-ink/10 bg-card px-4 py-3 lg:px-6">
        <Link
          to="/"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink/15 bg-white transition-colors hover:bg-paper-deep lg:hidden"
          aria-label="Back"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ background: '#974ca8' }}
        >
          CA
        </div>
        <div className="min-w-0">
          <div className="text-sm font-semibold leading-none">Courtside Agent</div>
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-ink-50">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
            answers about your stats
          </div>
        </div>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 lg:px-6">
        <div className="mx-auto max-w-2xl space-y-4">
          {empty ? (
            /* ── Empty state: greeting + suggested questions ── */
            <>
              <div className="max-w-[82%] rounded-2xl rounded-tl-sm border border-ink/10 bg-card p-3 text-sm shadow-card">
                Hey {firstName} 👋 — ask me anything about your{' '}
                {season?.label ?? 'season'} numbers.
              </div>

              {SUGGESTED.map(({ group, questions }) => (
                <div key={group} className="pt-2">
                  <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ink-50">
                    {group}
                  </div>
                  <div className="space-y-2">
                    {questions.map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="w-full rounded-xl border border-ink/12 bg-card px-3 py-2.5 text-left text-[13px] font-medium transition-colors hover:bg-paper-deep"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </>
          ) : (
            /* ── Conversation ── */
            messages.map((msg) => (
              <div
                key={msg.id}
                className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                <div
                  className={cn(
                    'max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'rounded-br-sm bg-primary text-white'
                      : 'rounded-tl-sm border border-ink/10 bg-card shadow-card',
                  )}
                >
                  {msg.role === 'assistant' && msg.content === '' ? (
                    <ThinkingDots />
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input row */}
      <div className="border-t border-ink/10 bg-card px-4 py-3 lg:px-6">
        <div className="mx-auto flex max-w-2xl items-end gap-2">
          <div className="flex flex-1 items-end rounded-2xl border border-ink/20 bg-white px-3.5 py-2.5 focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/10 transition-shadow">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your stats…"
              rows={1}
              disabled={streaming}
              className="flex-1 resize-none bg-transparent text-[13px] leading-relaxed text-ink placeholder:text-ink-50 focus:outline-none disabled:opacity-50"
              style={{ maxHeight: 120 }}
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || streaming}
            aria-label="Send"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-card transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mx-auto mt-1.5 max-w-2xl text-[10px] text-ink-50">
          Enter to send · Shift+Enter for a new line
        </p>
      </div>
    </div>
  );
}
