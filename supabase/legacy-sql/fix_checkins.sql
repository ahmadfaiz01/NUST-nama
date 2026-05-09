-- Create Checkins Table
CREATE TABLE IF NOT EXISTS public.checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;

-- 1. View Policies
DROP POLICY IF EXISTS "Public can view checkins" ON public.checkins;
CREATE POLICY "Public can view checkins" ON public.checkins FOR SELECT USING (true);

-- 2. Insert Policy (Authenticated users can check in themselves)
DROP POLICY IF EXISTS "Users can check in themselves" ON public.checkins;
CREATE POLICY "Users can check in themselves" ON public.checkins FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Delete Policy (Users can delete their own check-in - optional for now)
DROP POLICY IF EXISTS "Users can delete own checkin" ON public.checkins;
CREATE POLICY "Users can delete own checkin" ON public.checkins FOR DELETE USING (auth.uid() = user_id);

-- Reload Schema Cache
NOTIFY pgrst, 'reload config';
