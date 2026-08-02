// Server-side only: uses the service-role key, which must never reach a browser.
import { createHash } from "crypto";
import { createClient } from "@supabase/supabase-js";

const MAX_AGE_DAYS = 30;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Primary key of `answer_cache`. Must stay deterministic and stable forever —
 * changing the normalisation silently orphans every existing row.
 */
export function questionHash(question: string): string {
  const normalised = question.toLowerCase().trim().replace(/\s+/g, " ");
  return createHash("sha256").update(normalised).digest("hex");
}

export async function getCached(
  question: string
): Promise<{ answer: string; sources: unknown } | null> {
  // Rows older than 30 days are ignored: a cached fee deadline from last
  // semester is exactly the staleness this whole design exists to prevent.
  const cutoff = new Date(Date.now() - MAX_AGE_DAYS * 86_400_000).toISOString();

  const { data, error } = await supabaseAdmin
    .from("answer_cache")
    .select("answer, sources")
    .eq("question_hash", questionHash(question))
    .gte("created_at", cutoff)
    .maybeSingle();

  if (error) {
    console.error("[cache] read failed:", error.message);
    return null;
  }
  return data ?? null;
}

export async function putCached(
  question: string,
  answer: string,
  sources: unknown
): Promise<void> {
  // A cache is an optimisation, not a source of truth — never throw at the caller.
  const { error } = await supabaseAdmin
    .from("answer_cache")
    .upsert(
      {
        question_hash: questionHash(question),
        answer,
        sources,
        created_at: new Date().toISOString(),
      },
      { onConflict: "question_hash" }
    );

  if (error) console.error("[cache] write failed:", error.message);
}

/**
 * Drop every cached answer built from any of these sections. Called when
 * ingestion replaces or blacklists a section.
 */
export async function invalidateBySections(sectionIds: string[]): Promise<void> {
  // `sources` is a jsonb array of objects; `contains` maps to jsonb @>, so the
  // filter must be an array too — passed as a JSON *string*, because supabase-js
  // renders a real array as a postgres array literal ({...}) and postgrest then
  // rejects it with "invalid input syntax for type json".
  // One delete per id: @> cannot express "contains any of", and the lists are short.
  for (const id of sectionIds) {
    const { error } = await supabaseAdmin
      .from("answer_cache")
      .delete()
      .contains("sources", JSON.stringify([{ section_id: id }]));

    if (error) console.error(`[cache] invalidate failed for ${id}:`, error.message);
  }
}
