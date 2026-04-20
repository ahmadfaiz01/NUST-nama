import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CUTOFF_DAYS = 7;
const STORAGE_BUCKET = "event-posters";

Deno.serve(async (req: Request) => {
  // Security: only accept calls authenticated with the service role key
  // pg_cron will pass this in the Authorization header
  const authHeader = req.headers.get("Authorization");
  const expectedToken = `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`;

  if (authHeader !== expectedToken) {
    console.error("Unauthorized cleanup attempt. Invalid or missing token.");
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Use service role client — bypasses RLS to allow deletion of any row
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } }
  );

  // Calculate cutoff: events that ended more than CUTOFF_DAYS ago
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - CUTOFF_DAYS);
  const cutoffISO = cutoffDate.toISOString();

  console.log(`[cleanup] Starting. Cutoff: ${cutoffISO}`);

  // ─── STEP 1: Find stale events ────────────────────────────────────────────
  const { data: staleEvents, error: fetchError } = await supabase
    .from("events")
    .select("id, title, poster_url")
    .lt("end_time", cutoffISO); // ended before the cutoff

  if (fetchError) {
    console.error("[cleanup] Fetch error:", fetchError);
    return new Response(JSON.stringify({ error: fetchError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!staleEvents || staleEvents.length === 0) {
    console.log("[cleanup] Nothing to clean up.");
    return new Response(
      JSON.stringify({ message: "Nothing to clean up.", cleaned_events: 0 }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  console.log(`[cleanup] Found ${staleEvents.length} stale events.`);

  // ─── STEP 2: Extract storage file paths from poster URLs ──────────────────
  // Full URL format:
  //   https://<ref>.supabase.co/storage/v1/object/public/event-posters/<userId>/<file>
  const storageFilePaths: string[] = staleEvents
    .filter(
      (e) =>
        e.poster_url &&
        typeof e.poster_url === "string" &&
        e.poster_url.includes(`/object/public/${STORAGE_BUCKET}/`) &&
        !e.poster_url.includes("source.unsplash.com") // skip placeholder images
    )
    .map((e) => {
      try {
        const url = new URL(e.poster_url);
        const marker = `/object/public/${STORAGE_BUCKET}/`;
        const idx = url.pathname.indexOf(marker);
        return idx !== -1 ? url.pathname.slice(idx + marker.length) : null;
      } catch {
        return null;
      }
    })
    .filter((path): path is string => Boolean(path));

  // ─── STEP 3: Delete storage files BEFORE deleting DB rows ─────────────────
  let filesDeleted = 0;
  if (storageFilePaths.length > 0) {
    console.log(`[cleanup] Deleting ${storageFilePaths.length} storage files...`);
    const { error: storageError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove(storageFilePaths);

    if (storageError) {
      // Log but continue — a failed storage delete should not block DB cleanup
      console.error("[cleanup] Storage deletion error:", storageError.message);
    } else {
      filesDeleted = storageFilePaths.length;
      console.log(`[cleanup] Deleted ${filesDeleted} files from storage.`);
    }
  }

  // ─── STEP 4: Delete DB rows (FKs cascade to rsvps, checkins, messages) ────
  const staleIds = staleEvents.map((e) => e.id);
  const { error: deleteError, count } = await supabase
    .from("events")
    .delete({ count: "exact" })
    .in("id", staleIds);

  if (deleteError) {
    console.error("[cleanup] DB delete error:", deleteError);
    return new Response(JSON.stringify({ error: deleteError.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = {
    success: true,
    cleaned_events: count ?? staleIds.length,
    storage_files_deleted: filesDeleted,
    cutoff_date: cutoffISO,
    run_at: new Date().toISOString(),
  };

  console.log("[cleanup] Done:", result);
  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
