import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const POSTER_MAPPING: Record<string, string> = {
    // Day 1
    "Opening & Briefing / Q&A Session with Parents": "/images/events/d1p1.jpg",
    "Principal S3H Address + Q&A Session": "/images/events/d1p2.png",
    "Principal NBS Address + Q&A Session": "/images/events/d1p3.jpg",
    "Principal SEECS Address + Q&A Session": "/images/events/d1p4.jpg",
    "Meet Your OGs": "/images/events/d1p5.jpg",
    "Batch Photo": "/images/events/d1p6.jpg",

    // Day 2
    "Reception at Schools / SEECS Reception & Orientation": "/images/events/d2p1.jpg",
    "Closing Ceremony of NUST Summer School": "/images/events/d2p2.jpg",
    "OG Activities": "/images/events/d2p3.jpg",
    "Club and Societies Activities": "/images/events/d2p4.jpg",
    "Drama by NDC": "/images/events/d2p5.jpg",

    // Day 3
    "Life at NUST (Registrar + FAO + Alumni)": "/images/events/d3p1.jpg",
    "Life at NUST — SEECS": "/images/events/d3p2.jpg",
    "Closing Ceremony": "/images/events/d3p3.jpg",
    "Bazm Night / Society Stalls": "/images/events/d3p4.JPG",
};

async function main() {
    console.log("Linking posters to Orientation 2026 events in database...");

    for (const [title, posterUrl] of Object.entries(POSTER_MAPPING)) {
        const { data, error } = await supabase
            .from("events")
            .update({ poster_url: posterUrl })
            .eq("title", title)
            .select("id, title, poster_url");

        if (error) {
            console.error(`Error updating "${title}":`, error.message);
        } else if (data && data.length > 0) {
            console.log(`✓ Linked poster to "${title}" -> ${posterUrl}`);
        } else {
            console.warn(`⚠️ Event not found: "${title}"`);
        }
    }

    console.log("Done linking all posters!");
}

main().catch(console.error);
