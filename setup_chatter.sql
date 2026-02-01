-- 1. THREADS TABLE
CREATE TABLE IF NOT EXISTS public.threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  emoji TEXT DEFAULT '💬',
  color_theme TEXT DEFAULT 'bg-nust-blue',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TOPIC REQUESTS TABLE
CREATE TABLE IF NOT EXISTS public.topic_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  topic_title TEXT NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID REFERENCES public.threads(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ENABLE RLS
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- POLICIES

-- Threads: Public view, Admin manage (Mocking admin as auth user for now, implementation later)
CREATE POLICY "Public can view threads" ON public.threads FOR SELECT USING (true);
CREATE POLICY "Admins can manage threads" ON public.threads FOR ALL USING (auth.uid() IN (SELECT id FROM auth.users)); -- Temporary simplified admin check

-- Requests: Users create, Admins view
CREATE POLICY "Users can request topics" ON public.topic_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users view own requests" ON public.topic_requests FOR SELECT USING (auth.uid() = user_id);

-- Messages: Auth view/create
CREATE POLICY "Auth users view messages" ON public.messages FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users post messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- SEED DATA
INSERT INTO public.threads (title, description, emoji, color_theme) VALUES
('Campus Transport', 'Vent about the shuttles or find a ride.', '🚌', 'bg-yellow-500'),
('Food Reviews', 'Best café? Worst chai? Spill the tea.', '🍔', 'bg-red-500'),
('Exam Stress', 'We are all in this together. Scream here.', '📚', 'bg-blue-600'),
('Confessions', 'Anonymous (kinda) vibes.', '🤫', 'bg-purple-600');

NOTIFY pgrst, 'reload config';
