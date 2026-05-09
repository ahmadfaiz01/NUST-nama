-- =====================================================
-- Admin Dashboard Migration for "What's Up NUST"
-- Run this migration in your Supabase SQL Editor
-- =====================================================

-- 1. Create status enum for events
CREATE TYPE event_status AS ENUM ('pending', 'approved', 'rejected');

-- 2. Add status column to events table (default to 'pending' for new events)
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS status event_status DEFAULT 'pending';

-- 3. Add created_by column to events to track who posted
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- 4. Update existing events to 'approved' (grandfathered in)
UPDATE public.events 
SET status = 'approved' 
WHERE status IS NULL OR status = 'pending';

-- 5. Add banned column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;

-- 6. Create admin stats view
CREATE OR REPLACE VIEW public.admin_stats AS
SELECT 
    (SELECT COUNT(*) FROM public.profiles) AS total_users,
    (SELECT COUNT(*) FROM public.profiles WHERE is_banned = true) AS banned_users,
    (SELECT COUNT(*) FROM public.events WHERE status = 'pending') AS pending_events,
    (SELECT COUNT(*) FROM public.events WHERE status = 'approved') AS approved_events,
    (SELECT COUNT(*) FROM public.events WHERE status = 'rejected') AS rejected_events,
    (SELECT COUNT(*) FROM public.events) AS total_events,
    (SELECT COUNT(*) FROM public.rsvps) AS total_rsvps,
    (SELECT COUNT(*) FROM public.checkins) AS total_checkins;

-- 7. Update RLS Policies for events

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Events are viewable by everyone" ON public.events;
DROP POLICY IF EXISTS "Approved events are viewable by everyone" ON public.events;
DROP POLICY IF EXISTS "Users can insert their own events" ON public.events;
DROP POLICY IF EXISTS "Users can update their own events" ON public.events;
DROP POLICY IF EXISTS "Admins can do anything with events" ON public.events;

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policy: Public can only see approved events
CREATE POLICY "Approved events are viewable by everyone" 
ON public.events 
FOR SELECT 
USING (
    status = 'approved' 
    OR created_by = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'moderator')
    )
);

-- Policy: Authenticated users can insert events
CREATE POLICY "Users can insert their own events" 
ON public.events 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- Policy: Users can update their own events (only certain fields)
CREATE POLICY "Users can update their own events" 
ON public.events 
FOR UPDATE 
USING (
    created_by = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'moderator')
    )
);

-- Policy: Only admins can delete events
CREATE POLICY "Admins can delete events" 
ON public.events 
FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- 8. Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create function to check if user is moderator or admin
CREATE OR REPLACE FUNCTION public.is_moderator_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'moderator')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_moderator_or_admin() TO authenticated;

-- 11. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON public.events(created_by);

-- =====================================================
-- IMPORTANT: After running this migration, you need to 
-- manually set at least one user as admin by running:
-- UPDATE public.profiles SET role = 'admin' WHERE id = 'your-user-id';
-- =====================================================
