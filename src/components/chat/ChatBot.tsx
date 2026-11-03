import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, MessageCircle, Send, Square, Trash2, X } from 'lucide-react';
import { useAppSelector } from '../../store/store';
import { CHAT_PROVIDER_LABEL, ChatMessage, OLLAMA_MODEL, USE_OLLAMA, streamChat } from '../../utils/ollamaClient';

interface UiMessage {
  role: 'user' | 'assistant';
  content: string;
  error?: boolean;
}

const GREETING: UiMessage = {
  role: 'assistant',
  content:
    "Hi! I'm BookBot, your E-BookStore assistant. Ask me for book recommendations, prices, or help picking your next read.",
};

const SUGGESTIONS = [
  'Recommend a book on AI',
  'What are your best-rated books?',
  'Any books under $30?',
];

export const ChatBot: React.FC = () => {
  const books = useAppSelector((state) => state.products.books);
  const user = useAppSelector((state) => state.auth.user);

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<UiMessage[]>([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const systemPrompt = useMemo(() => {
    const catalogue = books
      .map(
        (b) =>
          `- ${b.title} by ${b.author} | ${b.category} | $${b.price.toFixed(2)} | ${b.rating}/5 stars | ${
            b.inStock ? 'in stock' : 'out of stock'
          }`
      )
      .join('\n');
    return [
      'You are BookBot, a friendly shopping assistant for E-BookStore.com.',
      'Answer concisely (max 4 short sentences or a short list).',
      'Only recommend books from the catalogue below and quote prices exactly as listed. If nothing fits, say so.',
      'Free shipping on orders over $35. Orders can be cancelled within 48 hours. Coupons: WELCOME10 (10% off), BOOKWORM (15% off).',
      user ? `The customer's name is ${user.name}.` : '',
      '',
      'CATALOGUE:',
      catalogue,
    ]
      .filter(Boolean)
      .join('\n');
  }, [books, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;

    const history: UiMessage[] = [...messages, { role: 'user', content }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setInput('');
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const payload: ChatMessage[] = [
      { role: 'system', content: systemPrompt },
      ...history.filter((m) => !m.error).map((m) => ({ role: m.role, content: m.content })),
    ];

    const updateLast = (fn: (m: UiMessage) => UiMessage) =>
      setMessages((prev) => [...prev.slice(0, -1), fn(prev[prev.length - 1])]);

    try {
      await streamChat(
        payload,
        (token) => updateLast((m) => ({ ...m, content: m.content + token })),
        controller.signal
      );
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        updateLast(() => ({
          role: 'assistant',
          error: true,
          content: USE_OLLAMA
            ? `I couldn't reach the Ollama AI service. Make sure Ollama is running locally and the "${OLLAMA_MODEL}" model is installed (ollama pull ${OLLAMA_MODEL}).`
            : "Sorry, I couldn't get a response right now. Please try again in a moment.",
        }));
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const stop = () => abortRef.current?.abort();

  const clear = () => {
    stop();
    setMessages([GREETING]);
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open chat assistant"
          className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg transition hover:bg-brand-700"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-5 right-5 z-50 flex h-[32rem] max-h-[calc(100vh-2.5rem)] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-brand-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <p className="text-sm font-semibold leading-tight">BookBot</p>
                <p className="text-[11px] leading-tight text-brand-100">Powered by {CHAT_PROVIDER_LABEL}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={clear} aria-label="Clear chat" className="rounded p-1 hover:bg-brand-700">
                <Trash2 className="h-4 w-4" />
              </button>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded p-1 hover:bg-brand-700">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${
                    m.role === 'user'
                      ? 'rounded-br-sm bg-brand-600 text-white'
                      : m.error
                      ? 'rounded-bl-sm border border-red-200 bg-red-50 text-red-700'
                      : 'rounded-bl-sm border border-slate-200 bg-white text-slate-800'
                  }`}
                >
                  {m.content || (
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                    </span>
                  )}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-brand-200 bg-white px-3 py-1 text-xs text-brand-700 hover:bg-brand-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-slate-200 bg-white p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about books..."
              className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
            {loading ? (
              <button
                type="button"
                onClick={stop}
                aria-label="Stop generating"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-white hover:bg-slate-800"
              >
                <Square className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
};
