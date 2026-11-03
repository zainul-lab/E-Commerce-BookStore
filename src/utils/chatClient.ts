export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Streams a chat reply from the /api/chat serverless function (which talks to the
 * configured LLM using BASE_URL / API_KEY / MODEL), calling onToken for every chunk of text.
 * Messages should start with one system message. Rejects on network/HTTP errors; abortable via signal.
 */
export async function streamChat(
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
