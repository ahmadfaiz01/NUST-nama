-- =====================================================
-- COMPLETE DATABASE SETUP - RUN ONCE ONLY
-- This fixes everything and sets up admins
-- =====================================================

-- =====================================================
-- PART 1: CLEAN UP OLD TRIGGERS THAT MIGHT BE CAUSING ISSUES
-- =====================================================
DROP TRIGGER IF EXISTS set_admin_role_trigger ON public.profiles;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.set_admin_on_signup() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- =====================================================
-- PART 2: FIX PROFILES TABLE
-- =====================================================

-- Drop problematic constraints
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'student';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'is_banned') THEN
        ALTER TABLE public.profiles ADD COLUMN is_banned BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Set default for any NULL roles
UPDATE public.profiles SET role = 'student' WHERE role IS NULL;

-- =====================================================
-- PART 3: CREATE THE PROFILE CREATION TRIGGER (on auth.users)
-- This creates a profile when someone signs up
-- =====================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    admin_emails TEXT[] := ARRAY['itsahmadfaiz@gmail.com', 'rameenarshad0121@gmail.com'];
    user_role TEXT := 'student';
BEGIN
    -- Check if this is an admin email
    IF NEW.email = ANY(admin_emails) THEN
        user_role := 'admin';
    END IF;
    
    -- Insert profile for new user
    INSERT INTO public.profiles (id, name, role, is_banned, created_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        user_role,
        FALSE,
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        name = COALESCE(EXCLUDED.name, public.profiles.name),
        role = CASE 
            WHEN NEW.email = ANY(admin_emails) THEN 'admin'
            ELSE COALESCE(public.profiles.role, 'student')
        END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users (this runs when someone signs up)
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- PART 4: FIX RLS POLICIES FOR PROFILES
-- =====================================================

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON public.profiles;

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create clean policies
CREATE POLICY "Anyone can view profiles" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- This allows the trigger to insert profiles
CREATE POLICY "Service role can insert profiles" 
ON public.profiles FOR INSERT 
WITH CHECK (true);

-- =====================================================
-- PART 5: EVENTS TABLE FIX
-- =====================================================

-- Add columns if they don't exist
ALTER TABLE public.events DROP CONSTRAINT IF EXISTS events_status_check;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'status') THEN
        ALTER TABLE public.events ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'created_by') THEN
        ALTER TABLE public.events ADD COLUMN created_by UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Update existing events to approved
UPDATE public.events SET status = 'approved' WHERE status IS NULL;

-- =====================================================
-- PART 6: HELPER FUNCTIONS
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

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_moderator_or_admin() TO authenticated;

-- =====================================================
-- PART 7: INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_is_banned ON public.profiles(is_banned);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);

-- =====================================================
-- PART 8: PERMISSIONS
-- =====================================================
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;

-- =====================================================
-- DONE!
-- =====================================================
NOTIFY pgrst, 'reload config';

-- To verify after signup, run:
-- SELECT p.id, p.name, p.role, u.email 
-- FROM public.profiles p 
-- JOIN auth.users u ON p.id = u.id;
