import { createContext, useContext } from 'react';

// The chat conversation lives in ChatProvider, above the routes, so it survives switching
// tabs. It's in memory only: a reload or signing out starts a fresh conversation.

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  /** What the agent is looking up right now (cleared when text resumes). */
  status?: string;
  /** Lets the player rate this answer; only set once the reply has finished. */
  feedbackToken?: string;
  rating?: Rating;
}

export type Rating = 1 | -1;

export interface ChatState {
  messages: ChatMessage[];
  streaming: boolean;
  sendMessage: (content: string) => Promise<void>;
  rate: (msg: ChatMessage, rating: Rating) => Promise<void>;
}

export const ChatContext = createContext<ChatState | null>(null);

export function useChat(): ChatState {
  const chat = useContext(ChatContext);
  if (!chat) throw new Error('useChat must be used inside ChatProvider');
  return chat;
}
