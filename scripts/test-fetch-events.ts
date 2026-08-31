import { fetchEvents } from "../src/lib/events/fetchEvents";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function test() {
    try {
        const res = await fetchEvents({ dateFilter: "all", limit: 20 });
        console.log("fetchEvents result:", res.items.length, "items");
        console.log(res.items.map(i => ({ title: i.title, start_time: i.start_time, status: i.status })));
    } catch (e) {
        console.error("fetchEvents failed:", e);
    }
}

test();
