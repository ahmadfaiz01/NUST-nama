# Handoff — NUST Nama chatbot

Last updated 8 August 2026. Read this first, then `docs/superpowers/plans/2026-08-06-chatbot.md`
for the full plan and `PROJECT_CONTEXT.md` for the rest of the app.

## Where the chatbot stands

All seven tasks of Plan B are built and committed. The feature works end to end:
a signed-in student asks at `/ask` or through the floating bubble, an agent loop
searches NUST's corpus, and the answer comes back with source pills and any form
as a download card.

```
src/lib/chat/agent.ts      the loop: call model, run tools, repeat (MAX_TURNS 4)
src/lib/chat/tools.ts      five tools + their schemas. SERVER ONLY, service role
src/lib/chat/providers.ts  Groq -> Groq backup -> Mistral -> Gemini
src/lib/chat/cache.ts      answer cache, keyed on question + PROMPT_VERSION
src/lib/chat/quota.ts      30 questions per user per day
src/app/api/ask/route.ts   session -> quota -> cache -> agent, streamed as SSE
src/components/chat/       ChatPanel (page and bubble), Citation, AnswerText
```

## Three things that will bite you

**The cache serves the old answer.** Change the system prompt and nothing on
screen changes, because `answer_cache` answers before the agent runs. Bump
`PROMPT_VERSION` in `src/lib/chat/cache.ts` whenever the prompt changes. This
cost an hour of "fixed it" that had fixed nothing.

**The CLI harness bypasses the cache.** `npx tsx --env-file=.env.local
scripts/ask.ts "question"` runs the agent directly. Good for testing the loop,
useless for reproducing what a user sees. Verify in the browser too.

**Embeddings must never fall back to another provider.** Sections were embedded
with gte-small inside Supabase's `embed` edge function. A query embedded by any
other model lands somewhere unrelated in vector space and search returns
confident nonsense with no error at all. The provider chain is for chat only.

## The open problem: the corpus, not the chatbot

`ingest/outline.py` detects headings by font size, and in NUST's handbooks the
body text matches that size. So sentences became headings and the real chapter
structure was lost. Evidence:

- The UG handbook has zero real "Chapter 3" sections. The only two matches are
  false positives where a cross-reference sentence landed in a heading path.
- Stored heading path, verbatim: `Chapter 6: Academic Provisions & Flexibilities
  > Summer Semester & Summer Camps. > Freezing/Deferment of a semester. Refer to
  Para 9 to Chapter 3, Para31 to > c. Additional Courses` — and the body under it
  is about Additional Courses, not freezing.
- The handbook's only sentence about freezing IS a cross-reference. The procedure
  is not in the corpus.

That is why "how do I freeze a semester" is thin, why the pills read as
gibberish, and why hostel-freeze outranks academic-freeze: heading text feeds the
embedding, so bad headings poison retrieval. **No prompt fixes this.** The fix is
rewriting heading detection and re-ingesting all 137 documents, about 1–2 hours,
mostly waiting on the embed function.

The owner deferred it deliberately on 8 Aug: he is benchmarking this bot against
SEECS's own chatbot over ten questions first. If it loses on those, do the
re-ingest. **Do not start it without asking.**

While it is deferred, treat any specific deadline, fee or office name in an
answer as unverified — the model may be filling a corpus gap.

## Blocked on the owner

Both SQL items are done as of 12 Aug — the `provider` column and the admin
policies are applied to `nftxbjprlwhgivqanbxn`, which holds the 3,485-section
corpus. Two things remain:

1. Vercel env vars. The project is `nustnama` under the team slug
   `ahmad-faizs-projects-7990d88e` (an older `nust-nama` project also exists and
   is dead). Paste every var from `.env.local.example`; values are in
   `.env.local`, including the `INGEST_API_SECRET_KEY` generated on 12 Aug. The
   same secret has to go into n8n's `x-api-secret` header, or the webhook keeps
   500ing — the route fails closed when the key is unset. Redeploy afterwards;
   env changes do not reach an existing build.
2. Nobody has asked a question while signed in yet. Quota, cache write and the
   `chat_messages` insert are the only untested paths.

Watch the project picker in the Supabase SQL Editor. The `provider` column was
first added to `find-my-uni` by mistake, which is why `public.documents` came
back as not existing; it was dropped there again, empty.

## Other state

- **Gupshup is dormant.** `GUPSHUP_ENABLED` in `src/lib/flags.ts` is false: nav
  link, FAQ entry and a middleware redirect on `/chatter*`. Threads work but have
  no moderation — no reporting, no flagging, no takedown. A five-step plan for
  adding it is in the 8 Aug conversation; roughly an evening's work.
- **Gemini 403s from Pakistan** (project denied access, verified 7 Aug). It sits
  last in the chain and fails over harmlessly.
- **Providers disagree about message shape.** Groq's gpt-oss returns a
  `reasoning` field on assistant messages and Mistral 422s on it, so `agent.ts`
  rebuilds each assistant message from role/content/tool_calls before replaying
  it. Do not push the raw message back into the history.
- **Two env vars were misnamed** in `.env.local` until 12 Aug: `GROQ_API_KEY2`
  and `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, where the code reads `GROQ_API_KEY_2`
  and `NEXT_PUBLIC_POSTHOG_KEY`. So the second Groq key never fired and PostHog
  never received an event. Both renamed. `.env.local.example` is the source of
  truth for names.
- **The model ignores formatting instructions** perhaps a third of the time —
  markdown, pasted URLs, `[text](url)`. `AnswerText.tsx` strips them
  deterministically. Prompting alone did not hold.

## Checks

```bash
npx tsx scripts/answer-text.test.ts                       # answer renderer
npx tsx --env-file=.env.local scripts/ask.ts "how many classes can I miss"
npm run build
```

The attendance question is the decisive one: raw search fails on that phrasing,
so if the agent still reformulates it to "attendance requirement" and returns the
75% rule, the loop is doing its job.
