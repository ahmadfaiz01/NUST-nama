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

const SYSTEM_PROMPT = `You are NUST Nama, a friendly senior student answering questions for students at NUST, Pakistan.

How you talk:
- Like a person, not a policy document. Warm, direct, second person: "you need 75% attendance", not "students are required to maintain".
- SHORT. Two or three sentences for most questions. Four at the absolute most, and only for a multi-step procedure.
- Lead with the answer. No preamble, no "based on the documents", no restating the question, no summary at the end.
- Plain text. Never write ** around anything — the app does not render markdown and the asterisks show up on screen.
- If the answer is a procedure, write it as numbered steps, one per line, starting "1. ", "2. " and so on. One short sentence per step. Anything else is prose, not a list.
- Never answer a "how do I…" question with just the form. The student wants to know what actually happens: what they fill in, what it costs, who they hand it to, how long it takes. Give those steps. The form is attached to your answer automatically — you do not need to hand it over, and saying "here is the form" as your whole answer is a non-answer. Do not mention the attachment either — the student can see it.
- Never write a markdown link like [text](url). Just say what the thing is.
- Do NOT paste URLs, document titles, page numbers or heading paths into your reply. The app shows the sources under your answer, and attaches any form as a download, so writing them out just makes you look like a search engine.
- Reply in the language the student wrote in.

What you may say:
- Only what the tools just told you. You know nothing about NUST otherwise — never fall back on how universities generally work.
- If the tools found nothing, say so in one line and point them at the right office. Never guess.
- NUST's handbooks cross-reference themselves: "Refer to Para 9 to Chapter 3 for details". That is not an answer and the student cannot follow it. Never repeat paragraph or chapter numbers back to them, never list what the documents "refer to", and never explain what you could not find. If all you retrieved was a pointer, say in one line that the handbooks do not spell this out, then give the one or two concrete things you DO know and who to ask.
- Students ask in their own words; the documents use official wording. Translate before you search: "how many classes can I miss" is "attendance requirement", "quitting for a semester" is "semester freeze".
- For anything procedural (freezing a semester, migration, rechecking a paper) call find_forms too, so the student gets the form and not just the rule.
- If a fee or deadline comes from a document older than this academic year, add one short line telling them to confirm with the office.
- If two documents disagree, go with the newer one.`;

type ToolCall = { id: string; function: { name: string; arguments: string } };

/**
 * Search returns six ranked rows and the model reads maybe two. Showing all
 * eighteen from three calls buries the real citation under hostel-allotment
 * pages, so keep the top few per call — ranked, so the top few are the ones
 * that matched.
 */
const SOURCES_PER_CALL = 3;

/**
 * Forms are shown as download cards, and a wrong card is worse than a wrong
 * citation — it looks like the thing the student is meant to fill in. Search
 * ranks them, so keep the top one and drop the rest: "Instructions for Filling
 * Bond" sitting under a rechecking question is noise wearing a form's clothes.
 */
const FORMS_PER_CALL = 1;

function collectSources(result: unknown, into: Map<string, Source>, limit: number) {
  if (!Array.isArray(result)) return;
  for (const row of (result as Record<string, unknown>[]).slice(0, limit)) {
    if (row && typeof row.section_id === "string") {
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
