export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

const env = (import.meta as any).env ?? {};

// Local Ollama is used in dev (Vite proxies /ollama -> http://localhost:11434, see vite.config.ts)
// or whenever VITE_OLLAMA_URL is set. Otherwise (production on Vercel) the hosted /api/chat
// serverless function is used.
const OLLAMA_URL: string = env.VITE_OLLAMA_URL || '/ollama';
export const USE_OLLAMA: boolean = Boolean(env.DEV || env.VITE_OLLAMA_URL);
export const OLLAMA_MODEL: string = env.VITE_OLLAMA_MODEL || 'llama3.2';
export const CHAT_PROVIDER_LABEL: string = USE_OLLAMA ? `Ollama · ${OLLAMA_MODEL}` : 'AI assistant';

async function streamOllama(
  messages: ChatMessage[],
  onToken: (token: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const response = await fetch(`${OLLAMA_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: OLLAMA_MODEL, messages, stream: true }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`Ollama request failed (${response.status})`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.trim()) continue;
      const chunk = JSON.parse(line);
      if (chunk.error) throw new Error(chunk.error);
      if (chunk.message?.content) onToken(chunk.message.content);
    }
  }
}

// Hosted path: the serverless function owns the API key and streams back plain text.
async function streamHosted(
  messages: ChatMessage[],
  onToken: (token: string) => void,
  signal?: AbortSignal
): Promise<void> {
  const context = messages.find((m) => m.role === 'system')?.content ?? '';
  const turns = messages.filter((m) => m.role !== 'system');

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: turns, context }),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`Chat request failed (${response.status})`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const text = decoder.decode(value, { stream: true });
    if (text) onToken(text);
  }
}

/**
 * Streams a chat completion, calling onToken for every chunk of text.
 * Messages should start with one system message. Rejects on network/HTTP errors; abortable via signal.
 */
export function streamChat(
  messages: ChatMessage[],
  onToken: (token: string) => void,
  signal?: AbortSignal
): Promise<void> {
  return USE_OLLAMA ? streamOllama(messages, onToken, signal) : streamHosted(messages, onToken, signal);
}
