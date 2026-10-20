import { useState, type ReactNode } from 'react';
import { apiFetch } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { ChatContext, type ChatMessage, type Rating } from '@/lib/chat';
import { fetchWithResumeRetry } from '@/lib/dbResuming';
import { readSSE } from '@/lib/sse';

// Not crypto.randomUUID(): browsers only expose it on HTTPS or localhost, so it throws when
// the dev server is opened from a phone over the LAN
let nextId = 0;
const newId = () => `msg-${nextId++}`;

// Holds the chat conversation above the routes, so leaving the chat tab doesn't lose it and a
// reply that's still streaming keeps filling in while the player is elsewhere.
export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);

  function updateMessage(id: string, patch: (m: ChatMessage) => Partial<ChatMessage>) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch(m) } : m)));
  }

  async function rate(msg: ChatMessage, rating: Rating) {
    if (!msg.feedbackToken || msg.rating !== undefined) return;
    updateMessage(msg.id, () => ({ rating }));
    try {
      await apiFetch('/api/chat/feedback', {
        method: 'POST',
        body: JSON.stringify({ token: msg.feedbackToken, score: rating }),
      });
    } catch {
      updateMessage(msg.id, () => ({ rating: undefined })); // let them try again
    }
  }

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || streaming) return;

    const userMsg: ChatMessage = { id: newId(), role: 'user', content: trimmed };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);

    const assistantId = newId();
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);
    setStreaming(true);

    try {
      const token = getToken();
      const res = await fetchWithResumeRetry('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          messages: nextMessages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      let received = false;
      let feedbackToken: string | undefined;
      for await (const event of readSSE(res.body)) {
        if (event.type === 'text') {
          received = true;
          updateMessage(assistantId, (m) => ({
            content: m.content + event.text,
            status: undefined,
          }));
        } else if (event.type === 'status') {
          updateMessage(assistantId, () => ({ status: event.status }));
        } else {
          feedbackToken = event.token;
        }
      }
      // An empty reply would leave the thinking dots up forever
      if (!received) throw new Error('Empty response');
      updateMessage(assistantId, () => ({ status: undefined, feedbackToken }));
    } catch {
      updateMessage(assistantId, () => ({
        content: 'Sorry, something went wrong. Please try again.',
        status: undefined,
      }));
    } finally {
      setStreaming(false);
    }
  }

  return (
    <ChatContext.Provider value={{ messages, streaming, sendMessage, rate }}>
      {children}
    </ChatContext.Provider>
  );
}
