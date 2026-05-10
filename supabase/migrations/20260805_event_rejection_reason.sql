-- The admin reject modal has always collected a reason, but nothing stored it.
alter table public.events
  add column if not exists rejection_reason text;
