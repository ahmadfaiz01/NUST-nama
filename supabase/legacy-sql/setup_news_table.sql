-- =====================================================
-- NEWS TABLE SETUP FOR N8N INTEGRATION
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- STEP 1: CREATE THE NEWS_ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.news_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    summary TEXT,
    url TEXT,
    source TEXT DEFAULT 'NUST Official',
    published_at TIMESTAMPTZ,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    external_id TEXT,
    source_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add unique constraint on URL to prevent duplicates (for n8n upsert)
ALTER TABLE public.news_items 
DROP CONSTRAINT IF EXISTS news_items_url_unique;

ALTER TABLE public.news_items 
ADD CONSTRAINT news_items_url_unique UNIQUE (url);

-- =====================================================
-- STEP 2: SET UP ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view approved news" ON public.news_items;
DROP POLICY IF EXISTS "Admins can do everything with news" ON public.news_items;
DROP POLICY IF EXISTS "Service role can insert news" ON public.news_items;

-- Policy: Anyone can view APPROVED news
CREATE POLICY "Anyone can view approved news" ON public.news_items
    FOR SELECT
    USING (status = 'approved');

-- Policy: Admins/Moderators can view ALL news and modify
CREATE POLICY "Admins can do everything with news" ON public.news_items
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'moderator')
        )
    );

-- =====================================================
-- STEP 3: GRANT PERMISSIONS
-- =====================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON public.news_items TO service_role;
GRANT SELECT ON public.news_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.news_items TO authenticated;

-- =====================================================
-- STEP 4: INSERT SAMPLE NEWS (Optional - for testing)
-- =====================================================
INSERT INTO public.news_items (title, summary, url, source, published_at, status)
VALUES 
    (
        'Welcome to What''s Up NUST!',
        'Your one-stop platform for all NUST events, news, and campus updates. Stay connected with what''s happening!',
        'https://nust.edu.pk',
        'NUST Official',
        NOW(),
        'approved'
    ),
    (
        'Spring 2026 Semester Begins',
        'Classes for Spring 2026 semester have officially started. Check QALAM for your updated timetables.',
        'https://nust.edu.pk/academics',
        'NUST Official',
        NOW() - INTERVAL '1 day',
        'approved'
    ),
    (
        'Library Extended Hours',
        'The central library will remain open until midnight during the exam preparation period.',
        'https://nust.edu.pk/library',
        'Library',
        NOW() - INTERVAL '2 days',
        'approved'
    )
ON CONFLICT (url) DO NOTHING;

-- =====================================================
-- STEP 5: CREATE INDEX FOR FASTER QUERIES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_news_items_status ON public.news_items(status);
CREATE INDEX IF NOT EXISTS idx_news_items_published_at ON public.news_items(published_at DESC);

-- =====================================================
-- DONE! 
-- =====================================================
SELECT 'SUCCESS! news_items table created and ready for n8n!' as message;
SELECT COUNT(*) as total_news_items FROM public.news_items;
