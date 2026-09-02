import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const AUTHENTIC_NEWS = [
    {
        title: "NUST Leaps to 114th Globally in Computer Science (QS World University Rankings 2026)",
        source: "NUST Official",
        summary: "NUST solidifies its position as Pakistan's top-ranked institution, jumping 50 spots globally in Computer Science & Information Systems, and retaining #1 in Engineering & Technology with new global rankings in Data Science & Artificial Intelligence.",
        url: "https://nust.edu.pk/news/qs-world-rankings-2026",
        status: "approved",
        published_at: "2026-09-02T08:00:00.000Z",
    },
    {
        title: "NUST Orientation 2026 (ON'26) Kicks Off Across H-12 Campus for 4,000+ Freshmen",
        source: "Student Affairs",
        summary: "The flagship 3-day orientation opens with addresses by the Rector and Principals at Jinnah Auditorium, batch photographs, Orientation Guide (OG) squad tours, societies expo, and the campus-wide Pokémon Scavenger Hunt.",
        url: "https://orientation.nust.edu.pk/schedule-2026",
        status: "approved",
        published_at: "2026-09-02T06:00:00.000Z",
    },
    {
        title: "NUST Placement Office Launches 'Career Connect 2026' with 120+ Top Tech & Industry Leaders",
        source: "Placement Office",
        summary: "Connecting graduating students and young alumni with leading multinationals, software houses, and engineering firms for on-campus interviews, resume reviews, and fast-track job placements.",
        url: "https://nust.edu.pk/news/career-connect-2026",
        status: "approved",
        published_at: "2026-09-01T10:30:00.000Z",
    },
    {
        title: "SCME Hosts 7th International Conference on Emerging Materials and Processes (CEMP 2026)",
        source: "NUST Official",
        summary: "Leading international and national scientists gather at the School of Chemical & Materials Engineering to showcase breakthroughs in green hydrogen, nanotechnology, and advanced composites.",
        url: "https://nust.edu.pk/news/cemp-conference-2026",
        status: "approved",
        published_at: "2026-08-30T12:00:00.000Z",
    },
    {
        title: "Team Aeromavericks from SEECS Wins Top Honors at National Aerothon & Autonomous Drone Challenge",
        source: "SEECS",
        summary: "NUST SEECS aerospace and computing students secure national championship for custom-engineered autonomous payload delivery UAVs and vision-guided flight controllers.",
        url: "https://seecs.nust.edu.pk/achievements/aerothon-2026",
        status: "approved",
        published_at: "2026-08-28T14:00:00.000Z",
    },
    {
        title: "NUST Central Library Expands 24/7 Silent Study Lounges & High-Speed Research Repositories",
        source: "Library",
        summary: "The Central Library introduces extended study spaces on the ground floor, upgraded fiber workstation bays, and direct access to IEEE Xplore, ACM, and ScienceDirect repositories.",
        url: "https://library.nust.edu.pk/announcements/extended-hours-2026",
        status: "approved",
        published_at: "2026-08-25T09:00:00.000Z",
    },
    {
        title: "USPCAS-E Introduces Updated Bachelor of Engineering Curriculum in Renewable Energy Systems",
        source: "NUST Official",
        summary: "Starting Fall 2026, the US-Pakistan Center for Advanced Studies in Energy launches cutting-edge specializations in solar grid integration, EV powertrain tech, and battery management.",
        url: "https://uspcas-e.nust.edu.pk/programs/be-renewable-energy-2026",
        status: "approved",
        published_at: "2026-08-20T11:00:00.000Z",
    },
    {
        title: "NUST Sports Complex Announces Registrations for Inter-School Autumn Sports Gala 2026",
        source: "Sports Complex",
        summary: "Tournaments for Futsal, Basketball, Cricket, Badminton, and Table Tennis open for undergraduate and postgraduate departmental teams across H-12.",
        url: "https://nust.edu.pk/news/autumn-sports-gala-2026",
        status: "approved",
        published_at: "2026-08-18T16:00:00.000Z",
    },
    {
        title: "NSTP Inducts 20 High-Growth DeepTech & AI Startups in Hatch 8 Pre-Incubation Cohort",
        source: "NUST Official",
        summary: "National Science & Technology Park welcomes student and alumni founders with seed grants, patent filing support, and workspace access in Islamabad's premier tech hub.",
        url: "https://nstp.pk/cohorts/hatch-8-inductees",
        status: "approved",
        published_at: "2026-08-15T13:00:00.000Z",
    },
];

async function seedNews() {
    console.log("Seeding authentic 2026 NUST news items...");

    for (const item of AUTHENTIC_NEWS) {
        const { data: existing } = await supabase
            .from("news_items")
            .select("id")
            .eq("title", item.title)
            .maybeSingle();

        if (existing) {
            await supabase
                .from("news_items")
                .update({ ...item, status: "approved" })
                .eq("id", existing.id);
            console.log(`Updated: ${item.title}`);
        } else {
            const { error } = await supabase
                .from("news_items")
                .insert([item]);
            if (error) console.error("Error inserting:", error.message);
            else console.log(`Inserted: ${item.title}`);
        }
    }

    console.log("Seeding complete!");
}

seedNews();
