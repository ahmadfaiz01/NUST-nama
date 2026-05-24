# NUST Document Ingestion Pipeline — Implementation Plan (Plan A)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **This plan is being implemented by a human who is learning.** Tasks marked
> **[YOU]** are written by the repo owner; Claude explains the concept first and
> reviews after. Tasks marked **[CLAUDE]** are plumbing Claude writes and the owner
> reads. Do not let an agent silently take over a **[YOU]** task.

**Goal:** Crawl NUST's websites, split every document into sections, and make those
sections searchable by meaning and by keyword from a terminal.

**Architecture:** A standalone Python package that talks to Supabase over HTTP. It
discovers URLs (sitemap first, link-following as fallback), downloads PDFs and web
pages, splits each along its own headings into section rows, embeds each section
using a model that runs inside Supabase, and exposes hybrid search as a Postgres
function. Nothing here touches the Next.js app.

**Tech Stack:** Python 3.11+, `httpx`, `selectolax`, `trafilatura`, `pymupdf`,
`supabase`, `pytest`. Postgres with `pgvector`. One Supabase Edge Function (Deno).

**Covers spec phases 0–3.** Phases 4–8 (agent loop, API route, `/ask` page, admin,
cache) are Plan B, written after this one works.

## Global Constraints

- Source of truth: `docs/superpowers/specs/2026-08-06-rag-chatbot-design.md`.
- Crawl scope is `nust.edu.pk` and any `*.nust.edu.pk` host. Nothing else, ever.
- `robots.txt` is honoured. Rate limit 1 request/second/host. User-Agent identifies
  the project and includes a contact address.
- Embeddings are `gte-small`, 384 dimensions. The same model must produce both
  section vectors and query vectors, or search silently returns garbage.
- No LLM calls anywhere in this plan. Classification and summarisation are Plan B
  concerns; here everything is heuristics and parsing.
- Secrets live in the repo-root `.env.local`, which is gitignored. Python reads it
  via `python-dotenv`. Never hardcode keys, never commit them.
- Python code lives in `ingest/`. The spec said `scripts/crawl/`; renamed because
  this package parses, embeds and searches as well as crawling.
- Every module is importable without side effects. Entry points go behind
  `if __name__ == "__main__":` so tests can import freely.

---

## File Structure

```
ingest/
  requirements.txt        pinned dependencies
  config.py               [CLAUDE] env loading, constants, Supabase client
  urls.py                 [YOU]    URL normalising and scope checks — pure logic
  fetcher.py              [YOU]    polite HTTP: robots, rate limit, conditional GET
  discover.py             [YOU]    sitemap parsing + breadth-first link crawl
  download.py             [YOU]    fetch files, sha256, upload, upsert documents
  sections.py             [YOU]    heading-tree → section ranges — pure logic
  parse_pdf.py            [YOU]    pymupdf: text + outline → sections
  parse_html.py           [YOU]    trafilatura: page → markdown → sections
  embed.py                [YOU]    call the edge function, backfill vectors
  search.py               [YOU]    CLI: type a question, see matching sections
  tests/
    test_urls.py
    test_sections.py
    test_fetcher.py

supabase/
  migrations/
    20260806_chatbot_schema.sql     [CLAUDE] tables, indexes, pgvector
    20260807_search_sections.sql    [CLAUDE] hybrid search function
  functions/
    embed/index.ts                  [CLAUDE] gte-small embedding endpoint
```

Each file has one job. `urls.py` and `sections.py` are deliberately pure — no
network, no database — because they hold the logic most likely to be wrong, and
pure functions are the only kind that are pleasant to test.

---

## Task 1: Database schema [CLAUDE]

**Files:**
- Create: `supabase/migrations/20260806_chatbot_schema.sql`

**Interfaces:**
- Consumes: nothing
- Produces: tables `documents`, `sections`. Column names used by every later task.

- [ ] **Step 1: Write the migration**

```sql
create extension if not exists vector;

create table if not exists public.documents (
  id              uuid primary key default gen_random_uuid(),
  url             text not null,
  final_url       text,
  storage_path    text,
  sha256          text not null unique,
  source_type     text not null check (source_type in ('pdf','web','markdown')),
  host            text,
  discovered_from text,
  title           text,
  school          text,
  doc_type        text,
  valid_from_year int,
  published_at    date,
  indexed         boolean not null default true,
  needs_ocr       boolean not null default false,
  http_etag       text,
  http_last_modified text,
  first_seen      timestamptz not null default now(),
  last_seen       timestamptz not null default now(),
  last_changed    timestamptz
);

create table if not exists public.sections (
  id           uuid primary key default gen_random_uuid(),
  document_id  uuid not null references public.documents(id) on delete cascade,
  ordinal      int not null,
  heading_path text not null,
  content      text not null,
  embed_text   text not null,
  page_start   int,
  page_end     int,
  embedding    vector(384),
  tsv          tsvector generated always as (to_tsvector('english', content)) stored,
  unique (document_id, ordinal)
);

create index if not exists sections_tsv_idx on public.sections using gin (tsv);
create index if not exists sections_doc_idx on public.sections (document_id);
create index if not exists documents_host_idx on public.documents (host);
create index if not exists documents_indexed_idx on public.documents (indexed);

alter table public.documents enable row level security;
alter table public.sections  enable row level security;

drop policy if exists "documents readable by authenticated" on public.documents;
create policy "documents readable by authenticated" on public.documents
  for select to authenticated using (indexed);

drop policy if exists "sections readable by authenticated" on public.sections;
create policy "sections readable by authenticated" on public.sections
  for select to authenticated using (
    exists (select 1 from public.documents d where d.id = document_id and d.indexed)
  );
```

