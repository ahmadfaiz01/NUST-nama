-- Enable RLS (just in case)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public threads are viewable by everyone" ON threads;
DROP POLICY IF EXISTS "Authenticated users can create messages" ON messages;
DROP POLICY IF EXISTS "Everyone can view messages" ON messages;

-- 1. THREADS (Public View)
CREATE POLICY "Public threads are viewable by everyone" 
ON threads FOR SELECT 
USING (true);

-- 2. MESSAGES (View)
CREATE POLICY "Everyone can view messages" 
ON messages FOR SELECT 
USING (true);

-- 3. MESSAGES (Insert - Authenticated Only)
CREATE POLICY "Authenticated users can create messages" 
ON messages FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- 4. MESSAGES (Delete - Admins Only)
-- Assuming you have an is_admin function or checking public.profiles role
CREATE POLICY "Admins can delete messages" 
ON messages FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
