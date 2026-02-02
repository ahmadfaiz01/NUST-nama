-- ============================================
-- FIX NEWS_ITEMS TABLE FOR ADMIN APPROVAL
-- ============================================
-- This adds a status column to news_items for n8n automation
-- News items will require admin approval before being visible

-- 1. Add status column (if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'news_items' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE public.news_items 
        ADD COLUMN status TEXT DEFAULT 'pending' 
        CHECK (status IN ('pending', 'approved', 'rejected'));
    END IF;
END $$;

-- 2. Add source_url column for n8n to track where news came from (optional)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'news_items' 
        AND column_name = 'source_url'
    ) THEN
        ALTER TABLE public.news_items 
        ADD COLUMN source_url TEXT;
    END IF;
END $$;

-- 3. Add external_id for deduplication (prevents duplicate news from n8n)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'news_items' 
        AND column_name = 'external_id'
    ) THEN
        ALTER TABLE public.news_items 
        ADD COLUMN external_id TEXT UNIQUE;
    END IF;
END $$;

-- 4. Create index for faster status queries
CREATE INDEX IF NOT EXISTS idx_news_items_status ON public.news_items(status);

-- 5. Enable RLS on news_items
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Public can view approved news" ON public.news_items;
DROP POLICY IF EXISTS "Admins can manage all news" ON public.news_items;
DROP POLICY IF EXISTS "System can insert news" ON public.news_items;

-- 7. RLS Policies for news_items

-- Public can only see approved news
CREATE POLICY "Public can view approved news" 
ON public.news_items FOR SELECT 
USING (status = 'approved');

-- Admins can see and manage all news
CREATE POLICY "Admins can manage all news" 
ON public.news_items FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
    )
);

-- Allow API/service role to insert (for n8n webhook)
CREATE POLICY "System can insert news" 
ON public.news_items FOR INSERT 
WITH CHECK (true);  -- Service role bypasses RLS anyway, but this is here for clarity

-- 8. Update existing news items to approved (optional - for backward compatibility)
-- Uncomment the line below if you want existing news to be approved automatically
-- UPDATE public.news_items SET status = 'approved' WHERE status IS NULL;

NOTIFY pgrst, 'reload config';

-- ============================================
-- VERIFICATION QUERY (run this to check)
-- ============================================
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'news_items' 
-- ORDER BY ordinal_position;
