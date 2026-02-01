-- =====================================================
-- Admin Dashboard COMPLETE Migration for "What's Up NUST"
-- Run this migration in your Supabase SQL Editor
-- This includes: Role management, Topic Requests RLS, Admin access
-- =====================================================

-- =====================================================
-- PART 1: ROLE SETUP (if not already done)
-- =====================================================

-- 1. Create user role type if not exists
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'admin', 'moderator');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Add role column to profiles (if not exists)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' 
CHECK (role IN ('student', 'admin', 'moderator'));

-- 3. Add is_banned column to profiles (if not exists)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;

-- =====================================================
-- PART 2: TOPIC REQUESTS & THREADS RLS (Admin Access)
-- =====================================================

-- Drop existing policies first
DROP POLICY IF EXISTS "Users can request topics" ON public.topic_requests;
DROP POLICY IF EXISTS "Users view own requests" ON public.topic_requests;
DROP POLICY IF EXISTS "Admins can view all requests" ON public.topic_requests;
DROP POLICY IF EXISTS "Admins can update requests" ON public.topic_requests;

DROP POLICY IF EXISTS "Public can view threads" ON public.threads;
DROP POLICY IF EXISTS "Admins can manage threads" ON public.threads;
DROP POLICY IF EXISTS "Admins can insert threads" ON public.threads;
DROP POLICY IF EXISTS "Admins can update threads" ON public.threads;
DROP POLICY IF EXISTS "Admins can delete threads" ON public.threads;

-- Enable RLS on tables
ALTER TABLE public.topic_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;

-- TOPIC REQUESTS POLICIES

-- Users can insert their own topic requests
CREATE POLICY "Users can request topics" 
ON public.topic_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can view their own requests
CREATE POLICY "Users view own requests" 
ON public.topic_requests 
FOR SELECT 
USING (
    auth.uid() = user_id
    OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'moderator')
    )
);

-- Admins/Moderators can update topic requests (approve/reject)
CREATE POLICY "Admins can update requests" 
ON public.topic_requests 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'moderator')
    )
);

-- THREADS POLICIES

-- Public can view active threads
CREATE POLICY "Public can view active threads" 
ON public.threads 
FOR SELECT 
USING (
    is_active = true
    OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'moderator')
    )
);

-- Admins can insert new threads
CREATE POLICY "Admins can insert threads" 
ON public.threads 
FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'moderator')
    )
);

-- Admins can update threads
CREATE POLICY "Admins can update threads" 
ON public.threads 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('admin', 'moderator')
    )
);

-- Admins can delete threads
CREATE POLICY "Admins can delete threads" 
ON public.threads 
FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- =====================================================
-- PART 3: HELPER FUNCTIONS
-- =====================================================

-- Function to check if current user is admin
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

-- Function to check if current user is moderator or admin
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

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_moderator_or_admin() TO authenticated;

-- =====================================================
-- PART 4: INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_topic_requests_status ON public.topic_requests(status);
CREATE INDEX IF NOT EXISTS idx_topic_requests_user_id ON public.topic_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_threads_is_active ON public.threads(is_active);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_banned ON public.profiles(is_banned);

-- =====================================================
-- PART 5: ADMIN STATS VIEW (Updated)
-- =====================================================

DROP VIEW IF EXISTS public.admin_stats;
CREATE OR REPLACE VIEW public.admin_stats AS
SELECT 
    (SELECT COUNT(*) FROM public.profiles) AS total_users,
    (SELECT COUNT(*) FROM public.profiles WHERE is_banned = true) AS banned_users,
    (SELECT COUNT(*) FROM public.events WHERE status = 'pending') AS pending_events,
    (SELECT COUNT(*) FROM public.events WHERE status = 'approved') AS approved_events,
    (SELECT COUNT(*) FROM public.events WHERE status = 'rejected') AS rejected_events,
    (SELECT COUNT(*) FROM public.events) AS total_events,
    (SELECT COUNT(*) FROM public.rsvps) AS total_rsvps,
    (SELECT COUNT(*) FROM public.checkins) AS total_checkins,
    (SELECT COUNT(*) FROM public.topic_requests WHERE status = 'pending') AS pending_topic_requests,
    (SELECT COUNT(*) FROM public.threads WHERE is_active = true) AS active_threads,
    (SELECT COUNT(*) FROM public.messages) AS total_messages;

-- =====================================================
-- IMPORTANT: SET YOUR FIRST ADMIN!
-- After running this migration, run:
-- 
-- UPDATE public.profiles 
-- SET role = 'admin' 
-- WHERE id = 'YOUR-USER-ID-HERE';
--
-- You can find your user ID in the Supabase Auth dashboard
-- or by checking the profiles table.
-- =====================================================

-- Quick way to find your user ID (run this separately):
-- SELECT id, name, role FROM public.profiles ORDER BY created_at ASC LIMIT 10;

-- Notify Supabase to reload config
NOTIFY pgrst, 'reload config';
