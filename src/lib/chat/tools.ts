/**
 * The five tools the chat agent can call.
 *
 * Schemas and implementations live in the same file on purpose: a tool whose
 * schema and behaviour drift apart is the most common bug in this kind of code.
 *
 * SERVER ONLY. This module builds a service-role Supabase client, which bypasses
 * RLS. Never import it from a client component.
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
});

export const TOOL_SCHEMAS = [
  {
    type: "function",
    function: {
      name: "search_sections",
      description:
        "Search NUST's official documents for a topic. Use the vocabulary the " +
        "documents use, not the student's. A student asking 'how many classes " +
        "can I miss' should be searched as 'attendance requirement'.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search terms in document vocabulary" },
          doc_type: {
            type: "string",
            enum: ["policy", "fee", "scholarship", "prospectus", "form", "campus", "faq"],
            description: "Optional filter",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "read_section",
      description: "Read one section in full, by id, when a search snippet is not enough.",
      parameters: {
        type: "object",
        properties: { section_id: { type: "string" } },
        required: ["section_id"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "find_forms",
      description:
        "Find the form a student must fill in. Call this for any procedural " +
        "question - freezing a semester, migration, rechecking a paper.",
      parameters: {
        type: "object",
        properties: { topic: { type: "string" } },
        required: ["topic"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_events",
      description: "Find campus events happening soon. For questions about what is on.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string" },
          days_ahead: { type: "integer", description: "Default 14" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_my_rsvps",
      description: "Events the student has RSVP'd to.",
      parameters: { type: "object", properties: {} },
    },
  },
] as const;

/**
 * Embed a question with the SAME model that embedded the sections.
 *
 * Sections were embedded with gte-small running inside Supabase's `embed` edge
 * function. A query embedded by any other model lands somewhere unrelated in
 * vector space and search returns confident nonsense with no error at all. This
 * edge function is the only correct way to embed a query — never substitute
 * another embedding provider, and never let this fall back like chat does.
 *
 * The function returns 546 (worker resource limit) unpredictably under load, so
 * retry a few times with backoff before giving up.
 */
async function embedQuery(text: string): Promise<number[]> {
  let last = "";
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/embed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SERVICE_KEY}`,
        },
        body: JSON.stringify({ texts: [text] }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.embeddings[0];
      }
      last = `HTTP ${response.status}`;
    } catch (error) {
      last = String(error);
    }
  }
  throw new Error(`embed edge function failed after 3 attempts: ${last}`);
}

type SearchRow = {
  section_id: string;
  heading_path: string;
  content: string;
  url: string | null;
  title: string | null;
  page_start: number | null;
  page_end: number | null;
  published_at: string | null;
  doc_type: string | null;
};

/**
 * Hybrid search, shaped down to what the model can use. The `embedding` column
 * is 384 floats the model cannot read and must never reach the token budget.
 */
async function searchSections(query: string, docType?: string): Promise<SearchRow[]> {
  const { data, error } = await db.rpc("search_sections", {
    query_text: query,
    query_embedding: await embedQuery(query),
    match_count: 6,
    filter_doc_type: docType ?? null,
  });
  if (error) throw new Error(`search_sections failed: ${error.message}`);

  return (data ?? []).map((row: SearchRow & { content: string }) => ({
    section_id: row.section_id,
    heading_path: row.heading_path,
    content: row.content?.slice(0, 1200) ?? "",
    url: row.url,
    title: row.title,
    page_start: row.page_start,
    page_end: row.page_end,
    published_at: row.published_at,
    doc_type: row.doc_type,
  }));
}

/**
 * Run one tool.
 *
 * `userId` comes from the verified session in the route handler and is NEVER
 * taken from model arguments. A model that could choose whose RSVPs to read
 * would be an access control hole.
 */
export async function runTool(
  name: string,
  args: Record<string, unknown>,
  userId: string,
): Promise<unknown> {
  switch (name) {
    case "search_sections":
      return searchSections(String(args.query ?? ""), args.doc_type as string | undefined);

    case "find_forms":
      return searchSections(String(args.topic ?? ""), "form");

    case "read_section": {
      // id only — no other filter. Explicit column list keeps `embedding` out.
      const { data, error } = await db
        .from("sections")
        .select("id, document_id, ordinal, heading_path, content, page_start, page_end")
        .eq("id", String(args.section_id ?? ""))
        .maybeSingle();
      if (error) return { error: error.message };
      return data ?? { error: "no section with that id" };
    }

    case "search_events": {
      const days = Number(args.days_ahead) > 0 ? Number(args.days_ahead) : 14;
      const now = new Date();
      const until = new Date(now.getTime() + days * 86_400_000);
      const { data, error } = await db
        .from("events")
        .select(
          "id, title, description, start_time, end_time, venue_name, price, registration_url, tags, is_official",
        )
        .eq("status", "approved")
        .gte("start_time", now.toISOString())
        .lte("start_time", until.toISOString())
        .order("start_time", { ascending: true })
        .limit(10);
      if (error) return { error: error.message };
      return data ?? [];
    }

    case "get_my_rsvps": {
      const { data, error } = await db
        .from("rsvps")
        .select(
          "status, guests_count, created_at, events(id, title, start_time, end_time, venue_name)",
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) return { error: error.message };
      return data ?? [];
    }

    // A model can hallucinate a tool name. Returning an error lets the loop tell
    // it so; throwing would 500 the whole request over a typo.
    default:
      return { error: `unknown tool: ${name}` };
  }
}
