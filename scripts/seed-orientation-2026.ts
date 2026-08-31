/**
 * Seed script to insert all NUST Orientation 2026 events into the Supabase database.
 * Run with: npx tsx scripts/seed-orientation-2026.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing SUPABASE environment variables in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export const ORIENTATION_2026_EVENTS = [
    // ── Day 1: Wednesday, 2nd Sep 2026 ───────────────────────────────────────
    {
        title: "Opening & Briefing / Q&A Session with Parents",
        description: "Official opening and orientation briefing session for freshmen and their parents with university administration, followed by an open Q&A session.",
        start_time: "2026-09-02T10:00:00+05:00",
        end_time: "2026-09-02T11:30:00+05:00",
        venue_name: "Jinnah Auditorium / NBS Hall",
        venue_lat: 33.6460,
        venue_lng: 72.9925,
        category: "Academic",
        tags: ["Orientation2026", "Day1", "Freshmen", "Briefing", "Parents"],
        is_official: true,
        status: "approved",
        poster_url: null as string | null,
    },
    {
        title: "Principal S3H Address + Q&A Session",
        description: "Welcome address and orientation Q&A session by the Principal of School of Social Sciences & Humanities (S3H) for incoming students.",
        start_time: "2026-09-02T12:00:00+05:00",
        end_time: "2026-09-02T13:00:00+05:00",
        venue_name: "Jinnah Auditorium",
        venue_lat: 33.6460,
        venue_lng: 72.9925,
        category: "Academic",
        tags: ["Orientation2026", "Day1", "S3H", "PrincipalAddress"],
        is_official: true,
        status: "approved",
        poster_url: null as string | null,
    },
    {
        title: "Principal NBS Address + Q&A Session",
        description: "Welcome address and interactive Q&A session by the Principal of NUST Business School (NBS).",
        start_time: "2026-09-02T14:00:00+05:00",
        end_time: "2026-09-02T15:00:00+05:00",
        venue_name: "Jinnah Auditorium",
        venue_lat: 33.6460,
        venue_lng: 72.9925,
        category: "Academic",
        tags: ["Orientation2026", "Day1", "NBS", "PrincipalAddress"],
        is_official: true,
        status: "approved",
        poster_url: null as string | null,
    },
    {
        title: "Principal SEECS Address + Q&A Session",
        description: "Welcome address and orientation Q&A session by the Principal of School of Electrical Engineering & Computer Science (SEECS).",
        start_time: "2026-09-02T15:30:00+05:00",
        end_time: "2026-09-02T16:30:00+05:00",
        venue_name: "Jinnah Auditorium",
        venue_lat: 33.6460,
        venue_lng: 72.9925,
        category: "Academic",
        tags: ["Orientation2026", "Day1", "SEECS", "PrincipalAddress"],
        is_official: true,
        status: "approved",
        poster_url: null as string | null,
    },
    {
        title: "Meet Your OGs",
        description: "Meet and connect with your dedicated Orientation Guides (OGs). Icebreakers, group allocations, and campus intro.",
        start_time: "2026-09-02T14:00:00+05:00",
        end_time: "2026-09-02T16:00:00+05:00",
        venue_name: "NBS Ground",
        venue_lat: 33.6450,
        venue_lng: 72.9928,
        category: "Cultural",
        tags: ["Orientation2026", "Day1", "OGs", "Icebreaker", "Fun"],
        is_official: true,
        status: "approved",
        poster_url: null as string | null,
    },
    {
        title: "Batch Photo",
        description: "Official orientation batch photograph session for the incoming Class of 2026 at the Convocation Ground.",
        start_time: "2026-09-02T16:00:00+05:00",
        end_time: "2026-09-02T21:00:00+05:00",
        venue_name: "Convocation Ground",
        venue_lat: 33.6458,
        venue_lng: 72.9914,
        category: "Cultural",
        tags: ["Orientation2026", "Day1", "BatchPhoto", "Memories"],
        is_official: true,
        status: "approved",
        poster_url: null as string | null,
    },

    // ── Day 2: Thursday, 3rd Sep 2026 ────────────────────────────────────────
    {
        title: "Reception at Schools / SEECS Reception & Orientation",
        description: "School-level departmental reception, faculty introductions, lab tours, and academic advising.",
        start_time: "2026-09-03T09:00:00+05:00",
        end_time: "2026-09-03T13:00:00+05:00",
        venue_name: "Respective Schools / NET Exam Hall",
        venue_lat: 33.6433,
        venue_lng: 72.9916,
        category: "Academic",
        tags: ["Orientation2026", "Day2", "SchoolReception", "SEECS", "Academics"],
        is_official: true,
        status: "approved",
        poster_url: null as string | null,
    },
    {
        title: "Closing Ceremony of NUST Summer School",
        description: "Concluding ceremony and certificate distribution for NUST Summer School students.",
        start_time: "2026-09-03T14:30:00+05:00",
        end_time: "2026-09-03T16:00:00+05:00",
        venue_name: "CIPS Auditorium",
        venue_lat: 33.6430,
        venue_lng: 72.9900,
        category: "Academic",
        tags: ["Orientation2026", "Day2", "SummerSchool", "ClosingCeremony"],
        is_official: true,
        status: "approved",
        poster_url: null as string | null,
    },
    {
        title: "OG Activities",
        description: "Exciting team challenges, games, and society introductions organized by the Orientation Guides.",
        start_time: "2026-09-03T13:00:00+05:00",
        end_time: "2026-09-03T19:00:00+05:00",
        venue_name: "NBS Ground",
        venue_lat: 33.6450,
        venue_lng: 72.9928,
        category: "Cultural",
        tags: ["Orientation2026", "Day2", "OGActivities", "Games", "Squad"],
        is_official: true,
        status: "approved",
        poster_url: null as string | null,
    },
    {
        title: "Club and Societies Activities",
        description: "Interactive showcases and stall displays from all student clubs and societies across NUST.",
        start_time: "2026-09-03T14:00:00+05:00",
        end_time: "2026-09-03T19:00:00+05:00",
        venue_name: "NUST Central Grounds",
        venue_lat: 33.6460,
        venue_lng: 72.9925,
        category: "Cultural",
        tags: ["Orientation2026", "Day2", "Societies", "Clubs", "Stalls"],
        is_official: true,
        status: "approved",
        poster_url: null as string | null,
    },
    {
        title: "Drama by NDC",
        description: "A theatrical production presented by the NUST Dramatics Club (NDC) for the fresh batch.",
        start_time: "2026-09-03T18:00:00+05:00",
        end_time: "2026-09-03T21:00:00+05:00",
        venue_name: "Jinnah Auditorium",
        venue_lat: 33.6460,
        venue_lng: 72.9925,
        category: "Entertainment",
        tags: ["Orientation2026", "Day2", "NDC", "Drama", "Theatre"],
        is_official: true,
        status: "approved",
        poster_url: null as string | null,
    },

    // ── Day 3: Friday, 4th Sep 2026 ──────────────────────────────────────────
    {
        title: "Life at NUST (Registrar + FAO + Alumni)",
        description: "Essential guidance on academic rules, scholarship opportunities, financial aid (FAO), and alumni guest speaker session.",
        start_time: "2026-09-04T10:00:00+05:00",
        end_time: "2026-09-04T12:30:00+05:00",
        venue_name: "Jinnah Auditorium",
        venue_lat: 33.6460,
        venue_lng: 72.9925,
        category: "Academic",
        tags: ["Orientation2026", "Day3", "LifeAtNUST", "Registrar", "FAO", "Alumni"],
        is_official: true,
        status: "approved",
        poster_url: null as string | null,
    },
    {
        title: "Life at NUST — SEECS",
        description: "School of Electrical Engineering and Computer Science student life session, club activities, and departmental roadmap.",
        start_time: "2026-09-04T10:00:00+05:00",
        end_time: "2026-09-04T12:30:00+05:00",
        venue_name: "SCEE Seminar Hall",
        venue_lat: 33.6477,
        venue_lng: 73.0028,
        category: "Academic",
        tags: ["Orientation2026", "Day3", "SEECS", "StudentLife"],
        is_official: true,
        status: "approved",
        poster_url: null as string | null,
    },
    {
        title: "Closing Ceremony",
        description: "Grand closing ceremony marking the official conclusion of NUST Orientation 2026.",
        start_time: "2026-09-04T15:30:00+05:00",
        end_time: "2026-09-04T16:30:00+05:00",
        venue_name: "Jinnah Auditorium",
        venue_lat: 33.6460,
        venue_lng: 72.9925,
        category: "Academic",
        tags: ["Orientation2026", "Day3", "ClosingCeremony", "NUST"],
        is_official: true,
        status: "approved",
        poster_url: null as string | null,
    },
    {
        title: "Bazm Night / Society Stalls",
        description: "Flagship cultural evening featuring musical performances, student stalls, delicious food, and celebration.",
        start_time: "2026-09-04T17:00:00+05:00",
        end_time: "2026-09-04T22:00:00+05:00",
        venue_name: "SCME Ground",
        venue_lat: 33.6496,
        venue_lng: 73.0003,
        category: "Cultural",
        tags: ["Orientation2026", "Day3", "BazmNight", "Music", "Food", "Celebration"],
        is_official: true,
        status: "approved",
        poster_url: null as string | null,
    },
];

async function seed() {
    console.log(`Seeding ${ORIENTATION_2026_EVENTS.length} Orientation 2026 events...`);

    for (const ev of ORIENTATION_2026_EVENTS) {
        // Upsert by title + start_time
        const { error } = await supabase
            .from("events")
            .upsert(ev, { onConflict: "title,start_time" as any });

        if (error) {
            // If conflict key isn't configured, do insert
            const { error: insertError } = await supabase.from("events").insert(ev);
            if (insertError) {
                console.error(`Failed to insert "${ev.title}":`, insertError.message);
                continue;
            }
        }
        console.log(`✓ Added: ${ev.title} (${ev.start_time.slice(0, 10)})`);
    }

    console.log("Done seeding Orientation 2026 events!");
}

seed().catch(console.error);
