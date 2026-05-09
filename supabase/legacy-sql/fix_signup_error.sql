-- =====================================================
-- FIX: Database error saving new user
-- Run this in Supabase SQL Editor to fix signup issues
-- =====================================================

-- Step 1: Drop the problematic trigger temporarily
DROP TRIGGER IF EXISTS set_admin_role_trigger ON public.profiles;
DROP FUNCTION IF EXISTS public.set_admin_on_signup() CASCADE;

-- Step 2: Make sure profiles table has correct columns without conflicting constraints
-- First, drop any existing check constraints on role
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add role column if it doesn't exist (without strict CHECK for now)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'role'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'student';
    END IF;
END $$;

-- Update any NULL roles to 'student'
UPDATE public.profiles SET role = 'student' WHERE role IS NULL;

-- Add is_banned column if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT FALSE;

-- Step 3: Create a SAFER trigger that won't break signups
CREATE OR REPLACE FUNCTION public.set_admin_on_signup()
RETURNS TRIGGER AS $$
DECLARE
    admin_emails TEXT[] := ARRAY['itsahmadfaiz@gmail.com', 'rameenarshad0121@gmail.com'];
    user_email TEXT;
BEGIN
    -- Safely try to get email, default to student if anything fails
    BEGIN
        SELECT email INTO user_email FROM auth.users WHERE id = NEW.id;
        
        IF user_email IS NOT NULL AND user_email = ANY(admin_emails) THEN
            NEW.role := 'admin';
        ELSE
            -- Ensure role has a default value
            IF NEW.role IS NULL THEN
                NEW.role := 'student';
            END IF;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        -- If anything fails, just set to student and continue
        IF NEW.role IS NULL THEN
            NEW.role := 'student';
        END IF;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER set_admin_role_trigger
    BEFORE INSERT ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.set_admin_on_signup();

-- Step 4: Make sure RLS allows inserts
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable" ON public.profiles;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own profile (CRITICAL for signup!)
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Allow users to view profiles
CREATE POLICY "Public profiles are viewable" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Step 5: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

NOTIFY pgrst, 'reload config';

-- =====================================================
-- DONE! Now try signing up again.
-- After signup, run this to verify you're admin:
-- SELECT id, name, role, email FROM public.profiles p 
-- JOIN auth.users u ON p.id = u.id;
-- =====================================================
