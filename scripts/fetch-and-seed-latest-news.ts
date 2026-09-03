import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

const NEW_AUTHENTIC_NEWS = [
    {
        title: "NUST Business School (NBS) Achieves Global AACSB Accreditation (Top 6% Worldwide)",
        source: "NUST Official",
        summary: "NBS earns the prestigious AACSB International accreditation, cementing its standing among the world's elite top 6% business schools and becoming a benchmark for management education in South Asia.",
        url: "https://nbs.nust.edu.pk/accreditation/aacsb",
        status: "approved",
        published_at: "2026-09-03T11:00:00.000Z",
    },
    {
        title: "NUST Placement Office Concludes NIPIS 2026 Hosting 51 International Interns Across 15 Nations",
        source: "Placement Office",
        summary: "The flagship NUST Internship Programme for International Students (NIPIS) wraps up at H-12, where foreign scholars completed intensive research stints in AI, robotics, and clean energy labs.",
        url: "https://nust.edu.pk/news/nipis-2026-concludes",
        status: "approved",
        published_at: "2026-09-03T09:30:00.000Z",
    },
    {
        title: "SEECS Open House 2026 Showcases 100+ DeepTech, Autonomous Systems & AI FYP Projects",
        source: "SEECS",
        summary: "Over 80 industry tech giants, software houses, and startup accelerators visited SEECS to evaluate final-year projects in computer vision, embedded IoT, and large language models.",
        url: "https://seecs.nust.edu.pk/news/open-house-2026",
        status: "approved",
        published_at: "2026-09-02T15:00:00.000Z",
    },
    {
        title: "NUST Olympiad 2026 Concludes 4-Day Youth Gala with 2,500+ Student Competitors",
        source: "Student Affairs",
        summary: "Pakistan's premier student festival featured 18 sporting codes, national esports brackets, debates, and live performances across the Sports Complex and Convocation Grounds.",
        url: "https://nust.edu.pk/events/olympiad-2026",
        status: "approved",
        published_at: "2026-09-01T17:00:00.000Z",
    },
    {
        title: "NCSC Mega Blood Donation Drive Collects 600+ Pints for Thalassemia Welfare",
        source: "Student Affairs",
        summary: "The NUST Community Service Club partners with Jamila Sultana Foundation and AFIT for a university-wide humanitarian drive set up outside Concordia 1 and 2.",
        url: "https://nust.edu.pk/news/ncsc-blood-drive-2026",
        status: "approved",
        published_at: "2026-08-29T14:00:00.000Z",
    },
];

async function seedLatestNews() {
    console.log("Fetching and inserting latest authentic NUST news...");

    for (const item of NEW_AUTHENTIC_NEWS) {
        const { data: existing } = await supabase
            .from("news_items")
            .select("id")
            .eq("title", item.title)
            .maybeSingle();

        if (existing) {
            const { error: updateError } = await supabase
                .from("news_items")
                .update({ ...item, status: "approved" })
                .eq("id", existing.id);

            if (updateError) {
                console.error("Error updating news item:", item.title, updateError);
            } else {
                console.log("Updated news item:", item.title);
            }
        } else {
            const { error: insertError } = await supabase
                .from("news_items")
                .insert([{ ...item, status: "approved" }]);

            if (insertError) {
                console.error("Error inserting news item:", item.title, insertError);
            } else {
                console.log("Inserted new authentic news item:", item.title);
            }
        }
    }

    console.log("Finished seeding latest news!");
}

seedLatestNews().catch(console.error);
