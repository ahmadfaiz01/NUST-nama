import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function checkColumns() {
    const { data, error } = await supabase.from("events").select("*").limit(1);
    if (data && data[0]) {
        console.log("Existing columns on events:", Object.keys(data[0]));
    } else {
        console.log("Error:", error);
    }
}

checkColumns();
