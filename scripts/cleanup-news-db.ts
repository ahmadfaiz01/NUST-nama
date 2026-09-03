import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupNews() {
    console.log("Cleaning up news_items table...");

    const { data: allItems, error } = await supabase.from("news_items").select("*");
    if (error || !allItems) {
        console.error("Error fetching news:", error);
        return;
    }

    console.log(`Initial items in DB: ${allItems.length}`);

    // 1. Remove broken items (e.g. title is literally 'News ' or empty or url is a hex hash)
    const toDeleteIds: string[] = [];
    const seenTitles = new Set<string>();

    for (const item of allItems) {
        const trimmedTitle = (item.title || "").trim();
        const isHashUrl = !item.url || !item.url.startsWith("http");
        const isJunkTitle = trimmedTitle.toLowerCase() === "news" || trimmedTitle.length < 5;

        // If it's a junk item or a hash url
        if (isHashUrl || isJunkTitle) {
            toDeleteIds.push(item.id);
            continue;
        }

        // If we already saw this exact title with a valid URL, remove duplicates
        if (seenTitles.has(trimmedTitle.toLowerCase())) {
            toDeleteIds.push(item.id);
            continue;
        }

        seenTitles.add(trimmedTitle.toLowerCase());
    }

    if (toDeleteIds.length > 0) {
        console.log(`Deleting ${toDeleteIds.length} broken/duplicate/hash rows...`);
        const { error: delError } = await supabase.from("news_items").delete().in("id", toDeleteIds);
        if (delError) console.error("Error deleting:", delError);
        else console.log("Successfully deleted invalid rows.");
    }

    // 2. Normalize and ensure clean text & valid https URLs on all remaining items
    const { data: remaining } = await supabase.from("news_items").select("*");
    if (remaining) {
        for (const item of remaining) {
            const cleanTitle = (item.title || "").trim();
            const cleanSummary = (item.summary || "").trim();
            const cleanUrl = item.url?.startsWith("http") ? item.url : "https://nust.edu.pk/news";

            await supabase
                .from("news_items")
                .update({
                    title: cleanTitle,
                    summary: cleanSummary,
                    url: cleanUrl,
                    status: "approved",
                })
                .eq("id", item.id);
        }
        console.log(`Cleaned and standardized ${remaining.length} remaining news items!`);
    }
}

cleanupNews().catch(console.error);
