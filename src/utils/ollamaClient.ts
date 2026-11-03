export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// In dev, Vite proxies /ollama -> http://localhost:11434 (see vite.config.ts), which avoids CORS.
// Override with VITE_OLLAMA_URL (e.g. http://localhost:11434) if needed.
const OLLAMA_URL: string = (import.meta as any).env?.VITE_OLLAMA_URL || '/ollama';
export const OLLAMA_MODEL: string = (import.meta as any).env?.VITE_OLLAMA_MODEL || 'llama3.2';

/**
 * Streams a chat completion from Ollama, calling onToken for every chunk of text.
 * Resolves when the stream ends; rejects on network/HTTP errors. Abortable via signal.
 */
export async function streamOllamaChat(
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
