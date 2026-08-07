/**
 * Provider chain for the chatbot.
 *
 * Groq, a second Groq key, and Gemini all expose an OpenAI-compatible API, so a
 * fallback is a different base URL and model rather than a different adapter.
 * Try each in order; on a quota or availability failure, move to the next.
 *
 * IMPORTANT: this chain is for CHAT ONLY. Embeddings must never fall back to a
 * different provider — sections were embedded with gte-small inside Supabase, and
 * a query embedded by any other model lands somewhere unrelated in vector space.
 * Search would return confident nonsense with no error at all.
 */

export type Provider = {
  name: string;
  baseUrl: string;
  apiKey: string | undefined;
  model: string;
};

/** Ordered best-first. Entries without a configured key are skipped at runtime. */
export const PROVIDERS: Provider[] = [
  {
    name: "groq",
    baseUrl: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY,
    model: "openai/gpt-oss-120b",
  },
  {
    name: "groq-backup",
    baseUrl: "https://api.groq.com/openai/v1",
    apiKey: process.env.GROQ_API_KEY_2,
    model: "openai/gpt-oss-120b",
  },
  {
    name: "mistral",
    baseUrl: "https://api.mistral.ai/v1",
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-large-latest",
  },
  {
    // Last, because Gemini's API is not served in Pakistan: verified 2026-08-07,
    // both the OpenAI-compatible and native endpoints return 403 "project has
    // been denied access" while /models still returns 200. Harmless to leave —
    // 403 fails over — and it starts working if access is ever granted.
    name: "gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    apiKey: process.env.GEMINI_API_KEY,
    model: "gemini-2.5-flash",
  },
];

export function availableProviders(): Provider[] {
  return PROVIDERS.filter((p) => p.apiKey);
}

/**
 * Should we give up on this provider and try the next one?
 *
 * Yes for anything specific to THIS provider: rate limits (429), billing (402),
 * outages (5xx), and bad or blocked credentials (401, 403). Gemini returns 403
 * "project has been denied access" in unsupported countries — a permanent
 * condition for that provider that must not take the whole request down.
 *
 * No for 400. That means OUR request is malformed — a bad tool schema, say — and
 * it will fail identically everywhere, so falling back would burn every quota we
 * have on the same broken request and report an outage that isn't happening.
 */
export function shouldFailOver(status: number): boolean {
  return (
    status === 429 ||
    status === 402 ||
    status === 401 ||
    status === 403 ||
    status >= 500
  );
}

export type ChatResult = {
  provider: string;
  message: {
    content: string | null;
    tool_calls?: Array<{
      id: string;
      function: { name: string; arguments: string };
    }>;
  };
};

/**
 * One chat completion, falling through the provider chain.
 *
 * Callers should pin the returned provider name for the rest of a tool loop.
 * Switching provider mid-loop hands one model another model's tool calls, which
 * mostly works — they are ordinary messages — but makes failures hard to read.
 */
export async function chat(
  messages: unknown[],
  tools: readonly unknown[],
  pinned?: string,
): Promise<ChatResult> {
  const chain = availableProviders();
  if (chain.length === 0) {
    throw new Error("No chat provider configured. Set GROQ_API_KEY or GEMINI_API_KEY.");
  }

  // `pinned` is a preference, not a restriction: try that provider first, but
  // still fall through the rest if it is rate-limited. Keeping the whole loop on
  // one model makes failures readable; refusing to switch makes them fatal, and
  // a mid-loop switch only means one model reads another's tool calls, which are
  // ordinary messages.
  const candidates = pinned
    ? [...chain.filter((p) => p.name === pinned), ...chain.filter((p) => p.name !== pinned)]
    : chain;
  const failures: string[] = [];

  for (const provider of candidates) {
    let response: Response;
    try {
      response = await fetch(`${provider.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${provider.apiKey}`,
        },
        body: JSON.stringify({
          model: provider.model,
          messages,
          tools,
          tool_choice: "auto",
          temperature: 0.2,
        }),
      });
    } catch (error) {
      failures.push(`${provider.name}: network ${String(error)}`);
      continue;
    }

    if (response.ok) {
      const data = await response.json();
      return { provider: provider.name, message: data.choices[0].message };
    }

    const detail = await response.text();
    failures.push(`${provider.name}: ${response.status}`);

    if (!shouldFailOver(response.status)) {
      // Our fault, not theirs. Fail loudly rather than retrying it three times.
      throw new Error(`${provider.name} rejected the request (${response.status}): ${detail}`);
    }
  }

  throw new Error(`All chat providers failed: ${failures.join("; ")}`);
}
