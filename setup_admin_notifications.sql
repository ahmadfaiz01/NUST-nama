-- ============================================
-- ADMIN NOTIFICATIONS SYSTEM
-- ============================================
-- This creates a notifications system for admins
-- Notifications are sent when new events/news/topic requests are created

-- 1. ADMIN NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('event_request', 'news_request', 'topic_request', 'user_report', 'system')),
    title TEXT NOT NULL,
    message TEXT,
    reference_id UUID,  -- ID of the event/news/topic being referenced
    reference_type TEXT,  -- 'event', 'news_item', 'topic_request'
    is_read BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can view notifications" ON public.admin_notifications;
DROP POLICY IF EXISTS "Admins can update notifications" ON public.admin_notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.admin_notifications;

-- 4. RLS Policies

-- Only admins/moderators can view notifications
CREATE POLICY "Admins can view notifications" 
ON public.admin_notifications FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
    )
);

-- Only admins/moderators can mark as read
CREATE POLICY "Admins can update notifications" 
ON public.admin_notifications FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'moderator')
    )
);

-- Allow system to create notifications
CREATE POLICY "System can create notifications" 
ON public.admin_notifications FOR INSERT 
WITH CHECK (true);

-- 5. Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_admin_notifications_is_read ON public.admin_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_type ON public.admin_notifications(type);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON public.admin_notifications(created_at DESC);

-- ============================================
-- TRIGGER: Auto-notify admins on new event
-- ============================================

-- Function to create notification when new event is inserted
CREATE OR REPLACE FUNCTION notify_admin_new_event()
RETURNS TRIGGER AS $$
DECLARE
    creator_name TEXT;
BEGIN
    -- Only notify for pending events (not auto-approved official ones)
    IF NEW.status = 'pending' THEN
        -- Get creator name
        SELECT name INTO creator_name 
        FROM public.profiles 
        WHERE id = NEW.created_by;
        
        -- Insert notification
        INSERT INTO public.admin_notifications (
            type, 
            title, 
            message, 
            reference_id, 
            reference_type, 
            created_by
        ) VALUES (
            'event_request',
            'New Event Request: ' || NEW.title,
            COALESCE(creator_name, 'Someone') || ' submitted a new event for approval.',
            NEW.id,
            'event',
            NEW.created_by
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_new_event_notify_admin ON public.events;

-- Create trigger
CREATE TRIGGER on_new_event_notify_admin
    AFTER INSERT ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION notify_admin_new_event();

-- ============================================
-- TRIGGER: Auto-notify admins on new news item
-- ============================================

CREATE OR REPLACE FUNCTION notify_admin_new_news()
RETURNS TRIGGER AS $$
BEGIN
    -- Only notify for pending news
    IF NEW.status = 'pending' THEN
        INSERT INTO public.admin_notifications (
            type, 
            title, 
            message, 
            reference_id, 
            reference_type
        ) VALUES (
            'news_request',
            'New News Item: ' || NEW.title,
            'A new news item needs approval from ' || COALESCE(NEW.source, 'Unknown source'),
            NEW.id,
            'news_item'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_new_news_notify_admin ON public.news_items;

-- Create trigger
CREATE TRIGGER on_new_news_notify_admin
    AFTER INSERT ON public.news_items
    FOR EACH ROW
    EXECUTE FUNCTION notify_admin_new_news();

-- ============================================
-- TRIGGER: Auto-notify admins on topic request
-- ============================================

CREATE OR REPLACE FUNCTION notify_admin_topic_request()
RETURNS TRIGGER AS $$
DECLARE
    requester_name TEXT;
BEGIN
    -- Get requester name
    SELECT name INTO requester_name 
    FROM public.profiles 
    WHERE id = NEW.user_id;
    
    -- Insert notification
    INSERT INTO public.admin_notifications (
        type, 
        title, 
        message, 
        reference_id, 
        reference_type, 
        created_by
    ) VALUES (
        'topic_request',
        'New Gupshup Topic Request: ' || NEW.topic_title,
        COALESCE(requester_name, 'Someone') || ' requested a new discussion topic.',
        NEW.id,
        'topic_request',
        NEW.user_id
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_topic_request_notify_admin ON public.topic_requests;

-- Create trigger
CREATE TRIGGER on_topic_request_notify_admin
    AFTER INSERT ON public.topic_requests
    FOR EACH ROW
    EXECUTE FUNCTION notify_admin_topic_request();

NOTIFY pgrst, 'reload config';

-- ============================================
-- VERIFICATION: Check triggers are created
-- ============================================
-- SELECT trigger_name, event_manipulation, action_statement 
-- FROM information_schema.triggers 
-- WHERE trigger_schema = 'public';
