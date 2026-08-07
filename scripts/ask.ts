/**
 * CLI harness for the agent, so the loop can be proved before any UI exists.
 *
 *   npx tsx --env-file=.env.local scripts/ask.ts "how many classes can I miss"
 */
import { askAgent } from "../src/lib/chat/agent";

const question = process.argv.slice(2).join(" ");
if (!question) {
  console.error('usage: npx tsx --env-file=.env.local scripts/ask.ts "your question"');
  process.exit(1);
}

// Any uuid works: only get_my_rsvps reads it, and an unknown user has none.
const USER_ID = process.env.ASK_USER_ID ?? "00000000-0000-0000-0000-000000000000";

// Wrapped: tsx transpiles this file to CJS, which has no top-level await.
async function main() {
  for await (const event of askAgent(question, USER_ID)) {
    if (event.type === "tool") console.log(`  [tool] ${event.name}`);
    else if (event.type === "busy") console.log("busy, try again shortly");
    else {
      console.log(`\n--- answer (${event.provider}) ---\n${event.text}\n`);
      for (const s of event.sources) {
        console.log(`  * ${s.title} — ${s.heading_path} (p.${s.page_start}) ${s.url ?? ""}`);
      }
    }
  }
}

main();
