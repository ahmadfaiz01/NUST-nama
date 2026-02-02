-- 1. Create the detailed Role Enum if it doesn't exist
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 2. Add the role column to Profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role public.app_role DEFAULT 'user';

-- 3. FUNCTION: Check if user is admin (Helper for RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. UPDATE YOUR ADMINS
-- ⚠️ REPLACE THESE EMAILS with your actual NUST emails!
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (
    SELECT id FROM auth.users WHERE email IN (
        'your.email.1@nust.edu.pk',
        'your.email.2@nust.edu.pk'
    )
);

-- 5. SECURE THE THREADS TABLE (Update the previous policy)
-- First, drop the old temporary policy if it exists
DROP POLICY IF EXISTS "Admins can manage threads" ON public.threads;

-- Create the REAL policy using the new role
CREATE POLICY "Admins can manage threads" 
ON public.threads 
FOR ALL 
USING (public.is_admin());

-- 6. SECURE TOPIC REQUESTS (Admins can update status)
CREATE POLICY "Admins can manage requests"
ON public.topic_requests
FOR UPDATE
USING (public.is_admin());
