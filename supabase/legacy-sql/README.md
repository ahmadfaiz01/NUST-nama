# Legacy SQL

Ad-hoc scripts that were pasted into the Supabase SQL Editor by hand between Feb 1–3, 2026,
before this repo had a `supabase/migrations/` folder. Kept verbatim — they are the only
surviving record of the schema.

Nearly all of them are idempotent (`CREATE TABLE IF NOT EXISTS`, `DROP POLICY IF EXISTS`,
`CREATE OR REPLACE FUNCTION`), so re-running in order on a fresh project should work.
**Untested** — no live database was reachable when this was written.

## Run order

Best reconstruction from file contents and git history. Several files redefine the same
function, so order matters: last write wins.

| # | File | Notes |
|---|------|-------|
| 1 | `NUCLEAR_FIX.sql` | profiles + `handle_new_user`. Supersedes `COMPLETE_SETUP.sql` |
| 2 | `fix_schema_and_rls.sql` | events columns + policies |
| 3 | `fix_relationships.sql` | events foreign keys |
| 4 | `fix_rls_and_storage_v2.sql` | profiles/events RLS + avatar storage. Supersedes `fix_rls_and_storage.sql` |
| 5 | `fix_rsvps.sql` | rsvps table |
| 6 | `fix_checkins.sql` | checkins table |
| 7 | `add_sentiment.sql` | `checkins.sentiment` — must run after 6 |
| 8 | `setup_chatter.sql` | threads, messages, topic_requests |
| 9 | `setup_admins.sql` | `profiles.role`, `is_admin()`, `is_moderator_or_admin()`. Supersedes `fix_signup_error.sql` |
| 10 | `setup_admin.sql` | redefines `is_admin()` + thread policies — later than `setup_admins.sql` despite the name |
| 11 | `admin_dashboard.sql` | `events.status` + admin policies |
| 12 | `admin_complete_migration.sql` | chatter admin policies |
| 13 | `setup_news_table.sql` | news_items table |
| 14 | `fix_newsitems.sql` | `news_items.status` + index |
| 15 | `setup_admin_notifications.sql` | admin_notifications + triggers |
| 16 | `fix_chat_permissions.sql` | messages RLS |
| 17 | `fix_school_column.sql` | `profiles.school`, redefines `handle_new_user` |
| 18 | `update_email_trigger.sql` | email sync on signup |

Then apply `supabase/migrations/` in filename order. `20260421_nust_domain_trigger.sql`
redefines `handle_new_user` again to enforce the `@*.nust.edu.pk` domain — it must be last.

## Superseded (kept for history, do not run)

- `COMPLETE_SETUP.sql` → `NUCLEAR_FIX.sql`
- `fix_rls_and_storage.sql` → `fix_rls_and_storage_v2.sql`
- `fix_signup_error.sql` → `setup_admins.sql`

## Next time

Use `supabase migration new <name>` and `supabase db push` instead of the SQL Editor,
so applied state is tracked.
