-- =============================================
-- MIGRATION: Chatbot corpus schema (documents + sections)
-- Purpose: Store crawled NUST documents and their heading-split sections
-- Note: the vector index is deferred until after the Task 9 backfill —
--       maintaining HNSW during a ~50,000-row bulk insert is slow.
-- =============================================

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

-- Writes go through the service role, which bypasses RLS. No insert/update
-- policy exists on purpose: a compromised anon key cannot poison the corpus.

drop policy if exists "documents readable by authenticated" on public.documents;
create policy "documents readable by authenticated" on public.documents
  for select to authenticated using (indexed);

drop policy if exists "sections readable by authenticated" on public.sections;
create policy "sections readable by authenticated" on public.sections
  for select to authenticated using (
    exists (select 1 from public.documents d where d.id = document_id and d.indexed)
  );