The vector index is deliberately absent. HNSW works fine on an empty table — the
reason to defer is that maintaining the index slows the bulk insert of ~50,000
embeddings in Task 9. Build it after the backfill, not before.

Writes go through the service role, which bypasses RLS. No insert or update policy
is needed, and not having one means a compromised anon key cannot poison the
corpus.

- [ ] **Step 2: Apply it**

Run: `npx supabase db push`
Expected: migration applies, no error.

- [ ] **Step 3: Verify from psql or the dashboard**

```sql
select column_name, data_type from information_schema.columns
where table_name = 'sections' order by ordinal_position;
```
Expected: `embedding` shows as `USER-DEFINED` (that's how pgvector reports), `tsv`
as `tsvector`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260806_chatbot_schema.sql
git commit -m "feat(db): documents and sections tables for the chatbot corpus"
```

---

## Task 2: Python project scaffolding [CLAUDE]

**Files:**
- Create: `ingest/requirements.txt`, `ingest/config.py`, `ingest/__init__.py`,
  `ingest/tests/__init__.py`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `config.SUPABASE_URL`, `config.SERVICE_KEY`, `config.USER_AGENT`,
  `config.supabase()` returning a `supabase.Client`, `config.CRAWL_ROOT`,
  `config.MAX_PAGES`, `config.MAX_FILES`, `config.REQUEST_DELAY`.

- [ ] **Step 1: Write `ingest/requirements.txt`**

```
httpx==0.28.1
selectolax==0.3.27
trafilatura==2.0.0
pymupdf==1.25.2
supabase==2.11.0
python-dotenv==1.0.1
pytest==8.3.4
```

- [ ] **Step 2: Write `ingest/config.py`**

```python
"""Environment and shared constants. Import-safe: no network calls at import time."""
import os
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client

REPO_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(REPO_ROOT / ".env.local")

SUPABASE_URL = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SERVICE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

CRAWL_ROOT = "https://nust.edu.pk"
ALLOWED_SUFFIX = ".nust.edu.pk"
ALLOWED_APEX = "nust.edu.pk"

USER_AGENT = "NustNamaBot/1.0 (+https://nustnama.vercel.app; student project)"
REQUEST_DELAY = 1.0          # seconds between requests to the same host
REQUEST_TIMEOUT = 30.0

MAX_PAGES = 20_000           # hard stops so a bug cannot run forever
MAX_FILES = 5_000
MAX_TOTAL_BYTES = 5 * 1024**3

STORAGE_BUCKET = "documents"


@lru_cache(maxsize=1)
def supabase() -> Client:
    """Service-role client. Bypasses RLS — never expose this to a browser."""
    return create_client(SUPABASE_URL, SERVICE_KEY)
```

`os.environ[...]` rather than `.get()` is deliberate: a missing key should crash
immediately with a clear name, not produce a confusing 401 twenty minutes into a
crawl.

- [ ] **Step 3: Add Python artefacts to `.gitignore`**

```
# python
__pycache__/
*.pyc
.venv/
ingest/downloads/
```

- [ ] **Step 4: Create the virtualenv and install**

Run (PowerShell, from repo root):
```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r ingest/requirements.txt
```

- [ ] **Step 5: Verify config loads**

Run: `python -c "from ingest.config import supabase; print(supabase() is not None)"`
Expected: `True`

If this raises `KeyError: 'SUPABASE_SERVICE_ROLE_KEY'`, the placeholder in
`.env.local` still hasn't been replaced with the real key from the Supabase
dashboard.

- [ ] **Step 6: Create the storage bucket**

In the Supabase dashboard: Storage → New bucket → name `documents`, **not** public.
Files are served to students from NUST's original URL; this bucket is only a
fallback copy.

- [ ] **Step 7: Commit**

```bash
git add ingest/requirements.txt ingest/config.py ingest/tests/__init__.py .gitignore
git commit -m "chore(ingest): python scaffolding and config"
```

---

## Task 3: URL rules [YOU]

**Concept before you write it.** Two bugs sink crawlers, and both live here.

The first is scope leakage. You follow a link, it points at Facebook, and now
you're crawling the internet. The check must be on the *hostname only* — never
`"nust.edu.pk" in url`, because `https://evil.com/?x=nust.edu.pk` passes that.

The second is duplicate work. `nust.edu.pk/about`, `nust.edu.pk/about/`,
`http://nust.edu.pk/about` and `nust.edu.pk/about#team` are one page. Without
normalising you crawl it four times and get four rows.

**Files:**
- Create: `ingest/urls.py`
- Test: `ingest/tests/test_urls.py`

**Interfaces:**
- Consumes: `config.ALLOWED_SUFFIX`, `config.ALLOWED_APEX`
- Produces:
  - `normalise(url: str) -> str`
  - `in_scope(url: str) -> bool`
  - `is_document(url: str) -> bool`
  - `DOCUMENT_EXTENSIONS: set[str]`

- [ ] **Step 1: Write the failing tests**

```python
# ingest/tests/test_urls.py
from ingest.urls import normalise, in_scope, is_document


def test_normalise_collapses_equivalent_urls():
    variants = [
        "http://nust.edu.pk/about/",
        "https://nust.edu.pk/about",
        "https://NUST.edu.pk/about#team",
        "https://nust.edu.pk/about/#anything",
    ]
    assert len({normalise(u) for u in variants}) == 1


def test_normalise_keeps_query_strings():
    assert normalise("https://nust.edu.pk/news?page=2") != normalise("https://nust.edu.pk/news")


def test_in_scope_accepts_apex_and_subdomains():
    assert in_scope("https://nust.edu.pk/x")
    assert in_scope("https://seecs.nust.edu.pk/x")
    assert in_scope("https://a.b.nust.edu.pk/x")


def test_in_scope_rejects_lookalikes_and_outsiders():
    assert not in_scope("https://evilnust.edu.pk/x")
    assert not in_scope("https://facebook.com/nust")
    assert not in_scope("https://evil.com/?ref=nust.edu.pk")
    assert not in_scope("mailto:someone@nust.edu.pk")


def test_is_document_matches_by_extension():
    assert is_document("https://seecs.nust.edu.pk/handbook.pdf")
    assert is_document("https://seecs.nust.edu.pk/form.PDF?v=2")
    assert is_document("https://seecs.nust.edu.pk/policy.docx")
    assert not is_document("https://seecs.nust.edu.pk/about")
```

- [ ] **Step 2: Run them and watch them fail**

Run: `python -m pytest ingest/tests/test_urls.py -v`
Expected: FAIL, `ModuleNotFoundError: No module named 'ingest.urls'`

- [ ] **Step 3: Write `ingest/urls.py`**

Hints, not the answer — this one is yours to write:

- `urllib.parse.urldefrag` strips `#fragments`.
- `urlparse(url).hostname` is already lowercased and excludes the port. Use it
  rather than `.netloc`.
- Scope check is `host == ALLOWED_APEX or host.endswith(ALLOWED_SUFFIX)`. The
  leading dot in `.nust.edu.pk` is what rejects `evilnust.edu.pk`.
- A `mailto:` URL has no hostname — `hostname` returns `None`. Handle it.
- For normalising: force scheme to `https`, strip a trailing `/` from the path but
  keep `/` for the root, keep the query, drop the fragment.
- `DOCUMENT_EXTENSIONS = {".pdf", ".doc", ".docx"}`. Check the *path's* extension,
  lowercased, so `?v=2` doesn't break it.

- [ ] **Step 4: Run tests until green**

Run: `python -m pytest ingest/tests/test_urls.py -v`
Expected: 5 passed

- [ ] **Step 5: Commit**

```bash
git add ingest/urls.py ingest/tests/test_urls.py
git commit -m "feat(ingest): url normalising and crawl scope rules"
```

---

## Task 4: Polite fetcher [YOU]

**Concept before you write it.** This is the module that decides whether NUST's
sysadmin blocks you. Three responsibilities:

*Rate limiting per host.* One request per second **per hostname**, not globally —
crawling `seecs` shouldn't slow down `smme`. Track the last request time in a dict
keyed by host and sleep the remainder.

*robots.txt.* Python's `urllib.robotparser` handles this. Fetch and cache one
parser per host. If `robots.txt` is missing or unfetchable, the convention is to
allow — but still rate limit.

*Conditional requests.* On a re-crawl, send `If-None-Match` with the stored ETag
or `If-Modified-Since` with the stored date. The server replies `304 Not Modified`
with no body, and you've confirmed a file is unchanged for almost no bandwidth.
This is what makes monthly runs fast.

**Files:**
- Create: `ingest/fetcher.py`
- Test: `ingest/tests/test_fetcher.py`

**Interfaces:**
- Consumes: `config.USER_AGENT`, `config.REQUEST_DELAY`, `config.REQUEST_TIMEOUT`
- Produces:
  - `class Fetcher` with `get(url, etag=None, last_modified=None) -> FetchResult`
    and `allowed(url) -> bool`
  - `@dataclass FetchResult: status: int, body: bytes, headers: dict, final_url: str`
  - `FetchResult.not_modified` property, true when `status == 304`

- [ ] **Step 1: Write the failing test**

Only the rate limiter is tested — it's the part with real logic. The HTTP calls are
exercised for real in Task 5.

```python
# ingest/tests/test_fetcher.py
import time
from ingest.fetcher import Fetcher


def test_rate_limiter_delays_same_host(monkeypatch):
    slept = []
    monkeypatch.setattr(time, "sleep", lambda s: slept.append(s))

    f = Fetcher()
    f._wait("seecs.nust.edu.pk")
    f._wait("seecs.nust.edu.pk")

    assert len(slept) == 1
    assert slept[0] > 0


def test_rate_limiter_does_not_delay_different_hosts(monkeypatch):
    slept = []
    monkeypatch.setattr(time, "sleep", lambda s: slept.append(s))

    f = Fetcher()
    f._wait("seecs.nust.edu.pk")
    f._wait("smme.nust.edu.pk")

    assert slept == []
```

- [ ] **Step 2: Run and watch it fail**

Run: `python -m pytest ingest/tests/test_fetcher.py -v`
Expected: FAIL, no module named `ingest.fetcher`

- [ ] **Step 3: Write `ingest/fetcher.py`**

Hints:

- `_wait(host)` stores `self._last: dict[str, float]`. Compute
  `elapsed = time.monotonic() - self._last.get(host, 0)`, and if
  `elapsed < REQUEST_DELAY`, sleep the difference. Always update `_last` after.
- Note the test monkeypatches `time.sleep`, so import the module as `import time`
  and call `time.sleep(...)`, not `from time import sleep`.
- Use one `httpx.Client` for the object's lifetime — it pools connections. Set
  `follow_redirects=True`, `timeout=REQUEST_TIMEOUT`, and the User-Agent header.
- `allowed(url)` builds `urllib.robotparser.RobotFileParser`, caches per host in a
  dict, and returns `True` when robots.txt can't be fetched.
- In `get()`, add `If-None-Match` / `If-Modified-Since` only when the caller passed
  them. Return the `FetchResult` without raising on 304 or 404 — the caller
  decides.

- [ ] **Step 4: Run tests until green**

Run: `python -m pytest ingest/tests/test_fetcher.py -v`
Expected: 2 passed

- [ ] **Step 5: Smoke-test against a real host**

```python
python -c "from ingest.fetcher import Fetcher; r = Fetcher().get('https://nust.edu.pk'); print(r.status, len(r.body))"
```
Expected: `200` and a body of more than a few thousand bytes.

- [ ] **Step 6: Commit**

```bash
git add ingest/fetcher.py ingest/tests/test_fetcher.py
git commit -m "feat(ingest): polite fetcher with per-host rate limiting and conditional requests"
```

---

## Task 5: Discovery [YOU]

**Concept before you write it.** Two ways to find pages, used in order.

*Sitemaps.* Most sites publish `/sitemap.xml` listing every page. It's faster and
more complete than crawling, and far gentler on the server. Sitemaps often nest —
a sitemap index pointing at more sitemaps — so follow one level down.

*Breadth-first crawl.* Where no sitemap exists, start at the root, extract links,
queue the in-scope ones, repeat. Breadth-first (a `deque`, `popleft`) rather than
depth-first, because it reaches broad useful pages early instead of burrowing into
one branch.

The critical detail: **normalise before checking `seen`.** Forget that, and the
queue grows forever on trailing-slash variants.

**Files:**
- Create: `ingest/discover.py`

**Interfaces:**
- Consumes: `Fetcher`, `urls.normalise`, `urls.in_scope`, `urls.is_document`,
  `config.MAX_PAGES`
- Produces: `discover(root: str = CRAWL_ROOT) -> tuple[set[str], set[str]]`
  returning `(page_urls, document_urls)`

- [ ] **Step 1: Write it**

Structure to follow:

```python
def sitemap_urls(fetcher, host) -> set[str]:
    """Fetch https://{host}/sitemap.xml, follow one level of sitemap indexes."""

def crawl(fetcher, root, seen) -> tuple[set[str], set[str]]:
    """BFS from root. Returns (pages, documents)."""

def discover(root=CRAWL_ROOT) -> tuple[set[str], set[str]]:
    """Sitemap first, then BFS for anything the sitemap missed."""
```

Hints:

- Parse sitemap XML with `xml.etree.ElementTree`. Sitemap tags carry a namespace,
  so match on `tag.endswith('loc')` rather than fighting namespace prefixes.
- Extract links with `selectolax`:
  `HTMLParser(html).css('a[href]')`, then `node.attributes.get('href')`.
- Resolve relative links with `urljoin(current_url, href)` before normalising.
- Split each discovered URL: `is_document(u)` sends it to documents, otherwise it's
  a page to crawl.
- Stop at `MAX_PAGES`. Print progress every 100 pages — a silent crawler is
  indistinguishable from a hung one.
- Skip anything `fetcher.allowed(url)` returns False for.
- New hosts found via links (`seecs.nust.edu.pk` appearing on `nust.edu.pk`) get
  their own sitemap attempt. That's how school sites are discovered without a
  hardcoded list.

- [ ] **Step 2: Run it, limited**

Temporarily set `MAX_PAGES = 200` in `config.py` and run:
```bash
python -m ingest.discover
```
Expected: several hundred URLs, at least two distinct `*.nust.edu.pk` hosts, and
some `.pdf` links.

- [ ] **Step 3: Sanity-check the output**

Every URL must be in scope. If anything outside `nust.edu.pk` appears, Task 3's
`in_scope` is being bypassed somewhere — fix that before continuing, because the
next task starts downloading whatever this produces.

- [ ] **Step 4: Restore `MAX_PAGES` and commit**

```bash
git add ingest/discover.py
git commit -m "feat(ingest): sitemap and breadth-first URL discovery"
```

---

## Task 6: Download and record [YOU]

**Concept before you write it.** `sha256` is a fingerprint computed from a file's
bytes. Identical files produce identical fingerprints. It does two jobs here:
deduplication, because the same handbook is mirrored on several school sites and
should be stored once; and change detection, because next month a different
fingerprint for the same URL means the document was revised.

The `documents.sha256` column is `unique`, so the database enforces this rather
than your code remembering to.

**Files:**
- Create: `ingest/download.py`

**Interfaces:**
- Consumes: `Fetcher`, `config.supabase()`, `config.STORAGE_BUCKET`
- Produces:
  - `store_document(fetcher, url, discovered_from=None) -> dict | None`
  - `run(urls: Iterable[str]) -> None`

- [ ] **Step 1: Write it**

Logic per URL:

1. Look up an existing row by `url`. If found, pass its `http_etag` and
   `http_last_modified` to `fetcher.get()`.
2. On `304`, update `last_seen` only and return — nothing changed.
3. Compute `hashlib.sha256(body).hexdigest()`.
4. If a row with that hash exists under a different URL, this is a mirror. Update
   `last_seen`, don't upload again.
5. Otherwise upload to Storage at `{host}/{sha256[:2]}/{sha256}{ext}` — where `ext`
   comes from the URL path, defaulting to `.html` for web pages — and upsert a
   `documents` row.
6. If the row existed with a *different* hash, set `last_changed = now()`.
7. Derive `source_type` from `Content-Type`: `application/pdf` → `pdf`, anything
   `text/html` → `web`.

Hints:

- Supabase upsert: `supabase().table("documents").upsert(row, on_conflict="sha256").execute()`
- Storage upload: `supabase().storage.from_(STORAGE_BUCKET).upload(path, body, {"content-type": ctype, "upsert": "true"})`
- Wrap each URL in `try/except` and continue. One malformed PDF must not end a
  four-hour crawl.
- Print a running count. You want to see it working.

- [ ] **Step 2: Run it on ten URLs**

```python
python -c "from ingest.discover import discover; from ingest.download import run; _, docs = discover(); run(list(docs)[:10])"
```

- [ ] **Step 3: Verify in Supabase**

```sql
select url, source_type, sha256, indexed from documents limit 10;
```
Expected: ten rows, distinct hashes, files visible in the `documents` bucket.

- [ ] **Step 4: Verify change detection works**

Run the same ten URLs again.
Expected: no new rows, `last_seen` updated. If the count doubles, the `sha256`
lookup is broken — fix it now, because a full crawl would create thousands of
duplicates.

- [ ] **Step 5: Commit**

```bash
git add ingest/download.py
git commit -m "feat(ingest): download files with sha256 dedupe and change detection"
```

---

## Task 7: Section splitting [YOU]

**Concept before you write it.** This is the heart of the design, and the part that
makes citations free.

A PDF's outline is a flat list: `(level, title, page)`. Level 1 is a chapter, level
2 a section under it. To turn that into paths like
`7. Academic Standing > 7.3 Repeating a Course`, keep a stack: on level *n*, trim
the stack to *n-1* entries, then push the current title. The stack joined by `>` is
the path.

A section runs from its own start page to the page before the next entry starts.
The final entry runs to the end of the document.

Keep this pure — in, a list of tuples; out, a list of ranges. No pymupdf, no
database. That's what makes it testable, and it's the logic most likely to be
subtly wrong.

**Files:**
- Create: `ingest/sections.py`
- Test: `ingest/tests/test_sections.py`

**Interfaces:**
- Produces:
  - `@dataclass SectionRange: heading_path: str, page_start: int, page_end: int`
  - `toc_to_ranges(toc: list[tuple[int, str, int]], page_count: int) -> list[SectionRange]`
  - `build_embed_text(heading_path: str, content: str, words: int = 200) -> str`

- [ ] **Step 1: Write the failing tests**

```python
# ingest/tests/test_sections.py
from ingest.sections import toc_to_ranges, build_embed_text


def test_nested_headings_become_paths():
    toc = [
        (1, "7. Academic Standing", 40),
        (2, "7.1 Probation", 40),
        (2, "7.3 Repeating a Course", 44),
        (1, "8. Leave", 50),
    ]
    got = toc_to_ranges(toc, page_count=60)

    assert got[0].heading_path == "7. Academic Standing"
    assert got[1].heading_path == "7. Academic Standing > 7.1 Probation"
    assert got[2].heading_path == "7. Academic Standing > 7.3 Repeating a Course"
    assert got[3].heading_path == "8. Leave"


def test_page_ranges_do_not_overlap_and_cover_the_document():
    toc = [(1, "A", 1), (1, "B", 10), (1, "C", 20)]
    got = toc_to_ranges(toc, page_count=30)

    assert (got[0].page_start, got[0].page_end) == (1, 9)
    assert (got[1].page_start, got[1].page_end) == (10, 19)
    assert (got[2].page_start, got[2].page_end) == (20, 30)


def test_deeper_level_then_shallower_pops_the_stack():
    toc = [(1, "A", 1), (2, "A.1", 2), (3, "A.1.a", 3), (2, "A.2", 4)]
    got = toc_to_ranges(toc, page_count=10)

    assert got[3].heading_path == "A > A.2"


def test_empty_toc_yields_one_whole_document_range():
    got = toc_to_ranges([], page_count=12)

    assert len(got) == 1
    assert (got[0].page_start, got[0].page_end) == (1, 12)


def test_embed_text_is_path_plus_opening_words():
    out = build_embed_text("A > B", "one two three four five", words=3)

    assert out.startswith("A > B")
    assert "three" in out
    assert "four" not in out
```

- [ ] **Step 2: Run and watch them fail**

Run: `python -m pytest ingest/tests/test_sections.py -v`
Expected: FAIL, no module named `ingest.sections`

- [ ] **Step 3: Write `ingest/sections.py`**

Hints:

- Stack handling: `stack = stack[:level - 1]` then `stack.append(title)`. Path is
  `" > ".join(stack)`.
- `page_end` is the next entry's `page - 1`; the last entry's is `page_count`.
- Guard against `page_end < page_start` — malformed outlines put two entries on the
  same page. Clamp to `page_start`.
- Empty TOC returns a single range covering the whole document with a path of the
  document title, filled in by the caller.
- `build_embed_text` joins the path and the first *n* words with a newline.

- [ ] **Step 4: Run until green**

Run: `python -m pytest ingest/tests/test_sections.py -v`
Expected: 5 passed

- [ ] **Step 5: Commit**

```bash
git add ingest/sections.py ingest/tests/test_sections.py
git commit -m "feat(ingest): heading-tree to section range splitting"
```

---

## Task 8: PDF and HTML parsing [YOU]

**Concept before you write it.** Two input formats, one output shape. After this
task nothing downstream knows or cares which a section came from.

PDFs: `pymupdf` gives you `doc.get_toc()` in exactly the `(level, title, page)`
form Task 7 expects, and `page.get_text()` per page. A PDF whose pages return empty
text is a scan — flag `needs_ocr` and skip it rather than storing empty sections.

Web pages: `trafilatura` strips navigation, sidebars and footers, returning
Markdown. Split on `##` heading lines. A page with no headings becomes one section,
which is fine.

**Files:**
- Create: `ingest/parse_pdf.py`, `ingest/parse_html.py`

**Interfaces:**
- Consumes: `sections.toc_to_ranges`, `sections.build_embed_text`,
  `config.supabase()`
- Produces:
  - `parse_pdf.sections_for(document_id: str, body: bytes, title: str) -> list[dict]`
  - `parse_html.sections_for(document_id: str, html: str, url: str, title: str) -> list[dict]`
  - Both return dicts with keys: `document_id, ordinal, heading_path, content,
    embed_text, page_start, page_end` — matching the `sections` table exactly.

- [ ] **Step 1: Write `parse_pdf.py`**

```python
import fitz  # pymupdf imports as fitz

def sections_for(document_id, body, title):
    doc = fitz.open(stream=body, filetype="pdf")
    page_text = [doc[i].get_text() for i in range(doc.page_count)]
    if not any(t.strip() for t in page_text):
        return []          # scanned; caller sets needs_ocr
    ranges = toc_to_ranges(doc.get_toc(), doc.page_count)
    ...
```

Join `page_text[r.page_start - 1 : r.page_end]` for each range. Skip ranges whose
joined text is under ~50 characters — those are title pages and blank dividers.
When the TOC was empty, use `title` as the heading path.

- [ ] **Step 2: Write `parse_html.py`**

```python
import trafilatura

def sections_for(document_id, html, url, title):
    md = trafilatura.extract(html, output_format="markdown", include_links=False)
    if not md:
        return []
    ...
```

Walk the lines. A line starting `#` opens a new section; its text is the heading.
Accumulate body lines until the next heading. Build paths with the same stack idea
as Task 7 — heading level is the count of leading `#`. Pages are `None` for web
sources.

- [ ] **Step 3: Test against a real document**

Pick a PDF already downloaded in Task 6:

```python
python -c "
from ingest.config import supabase
from ingest.parse_pdf import sections_for
d = supabase().table('documents').select('*').eq('source_type','pdf').limit(1).execute().data[0]
body = supabase().storage.from_('documents').download(d['storage_path'])
for s in sections_for(d['id'], body, d['title'] or d['url'])[:10]:
    print(s['heading_path'], '|', len(s['content']), 'chars')
"
```
Expected: heading paths that look like a real table of contents, with sensible
character counts. If every path is identical, the stack logic in Task 7 is wrong.

- [ ] **Step 4: Write the insert loop**

Add `run()` to each module: read documents of that `source_type` with no sections
yet, parse, `insert` in batches of 100. Set `needs_ocr = true` and `indexed = false`
when `sections_for` returns empty for a PDF.

- [ ] **Step 5: Run over everything downloaded so far, then verify**

```sql
select d.source_type, count(distinct d.id) docs, count(s.id) sections
from documents d left join sections s on s.document_id = d.id
group by d.source_type;
```
Expected: sections per document in the tens, not one. One section per document
means the TOC isn't being read.

- [ ] **Step 6: Commit**

```bash
git add ingest/parse_pdf.py ingest/parse_html.py
git commit -m "feat(ingest): parse PDFs and web pages into sections"
```

---

## Task 9: Embeddings [CLAUDE writes the function, YOU write the backfill]

**Concept.** An embedding turns text into 384 numbers positioned so that similar
meanings sit close together. Search embeds the question and finds the nearest
sections. The rule that matters: **the same model must embed both sides.** Mix
models and you get confident nonsense, with no error message.

`gte-small` runs inside Supabase Edge Functions, so there's no third-party key and
no per-call cost.

**Files:**
- Create: `supabase/functions/embed/index.ts` [CLAUDE]
- Create: `ingest/embed.py` [YOU]
- Create: `supabase/migrations/20260807_sections_vector_index.sql` [CLAUDE]

**Interfaces:**
- Produces: `POST /functions/v1/embed` taking `{"texts": string[]}` and returning
  `{"embeddings": number[][]}`; `embed.embed_texts(texts: list[str]) -> list[list[float]]`;
  `embed.backfill() -> None`

- [ ] **Step 1: [CLAUDE] Write the edge function**

```typescript
// supabase/functions/embed/index.ts
const session = new Supabase.ai.Session("gte-small");

Deno.serve(async (req) => {
  const { texts } = await req.json();
  if (!Array.isArray(texts) || texts.length === 0) {
    return new Response(JSON.stringify({ error: "texts must be a non-empty array" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }
  if (texts.length > 100) {
    return new Response(JSON.stringify({ error: "max 100 texts per call" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }
  const embeddings: number[][] = [];
  for (const t of texts) {
    embeddings.push(await session.run(t, { mean_pool: true, normalize: true }) as number[]);
  }
  return new Response(JSON.stringify({ embeddings }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

The session is created once outside the handler so the model loads on cold start
rather than per request.

- [ ] **Step 2: Deploy and test it**

```bash
npx supabase functions deploy embed
```

```bash
curl -s -X POST "$SUPABASE_URL/functions/v1/embed" \
  -H "Authorization: Bearer $SERVICE_KEY" -H "Content-Type: application/json" \
  -d '{"texts":["attendance policy"]}' | head -c 200
```
Expected: a JSON array opening with numbers. Count them — it must be exactly 384.

- [ ] **Step 3: [YOU] Write `ingest/embed.py`**

`embed_texts` posts to the function in batches of 100 and returns the vectors.
`backfill` selects sections where `embedding is null`, embeds their `embed_text`,
and updates in batches. Print progress; this runs over thousands of rows.

Retry on non-200 with a short sleep. Cold starts occasionally time out and one
failure shouldn't lose the batch.

- [ ] **Step 4: Run the backfill and verify**

```sql
select count(*) filter (where embedding is null) as missing,
       count(*) filter (where embedding is not null) as done
from sections;
```
Expected: `missing` is 0.

- [ ] **Step 5: [CLAUDE] Add the vector index, now that rows exist**

```sql
create index if not exists sections_embedding_idx
  on public.sections using hnsw (embedding vector_cosine_ops);
```

Run: `npx supabase db push`

- [ ] **Step 6: Commit**

```bash
git add supabase/functions/embed/index.ts ingest/embed.py supabase/migrations/20260807_sections_vector_index.sql
git commit -m "feat(ingest): gte-small embeddings and vector index"
```

---

## Task 10: Hybrid search function [CLAUDE]

**Files:**
- Create: `supabase/migrations/20260807_search_sections.sql`

**Interfaces:**
- Produces: `search_sections(query_text text, query_embedding vector(384),
  match_count int, filter_school text, filter_doc_type text)` returning
  `(section_id uuid, document_id uuid, heading_path text, content text,
  page_start int, page_end int, url text, title text, published_at date,
  doc_type text, score float)`

- [ ] **Step 1: Write the migration**

```sql
create or replace function public.search_sections(
  query_text      text,
  query_embedding vector(384),
  match_count     int  default 8,
  filter_school   text default null,
  filter_doc_type text default null
)
returns table (
  section_id uuid, document_id uuid, heading_path text, content text,
  page_start int, page_end int, url text, title text,
  published_at date, doc_type text, score double precision
)
language sql stable
as $$
  with kw as (
    select s.id,
           row_number() over (
             order by ts_rank_cd(s.tsv, websearch_to_tsquery('english', query_text)) desc
           ) as rank
    from public.sections s
    join public.documents d on d.id = s.document_id
    where d.indexed
      and s.tsv @@ websearch_to_tsquery('english', query_text)
      and (filter_school   is null or d.school   = filter_school)
      and (filter_doc_type is null or d.doc_type = filter_doc_type)
    order by ts_rank_cd(s.tsv, websearch_to_tsquery('english', query_text)) desc
    limit 50
  ),
  vec as (
    select s.id,
           row_number() over (order by s.embedding <=> query_embedding) as rank
    from public.sections s
    join public.documents d on d.id = s.document_id
    where d.indexed
      and s.embedding is not null
      and (filter_school   is null or d.school   = filter_school)
      and (filter_doc_type is null or d.doc_type = filter_doc_type)
    order by s.embedding <=> query_embedding
    limit 50
  ),
  fused as (
    select coalesce(kw.id, vec.id) as id,
           coalesce(1.0 / (60 + kw.rank),  0.0)
         + coalesce(1.0 / (60 + vec.rank), 0.0) as score
    from kw full outer join vec on kw.id = vec.id
  )
  select s.id, s.document_id, s.heading_path, s.content,
         s.page_start, s.page_end,
         d.url, d.title, d.published_at, d.doc_type,
         f.score
  from fused f
  join public.sections  s on s.id = f.id
  join public.documents d on d.id = s.document_id
  order by f.score desc
  limit match_count;
$$;

grant execute on function public.search_sections to authenticated;
```

This merges the two result lists with reciprocal rank fusion: each list
contributes `1/(60+rank)`. A section appearing in both ranks above one that appears
in either alone. The 60 is the conventional constant — it stops the top result from
dominating everything below it. Fusing on *rank* rather than raw score sidesteps
the fact that keyword scores and cosine distances aren't on comparable scales.

`full outer join` matters: an inner join would drop sections found by only one
method, which is exactly the case hybrid search exists to cover.

- [ ] **Step 2: Apply and smoke-test**

Run: `npx supabase db push`

```sql
select heading_path, round(score::numeric, 4)
from search_sections('attendance', (select embedding from sections where embedding is not null limit 1), 5);
```
Expected: five rows, descending scores. This uses an arbitrary vector, so relevance
will be poor — you're only checking the function executes.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/20260807_search_sections.sql
git commit -m "feat(db): hybrid search over sections with reciprocal rank fusion"
```

---

## Task 11: Search CLI [YOU]

**This is the payoff.** After this task you can ask questions about NUST documents
from a terminal and see which sections answer them. Everything in Plan B is a
wrapper around what you have here.

**Files:**
- Create: `ingest/search.py`

**Interfaces:**
- Consumes: `embed.embed_texts`, `config.supabase()`
- Produces: `search(question: str, k: int = 8) -> list[dict]` and a `__main__` entry
  point.

- [ ] **Step 1: Write it**

```python
def search(question, k=8):
    vector = embed_texts([question])[0]
    resp = supabase().rpc("search_sections", {
        "query_text": question,
        "query_embedding": vector,
        "match_count": k,
    }).execute()
    return resp.data
```

The `__main__` block takes the question from `sys.argv`, prints each result's
heading path, score, source URL, and the first ~300 characters of content.

- [ ] **Step 2: Run real questions**

```bash
python -m ingest.search "how many classes can I miss"
python -m ingest.search "fee due date"
python -m ingest.search "semester freeze"
```

- [ ] **Step 3: Judge the output honestly**

For each question, is the top result a section that genuinely answers it?

- **Good results** — move to Plan B.
- **Right document, wrong section** — splitting is too coarse. Revisit Task 7.
- **Wrong documents entirely** — check `embed_text` actually contains the heading
  path, and that Task 9 embedded `embed_text` rather than `content`.
- **Keyword queries work, meaning-based ones don't** — the embedding half is
  failing. Confirm the edge function returns 384 numbers and that vectors were
  stored, not silently dropped as nulls.

Write down what you find. It's the input to Plan B's tool design.

- [ ] **Step 4: Commit**

```bash
git add ingest/search.py
git commit -m "feat(ingest): search CLI over the document corpus"
```

---

## Definition of done

- [ ] `python -m pytest ingest/tests -v` — all green
- [ ] `documents` holds rows from more than one `*.nust.edu.pk` host
- [ ] `sections` averages more than ten sections per PDF
- [ ] No section has a null embedding
- [ ] Re-running the crawl creates no duplicate documents
- [ ] `python -m ingest.search "how many classes can I miss"` returns a section that
      actually answers it

## Deliberately not in this plan

- No LLM classification. `school`, `doc_type` and `valid_from_year` stay null until
  Plan B; nothing here needs them, and the heuristics are easier to write once you
  can see what the corpus looks like.
- No OCR. Scanned PDFs get `needs_ocr = true` and `indexed = false`.
- No scheduling. You run it by hand. GitHub Actions comes after two clean runs.
- No junk filtering beyond the empty-text check. You need to see the junk before
  you can write rules against it.
