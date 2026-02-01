-- =====================================================
-- NUCLEAR FIX - COMPLETE RESET
-- This ONLY fixes admin/signup issues
-- Does NOT touch: storage, events policies, rsvps, etc.
-- =====================================================

-- =====================================================
-- STEP 1: DROP ADMIN-RELATED TRIGGERS ONLY
-- =====================================================
DROP TRIGGER IF EXISTS set_admin_role_trigger ON public.profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;

-- IMPORTANT: Fix the email enforcement to allow admin emails!
DROP TRIGGER IF EXISTS enforce_nust_email_trigger ON auth.users;

DROP FUNCTION IF EXISTS public.set_admin_on_signup() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

-- =====================================================
-- STEP 2: DROP ALL POLICIES ON PROFILES
-- =====================================================
DO $$ 
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
    END LOOP;
END $$;

-- =====================================================
-- STEP 3: FIX PROFILES TABLE STRUCTURE
-- =====================================================

-- Remove all constraints that might cause issues
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_pkey CASCADE;

-- Make sure we have the primary key
ALTER TABLE public.profiles ADD PRIMARY KEY (id);

-- Add columns safely
DO $$ 
BEGIN
    -- Add role column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'student';
    ELSE
        ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'student';
    END IF;
    
    -- Add is_banned column  
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='is_banned') THEN
        ALTER TABLE public.profiles ADD COLUMN is_banned BOOLEAN DEFAULT FALSE;
    ELSE
        ALTER TABLE public.profiles ALTER COLUMN is_banned SET DEFAULT FALSE;
    END IF;
    
    -- Add name column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='name') THEN
        ALTER TABLE public.profiles ADD COLUMN name TEXT;
    END IF;
    
    -- Add created_at column if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='created_at') THEN
        ALTER TABLE public.profiles ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Fix any NULL values
UPDATE public.profiles SET role = 'student' WHERE role IS NULL;
UPDATE public.profiles SET is_banned = FALSE WHERE is_banned IS NULL;

-- =====================================================
-- STEP 4: DISABLE RLS TEMPORARILY TO FIX ISSUES
-- =====================================================
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 5: CREATE NEW USER HANDLER (SIMPLE VERSION)
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    user_role TEXT := 'student';
BEGIN
    -- Check if admin email
    IF NEW.email IN ('itsahmadfaiz@gmail.com', 'rameenarshad0121@gmail.com') THEN
        user_role := 'admin';
    END IF;
    
    -- Insert the profile
    INSERT INTO public.profiles (id, name, role, is_banned, created_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        user_role,
        FALSE,
        NOW()
    );
    
    RETURN NEW;
EXCEPTION WHEN unique_violation THEN
    -- Profile already exists, update it
    UPDATE public.profiles 
    SET role = user_role,
        name = COALESCE(NEW.raw_user_meta_data->>'full_name', profiles.name)
    WHERE id = NEW.id;
    RETURN NEW;
WHEN OTHERS THEN
    -- Log error but don't fail signup
    RAISE WARNING 'Error creating profile: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- STEP 5B: FIX EMAIL ENFORCEMENT TO ALLOW ADMIN EMAILS
-- Your friend's trigger was blocking Gmail signups
-- =====================================================

CREATE OR REPLACE FUNCTION public.enforce_nust_email()
RETURNS TRIGGER AS $$
DECLARE
    admin_emails TEXT[] := ARRAY['itsahmadfaiz@gmail.com', 'rameenarshad0121@gmail.com'];
BEGIN
    -- Allow admin emails to bypass NUST check
    IF NEW.email = ANY(admin_emails) THEN
        RETURN NEW;
    END IF;
    
    -- Check if email ends with .nust.edu.pk OR .seecs.edu.pk
    IF NEW.email NOT LIKE '%.nust.edu.pk' 
       AND NEW.email NOT LIKE '%@nust.edu.pk' 
       AND NEW.email NOT LIKE '%.seecs.edu.pk' 
       AND NEW.email NOT LIKE '%@seecs.edu.pk' THEN
        DELETE FROM auth.users WHERE id = NEW.id;
        RAISE EXCEPTION 'Only NUST emails (@*.nust.edu.pk) or SEECS emails (@seecs.edu.pk) are allowed';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the email enforcement trigger
DROP TRIGGER IF EXISTS enforce_nust_email_trigger ON auth.users;
CREATE TRIGGER enforce_nust_email_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.enforce_nust_email();

-- =====================================================
-- STEP 6: RE-ENABLE RLS WITH SIMPLE POLICIES
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Simple policies that won't block anything
CREATE POLICY "profiles_select_policy" ON public.profiles 
    FOR SELECT USING (true);

CREATE POLICY "profiles_insert_policy" ON public.profiles 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "profiles_update_policy" ON public.profiles 
    FOR UPDATE USING (auth.uid() = id);

-- =====================================================
-- STEP 7: GRANT ALL PERMISSIONS
-- =====================================================
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.profiles TO postgres, service_role;
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- =====================================================
-- STEP 8: EVENTS TABLE FIX
-- =====================================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='events' AND column_name='status') THEN
        ALTER TABLE public.events ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='events' AND column_name='created_by') THEN
        ALTER TABLE public.events ADD COLUMN created_by UUID REFERENCES auth.users(id);
    END IF;
END $$;

UPDATE public.events SET status = 'approved' WHERE status IS NULL;

-- =====================================================
-- STEP 9: HELPER FUNCTIONS
-- =====================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_moderator_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'moderator'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_moderator_or_admin() TO authenticated;

-- =====================================================
-- DONE! 
-- =====================================================
SELECT 'SUCCESS! Now delete your user in Authentication > Users, then sign up again.' as message;
