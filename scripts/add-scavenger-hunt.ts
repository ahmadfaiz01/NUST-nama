import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
    const scavengerHuntEvent = {
        title: "Orientation Scavenger Hunt",
        description: "Explore the NUST campus, solve clues, and compete with fellow freshmen in the official Orientation 2026 Scavenger Hunt! Join the waitlist now at https://orientation.nust.edu.pk/waitlist",
        start_time: "2026-09-03T13:00:00+05:00",
        end_time: "2026-09-03T18:00:00+05:00",
        venue_name: "NBS Ground",
        venue_lat: 33.6450,
        venue_lng: 72.9928,
        category: "Cultural",
        tags: ["Orientation2026", "ScavengerHunt", "Game", "Waitlist", "Freshmen"],
        poster_url: "/images/events/scavenger-hunt.jpg",
        registration_url: "https://orientation.nust.edu.pk/waitlist",
        status: "approved",
        is_official: true,
    };

    const { data: existing } = await supabase
        .from("events")
        .select("id")
        .eq("title", scavengerHuntEvent.title)
        .maybeSingle();

    if (existing) {
        const { error } = await supabase
            .from("events")
            .update(scavengerHuntEvent)
            .eq("id", existing.id);
        if (error) console.error("Error updating:", error);
        else console.log("✓ Updated Scavenger Hunt event with poster and waitlist link!");
    } else {
        const { error } = await supabase
            .from("events")
            .insert(scavengerHuntEvent);
        if (error) console.error("Error inserting:", error);
        else console.log("✓ Created Scavenger Hunt event with poster and waitlist link!");
    }
}

main().catch(console.error);
