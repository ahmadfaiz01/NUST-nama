-- =============================================
-- MIGRATION: Chatbot conversation log and answer cache
-- Run in: Supabase SQL Editor
-- =============================================

create table if not exists public.chat_messages (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  question   text not null,
  answer     text,
  sources    jsonb,
  tool_calls jsonb,
  created_at timestamptz not null default now()
);

-- Supports the per-user daily quota count, which runs on every question.
create index if not exists chat_messages_user_day_idx
  on public.chat_messages (user_id, created_at desc);

alter table public.chat_messages enable row level security;

-- Students may read their own history and nothing else. Writes go through the
-- service role in the route handler, so no insert policy exists — which means a
-- stolen anon key cannot forge chat history.
drop policy if exists "users read own chat" on public.chat_messages;
create policy "users read own chat" on public.chat_messages
  for select to authenticated using (user_id = auth.uid());

create table if not exists public.answer_cache (
  question_hash text primary key,
  answer        text not null,
  sources       jsonb not null,   -- section ids this answer was built from
  created_at    timestamptz not null default now()
);

-- Used by the 30-day expiry sweep.
create index if not exists answer_cache_created_idx
  on public.answer_cache (created_at);

alter table public.answer_cache enable row level security;
-- No policy at all: the cache is read and written only by the service role.
