-- Ensure RSVPs table exists
CREATE TABLE IF NOT EXISTS public.rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('going', 'interested')),
  guests_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- 1. View Policies
DROP POLICY IF EXISTS "Public can view rsvps" ON public.rsvps;
CREATE POLICY "Public can view rsvps" ON public.rsvps FOR SELECT USING (true);

-- 2. Insert Policy (Authenticated users can rsvp for themselves)
DROP POLICY IF EXISTS "Users can rsvp for themselves" ON public.rsvps;
CREATE POLICY "Users can rsvp for themselves" ON public.rsvps FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Delete Policy (Users can un-rsvp themselves)
DROP POLICY IF EXISTS "Users can un-rsvp themselves" ON public.rsvps;
CREATE POLICY "Users can un-rsvp themselves" ON public.rsvps FOR DELETE USING (auth.uid() = user_id);

-- 4. Update Policy
DROP POLICY IF EXISTS "Users can update their rsvp" ON public.rsvps;
CREATE POLICY "Users can update their rsvp" ON public.rsvps FOR UPDATE USING (auth.uid() = user_id);
