/**
 * The agent loop. Server only — it pulls in `tools.ts`, which is service-role.
 *
 * The model gets the five tools and decides which to call. We run them, hand the
 * results back, and repeat until it answers or MAX_TURNS is spent.
 */

import { chat } from "./providers";
import { TOOL_SCHEMAS, runTool } from "./tools";

/** Without a cap a confused model calls tools forever, against a daily budget. */
const MAX_TURNS = 4;

export type Source = {
  section_id: string;
  title: string | null;
  heading_path: string | null;
  page_start: number | null;
  page_end: number | null;
  published_at: string | null;
  url: string | null;
};

export type AgentEvent =
  | { type: "tool"; name: string }
  | { type: "answer"; text: string; sources: Source[]; provider: string }
  | { type: "busy" };

const SYSTEM_PROMPT = `You are NUST Nama, an assistant for students of the National University of Sciences and Technology, Pakistan.

Rules, all of them binding:
- Answer ONLY from tool results. You know nothing about NUST that a tool did not just tell you. Never fall back on general knowledge of how universities work.
- If the tools return nothing that answers the question, say so plainly: the documents do not cover it, and suggest who to ask. Do not guess.
- Students ask in their own words; the documents use official wording. Translate before searching — "how many classes can I miss" is "attendance requirement", "quitting for a semester" is "semester freeze".
- For any procedural question (freezing a semester, migration, rechecking a paper) call find_forms as well as searching policy, so the student gets the form, not just the rule.
- Cite the heading path and page of every section you used, inline, in plain words.
- If a fee, deadline or date comes from a document published before the current academic year, say so and tell the student to confirm with the office.
- When two documents disagree, prefer the newer one and say that you did.
- Reply in the language the student wrote in.
- Be brief. Students are on phones.
- Plain text only. No markdown, no asterisks, no headings — the app renders your reply as-is. Use short lines and "-" for lists. Write links as bare URLs.`;

type ToolCall = { id: string; function: { name: string; arguments: string } };

function collectSources(result: unknown, into: Map<string, Source>) {
  if (!Array.isArray(result)) return;
  for (const row of result as Record<string, unknown>[]) {
    if (row && typeof row.section_id === "string") {
      into.set(row.section_id, {
        section_id: row.section_id,
        title: (row.title as string) ?? null,
        heading_path: (row.heading_path as string) ?? null,
        page_start: (row.page_start as number) ?? null,
        page_end: (row.page_end as number) ?? null,
        published_at: (row.published_at as string) ?? null,
        url: (row.url as string) ?? null,
      });
    }
  }
}

export async function* askAgent(
  question: string,
  userId: string,
): AsyncGenerator<AgentEvent> {
  const messages: unknown[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: question },
  ];
  const sources = new Map<string, Source>();
  // Pinned after the first call: switching provider mid-loop hands one model
  // another model's tool calls, which makes failures unreadable.
  let pinned: string | undefined;

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    let result;
    try {
      result = await chat(messages, TOOL_SCHEMAS, pinned);
    } catch (error) {
      // Every provider exhausted, or the pinned one died. Free tiers do this.
      console.error("[agent] provider chain failed:", error);
      yield { type: "busy" };
      return;
    }
    pinned = result.provider;

    const calls = result.message.tool_calls;
    if (!calls?.length) {
      yield {
        type: "answer",
        text: result.message.content ?? "",
        sources: [...sources.values()],
        provider: result.provider,
      };
      return;
    }

    // Only the three fields every OpenAI-compatible API accepts. Groq's
    // gpt-oss also returns a `reasoning` field, and Mistral 422s on it — so
    // replaying an unedited history across a failover breaks the request.
    messages.push({
      role: "assistant",
      content: result.message.content ?? "",
      tool_calls: calls,
    });
    for (const call of calls as ToolCall[]) {
      yield { type: "tool", name: call.function.name };
      let output: unknown;
      try {
        output = await runTool(
          call.function.name,
          JSON.parse(call.function.arguments || "{}"),
          userId,
        );
        collectSources(output, sources);
      } catch (error) {
        // Tell the model the tool failed; it can try another phrasing.
        output = { error: String(error) };
      }
      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(output),
      });
    }
  }

  // Out of turns with no answer. Ask once more with tools withheld so the model
  // has to write something from what it already has.
  try {
    const final = await chat(messages, [], pinned);
    yield {
      type: "answer",
      text: final.message.content ?? "",
      sources: [...sources.values()],
      provider: final.provider,
    };
  } catch {
    yield { type: "busy" };
  }
}
