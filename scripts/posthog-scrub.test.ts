/**
 * Run: npx tsx scripts/posthog-scrub.test.ts
 *
 * Every pageview URL goes to PostHog. /auth/callback carries the OAuth `code`,
 * and a failed sign-in carries the rejected address in `error`. Neither belongs
 * in an analytics vendor, and nothing on screen would tell us if it leaked.
 */
import assert from "assert";
import { scrubUrl } from "../src/components/providers/PostHogProvider";

// The OAuth authorization code never leaves the app.
assert.strictEqual(
  scrubUrl("https://nustnama.vercel.app/auth/callback?code=abc123secret"),
  "https://nustnama.vercel.app/auth/callback?code=redacted",
);

// Supabase's error message names the address that was rejected.
assert.strictEqual(
  scrubUrl("https://nustnama.vercel.app/auth?error=someone%40gmail.com+is+not+NUST"),
  "https://nustnama.vercel.app/auth?error=redacted",
);

// Several at once, and unrelated params are left alone.
assert.strictEqual(
  scrubUrl("https://x.test/p?code=a&utm_source=insta&access_token=b"),
  "https://x.test/p?code=redacted&utm_source=insta&access_token=redacted",
);

// An ordinary URL is untouched.
assert.strictEqual(scrubUrl("https://nustnama.vercel.app/map"), "https://nustnama.vercel.app/map");

// A bare pathname is not a valid URL. It must pass through, not throw — this
// runs inside before_send, where an exception would drop the event silently.
assert.strictEqual(scrubUrl("/ask"), "/ask");
assert.strictEqual(scrubUrl(""), "");

console.log("posthog-scrub: all checks passed");
