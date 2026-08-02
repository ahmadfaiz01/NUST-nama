-- =============================================
-- MIGRATION: Admin access to documents for the blacklist page
-- Run in: Supabase SQL Editor
--
-- Why: the original chatbot schema let authenticated users read only `indexed`
--      documents and gave nobody an update path. The admin documents page needs
--      to see blacklisted rows in order to restore them, and to flip `indexed`.
--      Using a service key in the browser would leak it, so the permission
--      belongs in RLS instead.
--
-- NOTE: this deliberately calls the EXISTING public.is_moderator_or_admin() and
--       does not redefine public.is_admin(). Those two already exist with
--       different meanings — is_admin() is role = 'admin' only, while
--       is_moderator_or_admin() covers both. Redefining is_admin() to include
--       moderators would silently grant every moderator full admin rights across
--       events, threads, topic_requests, news and admin_notifications, all of
--       which call it in their own policies.
-- =============================================

-- Admins and moderators read every document, blacklisted ones included.
drop policy if exists "documents readable by admins" on public.documents;
create policy "documents readable by admins" on public.documents
  for select to authenticated using (public.is_moderator_or_admin());

-- ...and may flip `indexed`. All other writes still go through the service role.
drop policy if exists "documents updatable by admins" on public.documents;
create policy "documents updatable by admins" on public.documents
  for update to authenticated
  using (public.is_moderator_or_admin())
  with check (public.is_moderator_or_admin());

-- Section counts on blacklisted documents must be visible to admins too.
drop policy if exists "sections readable by admins" on public.sections;
create policy "sections readable by admins" on public.sections
  for select to authenticated using (public.is_moderator_or_admin());
