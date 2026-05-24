-- =============================================
-- MIGRATION: Hybrid search over sections
-- Purpose: Merge keyword (tsvector) and vector (pgvector) hits with
--          reciprocal rank fusion — each list contributes 1/(60+rank).
--          Fusing on rank, not raw score, avoids comparing ts_rank_cd
--          against cosine distance, which are on incomparable scales.
--          full outer join is required: an inner join would drop sections
--          found by only one method, which is the whole point of hybrid.
-- =============================================

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
    -- Required: row_number() is computed before LIMIT, so without this ORDER BY
    -- the LIMIT would take an arbitrary 50 rows rather than ranks 1-50.
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
