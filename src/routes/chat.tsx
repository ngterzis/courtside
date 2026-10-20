import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, ThumbsDown, ThumbsUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChat, type Rating } from '@/lib/chat';
import { useMe, useCurrentSeason } from '@/lib/queries';
import { cn } from '@/lib/utils';

// ── Suggested questions ───────────────────────────────────────────────────────

const SUGGESTED: Array<{ group: string; questions: string[] }> = [
  {
    group: 'Based on your last game',
    questions: ['How did I rack up 7 assists vs the Ravens?', 'Why was that a personal best?'],
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

function ThinkingDots({ label }: { label?: string }) {
  return (
    <div role="status" aria-label="Thinking" className="flex items-center gap-1 px-1 py-0.5">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="inline-block h-2 w-2 rounded-full bg-ink/30"
          style={{ animation: `bounce 1s ${delay}ms infinite` }}
        />
      ))}
      {label && <span className="ml-1.5 text-[12px] text-ink-50">{label}</span>}
    </div>
  );
}

// ── Answer rating ─────────────────────────────────────────────────────────────

function FeedbackButtons({
  rating,
  onRate,
}: {
  rating?: Rating;
  onRate: (rating: Rating) => void;
}) {
  const options = [
    { value: 1 as const, label: 'Good answer', Icon: ThumbsUp },
    { value: -1 as const, label: 'Bad answer', Icon: ThumbsDown },
  ];
  return (
    <div className="mt-1 flex gap-1 pl-1">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          aria-label={label}
          aria-pressed={rating === value}
          disabled={rating !== undefined}
          onClick={() => onRate(value)}
          className={cn(
            'inline-flex h-7 w-7 items-center justify-center rounded-full text-ink-50 transition-colors',
            rating === value ? 'bg-paper-deep text-ink' : 'hover:bg-paper-deep',
            rating !== undefined && rating !== value && 'opacity-30',
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </button>
      ))}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ChatRoute() {
  const { data: me } = useMe();
  const { data: season } = useCurrentSeason();

  const { messages, streaming, sendMessage: send, rate } = useChat();
  const [input, setInput] = useState('');

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

  function sendMessage(content: string) {
    if (!content.trim() || streaming) return;
    setInput('');
    send(content);
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
                Hey {firstName} 👋 — ask me anything about your {season?.label ?? 'season'} numbers.
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
                className={cn('flex flex-col', msg.role === 'user' ? 'items-end' : 'items-start')}
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
                    <ThinkingDots label={msg.status} />
                  ) : msg.role === 'assistant' ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        strong: ({ children }) => (
                          <strong className="font-semibold">{children}</strong>
                        ),
                        h2: ({ children }) => <p className="mb-1 font-bold">{children}</p>,
                        h3: ({ children }) => <p className="mb-1 font-semibold">{children}</p>,
                        ul: ({ children }) => <ul className="mb-2 list-disc pl-4">{children}</ul>,
                        ol: ({ children }) => (
                          <ol className="mb-2 list-decimal pl-4">{children}</ol>
                        ),
                        li: ({ children }) => <li className="mb-0.5">{children}</li>,
                        table: ({ children }) => (
                          <div className="my-2 overflow-x-auto">
                            <table className="w-full border-collapse text-[12px]">{children}</table>
                          </div>
                        ),
                        th: ({ children }) => (
                          <th className="border border-ink/20 bg-paper-deep px-2 py-1 text-left font-semibold">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="border border-ink/20 px-2 py-1">{children}</td>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                  {msg.role === 'assistant' && msg.content !== '' && msg.status && (
                    <ThinkingDots label={msg.status} />
                  )}
                </div>
                {msg.role === 'assistant' && msg.feedbackToken && (
                  <FeedbackButtons rating={msg.rating} onRate={(r) => rate(msg, r)} />
                )}
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
