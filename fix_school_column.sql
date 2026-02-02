-- ============================================
-- FIX SCHOOL/FACULTY COLUMN IN PROFILES
-- ============================================
-- This ensures the school selected during signup is saved and displayed

-- 1. Add school column if it doesn't exist (we'll use 'school' to match frontend)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'school'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN school TEXT;
    END IF;
END $$;

-- 2. Copy existing faculty data to school if faculty exists and school is null
UPDATE public.profiles 
SET school = faculty 
WHERE school IS NULL AND faculty IS NOT NULL;

-- 3. Update the handle_new_user function to include school
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
    user_role TEXT := 'student';
    user_school TEXT;
BEGIN
    -- Check if admin email
    IF NEW.email IN ('itsahmadfaiz@gmail.com', 'rameenarshad0121@gmail.com') THEN
        user_role := 'admin';
    END IF;
    
    -- Get school from user metadata
    user_school := NEW.raw_user_meta_data->>'school';
    
    -- Insert the profile
    INSERT INTO public.profiles (id, name, school, role, is_banned, created_at)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        UPPER(COALESCE(user_school, 'NUST')),
        user_role,
        FALSE,
        NOW()
    );
    
    RETURN NEW;
EXCEPTION WHEN unique_violation THEN
    -- Profile already exists, update it
    UPDATE public.profiles 
    SET role = user_role,
        name = COALESCE(NEW.raw_user_meta_data->>'full_name', profiles.name),
        school = COALESCE(UPPER(user_school), profiles.school)
    WHERE id = NEW.id;
    RETURN NEW;
WHEN OTHERS THEN
    -- Log error but don't fail signup
    RAISE WARNING 'Error creating profile: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- 4. Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

NOTIFY pgrst, 'reload config';

-- ============================================
-- VERIFICATION (run to check)
-- ============================================
-- SELECT id, name, school, role FROM public.profiles LIMIT 10;
