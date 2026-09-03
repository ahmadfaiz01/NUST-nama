import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { findVenueCoordinates } from "../src/lib/nust_venues";

dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function updateEvents() {
    console.log("Calibrating Supabase event coordinates...");
    const { data: events, error } = await supabase.from("events").select("id, title, venue_name, venue_lat, venue_lng");
    if (error || !events) {
        console.error("Error fetching events:", error);
        return;
    }

    for (const ev of events) {
        const coords = findVenueCoordinates(ev.venue_name);
        if (coords) {
            console.log(`Updating "${ev.title}" (${ev.venue_name}): [${ev.venue_lat}, ${ev.venue_lng}] -> [${coords.lat}, ${coords.lng}]`);
            await supabase.from("events").update({
                venue_lat: coords.lat,
                venue_lng: coords.lng
            }).eq("id", ev.id);
        } else if (ev.venue_name.toLowerCase().includes("c1")) {
            await supabase.from("events").update({ venue_lat: 33.64664, venue_lng: 72.99016 }).eq("id", ev.id);
            console.log(`Calibrated C1 event "${ev.title}"`);
        } else if (ev.venue_name.toLowerCase().includes("lib")) {
            await supabase.from("events").update({ venue_lat: 33.64204, venue_lng: 72.99251 }).eq("id", ev.id);
            console.log(`Calibrated Library event "${ev.title}"`);
        } else if (ev.venue_name.toLowerCase().includes("scee")) {
            await supabase.from("events").update({ venue_lat: 33.64800, venue_lng: 72.98930 }).eq("id", ev.id);
            console.log(`Calibrated SCEE event "${ev.title}"`);
        }
    }

    console.log("All events calibrated successfully!");
}

updateEvents().catch(console.error);
