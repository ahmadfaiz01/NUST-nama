-- Add sentiment column to checkins table
ALTER TABLE public.checkins 
ADD COLUMN IF NOT EXISTS sentiment TEXT CHECK (sentiment IN ('lit', 'vibing', 'chill', 'meh', 'dead'));

-- Reload cache
NOTIFY pgrst, 'reload config';
