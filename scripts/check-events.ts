import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("Supabase URL:", supabaseUrl ? "Present" : "Missing");
console.log("Anon Key:", supabaseAnonKey ? "Present" : "Missing");
console.log("Service Key:", supabaseServiceKey ? "Present" : "Missing");

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
    const { data, error } = await supabase.from("events").select("id, title, status, start_time, is_official");
    console.log("Query with Anon Key:");
    console.log("Total events:", data?.length);
    console.log("Error:", error);
    if (data && data.length > 0) {
        console.log("First 3 events:", data.slice(0, 3));
    }
}

run().catch(console.error);
