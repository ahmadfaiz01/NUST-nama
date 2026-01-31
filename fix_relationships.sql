-- Fix the relationship between Events and Profiles
-- This allows the query: .select('*, profiles:created_by(...)') to work

-- 1. Drop existing FK if it points to auth.users (optional, but cleaner for the join)
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_created_by_fkey;

-- 2. Create Explicit FK to public.profiles
-- This tells PostgREST: "created_by" points to "profiles.id"
ALTER TABLE public.events
ADD CONSTRAINT events_created_by_profile_fkey
FOREIGN KEY (created_by)
REFERENCES public.profiles (id)
ON DELETE CASCADE;

-- 3. Reload cache
NOTIFY pgrst, 'reload config';
