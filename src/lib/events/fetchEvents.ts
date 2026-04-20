import { createClient } from "@/lib/supabase/client";

export interface EventItem {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  venue_name: string | null;
  category: string | null;
  poster_url: string | null;
  tags: string[] | null;
  status: string;
  is_official: boolean;
  sentiment: "pos" | "neu" | "neg" | null;
  rsvp_count: number;
  checkin_count: number;
}

export interface FetchEventsOptions {
  /** ISO timestamp of the last event's start_time — used as pagination cursor */
  cursor?: string;
  limit?: number;
  category?: string;
  /** Free-text search against event title */
  search?: string;
  /** Date window: 'today' | 'tomorrow' | 'week' | 'all' */
  dateFilter?: "today" | "tomorrow" | "week" | "all";
}

export interface FetchEventsResult {
  items: EventItem[];
  /** Pass this as `cursor` in the next call. Null means no more pages. */
  nextCursor: string | null;
  hasNextPage: boolean;
}

export async function fetchEvents({
  cursor,
  limit = 20,
  category,
  search,
  dateFilter = "all",
}: FetchEventsOptions): Promise<FetchEventsResult> {
  const supabase = createClient();
  const now = new Date();

  let query = supabase
    .from("events")
    .select(
      `
      id,
      title,
      description,
      start_time,
      end_time,
      venue_name,
      category,
      poster_url,
      tags,
      status,
      is_official,
      sentiment,
      rsvps(count),
      checkins(count)
    `
    )
    .eq("status", "approved")
    .order("start_time", { ascending: true })
    // Fetch one extra item to detect if a next page exists
    .limit(limit + 1);

  // ─── Cursor-based pagination ────────────────────────────────────────────
  // Use the last item's start_time as the cursor.
  // "Give me events that start AFTER the last one I saw."
  if (cursor) {
    query = query.gt("start_time", cursor);
  }

  // ─── Date filter ────────────────────────────────────────────────────────
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (dateFilter === "today") {
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);
    query = query
      .gte("start_time", startOfToday.toISOString())
      .lt("start_time", endOfToday.toISOString());
  } else if (dateFilter === "tomorrow") {
    const startOfTomorrow = new Date(startOfToday);
    startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
    const endOfTomorrow = new Date(startOfTomorrow);
    endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
    query = query
      .gte("start_time", startOfTomorrow.toISOString())
      .lt("start_time", endOfTomorrow.toISOString());
  } else if (dateFilter === "week") {
    const endOfWeek = new Date(startOfToday);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    query = query
      .gte("start_time", startOfToday.toISOString())
      .lt("start_time", endOfWeek.toISOString());
  } else {
    // Default: only future events
    query = query.gte("start_time", now.toISOString());
  }

  // ─── Category filter ────────────────────────────────────────────────────
  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  // ─── Free-text search ───────────────────────────────────────────────────
  if (search && search.trim().length > 0) {
    query = query.ilike("title", `%${search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  const rawData = data ?? [];

  // The "+1 trick": if we got more than `limit`, there IS a next page
  const hasNextPage = rawData.length > limit;
  const items = hasNextPage ? rawData.slice(0, limit) : rawData;

  // Normalize the nested aggregate counts
  const normalized: EventItem[] = items.map((e: any) => ({
    ...e,
    rsvp_count: e.rsvps?.[0]?.count ?? 0,
    checkin_count: e.checkins?.[0]?.count ?? 0,
    rsvps: undefined,
    checkins: undefined,
  }));

  const nextCursor =
    hasNextPage && normalized.length > 0
      ? normalized[normalized.length - 1].start_time
      : null;

  return { items: normalized, nextCursor, hasNextPage };
}
