# NUST Nama — Document Chatbot Design

Date: 2026-08-06
Status: approved design, not yet implemented

## Goal

A chat feature that answers questions from NUST's own published documents, with a
citation on every answer, plus live questions about events already in the app's
database.

The failure this exists to prevent: a student asks ChatGPT about NUST's attendance
rule and gets a confident invented number. The bot must be holding the actual
document when it answers.

## Users

Signed-in NUST students only. The app is already Google-OAuth gated to
`@*.nust.edu.pk`, enforced in `src/app/auth/callback/route.ts` and again by the
`handle_new_user` trigger. The chatbot sits behind that same wall.

This means the audience is people already admitted. Admissions documents stay in
scope (transfers, second majors, program eligibility) but with lower expected
traffic than a public bot would see.

## What it answers

| Bucket | Example | Source |
|---|---|---|
| Academic policy | "How many classes can I miss?" | Regulations handbooks |
| Money and deadlines | "Fee due date", "NEED scholarship criteria" | Fee schedules, notices |
| Admissions | "Eligibility for a second major" | Prospectus, admission pages |
| Campus operations | "Hostel rules", "how do I get a transcript" | Scattered PDFs and web pages |
| Forms | "How do I freeze a semester?" | Form PDFs, linked in the answer |
| Live events | "Anything on this weekend?" | Existing `events` / `rsvps` tables |

## Locked decisions

| Decision | Choice | Consequence |
|---|---|---|
| Access | Signed-in NUST students | Small abuse surface, per-user quota is enough |
| Quota | ~30 questions/user/day | One `count(*)`, no Redis |
| Answer style | Citation always visible | Must track document, section, page, date |
| Language | English-first, tolerate Roman Urdu | Cheap search stays viable |
| Document approval | Auto-approve, blacklist after | No manual gate, so staleness guards must be automatic |
| Acquisition | Full crawler over `*.nust.edu.pk` | Expect junk; classifier filters it |
| Web pages | Included, not just PDFs | Needed for campus-ops answers |
| Placement | `/ask` page plus a floating bubble | One component, two shells |
| Framework | No LangChain | Agent loop written directly against Groq |

## Architecture

Two halves. Ingestion runs monthly and offline. Retrieval runs per question.

### Half 1 — Ingestion

```
nust.edu.pk + all *.nust.edu.pk school sites
        |
        v
  discover        sitemap.xml first, link-following as fallback
        |         robots.txt honoured, 1 req/sec/host, identifying User-Agent
        v
  download        PDFs, Word docs, HTML pages
        |         sha256 fingerprint per file
        v
  parse           PDF  -> pymupdf   -> text + outline
        |         HTML -> trafilatura -> clean Markdown
        v
  split           into sections along the document's own headings
        |
        v
  classify        one Groq call per document:
        |         school, doc_type, title, valid_from_year
        v
  filter          junk marked indexed=false, never deleted
        |
        v
  embed           section summary -> vector(384) -> pgvector
```

A 200-page handbook becomes ~150 section rows, each keeping its heading path.
That path is the citation, obtained for free.

PDFs and web pages converge into the same `sections` table. Nothing downstream
knows which format a section came from.

### Half 2 — Retrieval

An agent loop with four tools. The model chooses what to call.

```
question
   |
   v
agent  --->  search_sections(query, school?, doc_type?, year?)
   |    --->  read_section(id)
   |    --->  list_structure(doc_id)
   |    --->  search_events(...) / get_my_rsvps()
   |    --->  find_forms(topic)
   v
answer + citation + any forms needed
```

Loop caps at 4 tool calls. Answer streams to the client.

## Data model

```sql
create extension if not exists vector;

documents
  id              uuid primary key
  url             text not null          -- original NUST URL, shown to students
  final_url       text                   -- after redirects
  storage_path    text                   -- our fallback copy
  sha256          text not null unique   -- dedupe + change detection
  source_type     text                   -- 'pdf' | 'web' | 'markdown'
  host            text
  discovered_from text
  title           text                   -- AI-assigned
  school          text                   -- AI-assigned, null = NUST-wide
  doc_type        text                   -- policy|fee|prospectus|form|notice|other
  valid_from_year int
  published_at    date
  indexed         boolean default true   -- false = junk or blacklisted
  needs_ocr       boolean default false
  first_seen      timestamptz
  last_seen       timestamptz
  last_changed    timestamptz

sections
  id           uuid primary key
  document_id  uuid references documents(id) on delete cascade
  heading_path text     -- "SEECS Handbook > 7. Academic Standing > 7.3 Repeating a Course"
  content      text     -- full section text, read verbatim by the agent
  summary      text     -- 2 sentences, written once at ingest, this is what we embed
  page_start   int
  page_end     int
  embedding    vector(384)
  tsv          tsvector generated always as (to_tsvector('english', content)) stored

chat_messages
  id         uuid primary key
  user_id    uuid references profiles(id)
  question   text
  answer     text
  sources    jsonb     -- section ids + paths used
  tool_calls jsonb     -- for debugging
  created_at timestamptz default now()

answer_cache
  question_hash text primary key   -- normalised question
  answer        text
  sources       jsonb              -- section ids this answer was built from
  created_at    timestamptz
```

