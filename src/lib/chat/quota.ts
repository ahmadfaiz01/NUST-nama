// Server-side only: uses the service-role key, which must never reach a browser.
import { createClient } from "@supabase/supabase-js";

export const DAILY_LIMIT = 30;

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * How many questions this user has asked since midnight UTC.
 *
 * On a database error this FAILS OPEN — the question is allowed. A broken quota
 * check must not take the whole chatbot down; a handful of extra questions costs
 * far less than the feature appearing dead to every user. The error is logged
 * loudly so it still gets noticed.
 */
export async function checkQuota(
  userId: string
): Promise<{ allowed: boolean; used: number; limit: number }> {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const { count, error } = await supabaseAdmin
    .from("chat_messages")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfDay.toISOString());

  if (error) {
    console.error("[quota] check FAILED, failing open:", error.message);
    return { allowed: true, used: 0, limit: DAILY_LIMIT };
  }

  const used = count ?? 0;
  return { allowed: used < DAILY_LIMIT, used, limit: DAILY_LIMIT };
}
