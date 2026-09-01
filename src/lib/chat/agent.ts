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
  /** 'form' renders as a downloadable attachment rather than a citation pill. */
  doc_type: string | null;
};

export type AgentEvent =
  | { type: "tool"; name: string }
  | { type: "answer"; text: string; sources: Source[]; provider: string }
  | { type: "busy" };

const SYSTEM_PROMPT = `You are NUST Nama, a friendly, smart senior student & campus guide for NUST H-12 Islamabad.

How you talk:
- Like a helpful senior, not a legal handbook. Warm, direct, second-person: "You need 75% attendance", "The Coffee Lounge is located at..."
- SHORT and actionable. 2 to 4 sentences for direct questions.
- If asked "where is X" (cafe, lounge, school, gate, sports complex, gym, pool, hostel): ALWAYS call search_campus_places to give the exact building, zone, and nearby landmarks.
- If asked about sports, gym, swimming pool, orientation 2026 schedule, GPA curves, or attendance: call search_campus_knowledge.
- If asked for a form or procedure (gym membership, paper recheck, semester freeze, transcript): call find_forms. State the 3 simple real-world action steps (1. Fill details, 2. Get medical check at NMC or pay HBL challan, 3. Submit at the office). NEVER dump raw blank form questionnaire lines like "Name of candidate, Father name, Roll no".
- Plain text. Never write ** around words — asterisks show up raw on screen.
- Never write markdown links like [text](url) — the app automatically renders attachments and map badges.
- Reply in the language the student used (English/Urdu/Roman Urdu).`;

type ToolCall = { id: string; function: { name: string; arguments: string } };

const SOURCES_PER_CALL = 2;
const FORMS_PER_CALL = 1;

function collectSources(result: unknown, into: Map<string, Source>, limit: number) {
  if (!Array.isArray(result)) return;
  for (const row of (result as Record<string, unknown>[]).slice(0, limit)) {
    if (row && typeof row.section_id === "string") {
      // If it's a form and we already have a form, skip adding duplicate/unrelated forms
      if (row.doc_type === "form") {
        const hasForm = Array.from(into.values()).some((s) => s.doc_type === "form");
        if (hasForm) continue;
      }

      into.set(row.section_id, {
        section_id: row.section_id,
        title: (row.title as string) ?? null,
        heading_path: (row.heading_path as string) ?? null,
        page_start: (row.page_start as number) ?? null,
        page_end: (row.page_end as number) ?? null,
        published_at: (row.published_at as string) ?? null,
        url: (row.url as string) ?? null,
        doc_type: (row.doc_type as string) ?? null,
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
        collectSources(
          output,
          sources,
          call.function.name === "find_forms" ? FORMS_PER_CALL : SOURCES_PER_CALL,
        );
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
