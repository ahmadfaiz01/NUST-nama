-- =====================================================
-- ADMIN SETUP for "What's Up NUST"
-- Run this in your Supabase SQL Editor
-- This sets up Rameen and Ahmad as the only admins
-- =====================================================

-- =====================================================
-- STEP 1: Make sure the role column exists
-- =====================================================
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student' 
CHECK (role IN ('student', 'admin', 'moderator'));

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;

-- =====================================================
-- STEP 2: Create a trigger to auto-set admin role for specific emails
-- This runs whenever a new user signs up
-- =====================================================

-- First, drop if exists to avoid conflicts
DROP FUNCTION IF EXISTS public.set_admin_on_signup() CASCADE;

-- Create the function
CREATE OR REPLACE FUNCTION public.set_admin_on_signup()
RETURNS TRIGGER AS $$
DECLARE
    admin_emails TEXT[] := ARRAY['itsahmadfaiz@gmail.com', 'rameenarshad0121@gmail.com'];
    user_email TEXT;
BEGIN
    -- Get the email from auth.users
    SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;
    
    -- If this email is in the admin list, set role to admin
    IF user_email = ANY(admin_emails) THEN
        NEW.role := 'admin';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger on profiles insert
DROP TRIGGER IF EXISTS set_admin_role_trigger ON public.profiles;
CREATE TRIGGER set_admin_role_trigger
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_admin_on_signup();

-- =====================================================
-- STEP 3: If users already exist, update them to admin
-- (Run this after you've signed up)
-- =====================================================

-- Update existing users to admin if they match the emails
UPDATE public.profiles 
SET role = 'admin' 
WHERE id IN (
    SELECT id FROM auth.users 
    WHERE email IN ('itsahmadfaiz@gmail.com', 'rameenarshad0121@gmail.com')
);

-- =====================================================
-- STEP 4: Create helper function to check admin status
-- =====================================================

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

-- Grant permissions
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_moderator_or_admin() TO authenticated;

-- =====================================================
-- STEP 5: Create indexes for performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- =====================================================
-- STEP 6: Make sure events have proper columns
-- =====================================================
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' 
CHECK (status IN ('pending', 'approved', 'rejected'));

ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Update existing events to approved
UPDATE public.events SET status = 'approved' WHERE status IS NULL;

-- =====================================================
-- DONE! Now sign up with your emails and you'll be admins!
-- =====================================================

-- To verify after signup, run:
-- SELECT id, name, role FROM public.profiles WHERE role = 'admin';

NOTIFY pgrst, 'reload config';