Cache invalidation: a cached answer is only valid while the sections it was built
from are unchanged. When ingestion updates or blacklists a section, delete every
`answer_cache` row whose `sources` contains that section id. Plus a hard 30-day
expiry as a backstop. Without this, the cache would happily serve last semester's
fee deadline forever — which is the exact failure the staleness rules exist to
prevent.

Indexes: HNSW on `sections.embedding`, GIN on `sections.tsv`, btree on
`chat_messages(user_id, created_at)` for the quota count.

### Search: embed small, read big

We embed `summary`, not `content`. Search matches the small thing; the agent then
reads the entire section. Chunk boundaries therefore never cut an answer in half.

Hybrid search runs vector similarity and keyword search together and merges the
scores. Both are needed:

- Vector finds by meaning — "can I redo a course" matches "Repeating a Course".
- Keyword finds exact strings — `AC-7`, `CGPA`, `BSCS-2026`. Embeddings are poor
  at identifiers.

Postgres does both natively, so this costs nothing extra.

Embeddings come from `gte-small`, built into Supabase Edge Functions. Free, 384
dimensions, no new vendor. Swappable for OpenAI's small embedding model later
without re-architecting.

## Staleness protection

There is no human approval gate, so these run automatically:

- Every answer shows the source document's publication date.
- A money or deadline question whose best source predates the current academic
  year gets an explicit warning rather than a flat answer.
- When two documents conflict, the newest wins.
- Monthly re-crawl compares `sha256`; a changed file re-runs classification and is
  flagged as recently updated.
- Admin page lists recently indexed documents with one-click blacklist.

## Forms

Procedural questions must return the paperwork, not just the rule.

`doc_type = 'form'` is first-class. The `find_forms(topic)` tool runs alongside the
policy lookup on procedural questions. Answers carry a "You'll need" block with the
form name and a link to **NUST's original URL**, not our copy — students should get
the file from the source, and NUST may replace it. Our copy is the fallback when
the link rots, which the monthly crawl detects.

Example answer shape:

```
You can freeze one semester after your first year, with HoD approval.
Maximum two across your degree.

Source: SEECS Policy Handbook > 6. Leave & Freezing > 6.2 Semester Freeze
        (p.44, published Aug 2025)

You'll need:
  Semester Freeze Request (AC-7)  [download from NUST]
  Submit to your school coordinator.
```

## Latency budget

| Step | Target |
|---|---|
| Embed question | 50ms |
| Hybrid search | 30ms |
| Groq tool decision | 400ms |
| Read section | 20ms |
| Groq answer (first token) | ~1s |
| **First word visible** | **~1.5s** |

Each extra tool call adds roughly a second; worst case four calls is ~4s. Event
questions skip embedding and land under a second.

Perceived latency is managed by streaming the answer and showing tool status
("Searching SEECS handbook…"). `answer_cache` serves repeated questions instantly,
which matters during fee weeks when hundreds of students ask the same thing.

## App surface

- `/ask` — full page, nav item beside Events and Gupshup.
- Floating bubble — same React component in a compact shell, with a "see full
  answer" link to `/ask`.
- `/api/ask` — streaming route, runs the agent loop, enforces the quota.
- `/admin/documents` — recently indexed feed, blacklist toggle, re-run classify.

## Non-goals for v1

- No follow-up memory. Each question stands alone.
- No OCR. Scanned PDFs are flagged `needs_ocr` and skipped.
- No automatic linking of "submit Form AC-7" in body text to the AC-7 PDF.
  `find_forms` covers most of this for far less work.
- No public access. Auth wall stays.

## Build order

Each phase runs and produces something visible on its own.

| # | Phase | Output |
|---|---|---|
| 0 | Tables + `pgvector` | Empty schema |
| 1 | Crawler: discover and download | A folder of PDFs |
| 2 | Parse and split into sections | Readable rows in Supabase |
| 3 | Embeddings + hybrid search | CLI: type a question, see matching sections |
| 4 | Agent loop with tools | Working chatbot in the terminal |
| 5 | `/api/ask` with streaming | Answers over HTTP |
| 6 | `/ask` page + bubble | Students can use it |
| 7 | `/admin/documents` | Control over the corpus |
| 8 | Cache + quota | Cheap and safe |

## Working agreement

The user writes the parts worth learning: crawler loop, section splitter, hybrid
search query, agent loop. Claude explains the concept and production pitfalls
first, reviews after.

Claude writes the plumbing: SQL schema, config, boilerplate.

## Open questions

- Where does the crawler run on a schedule — GitHub Action, or manually? Deferred
  until after phase 1 works locally.
- Groq model choice for the agent loop versus the classifier. The classifier can
  use a smaller, cheaper model. Decide when measuring phase 3 output quality.
