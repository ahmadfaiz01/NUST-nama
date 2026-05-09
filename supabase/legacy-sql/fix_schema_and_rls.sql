-- 1. Fix 'profiles' table (missing 'updated_at')
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Fix 'events' table (missing columns found in code)
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS poster_url TEXT;
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS category TEXT;

-- 3. Fix Events RLS Policies
-- Reset policies to be sure
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
CREATE POLICY "Authenticated users can create events" 
ON public.events 
FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own events" ON public.events;
CREATE POLICY "Users can update own events" 
ON public.events 
FOR UPDATE 
USING (auth.uid() = created_by);

DROP POLICY IF EXISTS "Everyone can view events" ON public.events;
CREATE POLICY "Everyone can view events" 
ON public.events 
FOR SELECT 
USING (true);

-- 4. Fix Storage for Event Posters (if not exists)
INSERT INTO storage.buckets (id, name, public) VALUES ('event-posters', 'event-posters', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies for Event Posters
DROP POLICY IF EXISTS "Poster images are publicly accessible" ON storage.objects;
CREATE POLICY "Poster images are publicly accessible" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'event-posters' );

DROP POLICY IF EXISTS "Authenticated users can upload posters" ON storage.objects;
CREATE POLICY "Authenticated users can upload posters" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'event-posters' AND auth.role() = 'authenticated' );

-- 5. Reload Schema Cache (Supabase does this automatically usually, but good to know)
NOTIFY pgrst, 'reload config';
