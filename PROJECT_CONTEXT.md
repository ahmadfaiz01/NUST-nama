# Architecture Notes

Data model and workflows. Setup, stack and env live in [README.md](README.md).

*Last verified against code: August 5, 2026. The Supabase project referenced in
`.env.local` at that date no longer resolves, so none of this could be checked
against a live database.*

## Tables

| Table | Purpose |
|---|---|
| `profiles` | One row per auth user. `role`, `school`, avatar. Created by the `handle_new_user` trigger |
| `events` | `status` = pending / approved / rejected. `external_id` dedupes automated imports |
| `rsvps` | going / interested, unique per (user, event) |
| `checkins` | Attendance + `sentiment`, drives the campus vibe heatmap |
| `news_items` | Scraped news, `status` gates public visibility |
| `threads` | Gupshup discussion topics, admin-created |
| `messages` | Posts inside a thread |
| `topic_requests` | Student requests for a new thread |
| `admin_notifications` | Fanned out by DB triggers, read by the admin bell |

Foreign keys: `events.created_by`, `rsvps.user_id`, `checkins.user_id`,
`messages.user_id` → `profiles.id`. `rsvps.event_id`, `checkins.event_id` →
`events.id`. `messages.thread_id` → `threads.id`.

## Auth

Google OAuth only. Two gates, both required:

1. `src/app/auth/callback/route.ts` rejects any email outside `@*.nust.edu.pk`
   and signs the session back out.
2. `supabase/migrations/20260421_nust_domain_trigger.sql` — the `handle_new_user`
   trigger raises on a non-NUST address, so a direct API signup fails too.

The trigger is the real boundary; the callback just gives a friendly message.
Several `legacy-sql/` files also define `handle_new_user` — this migration must be
applied last or the domain check is silently dropped.

## Roles and RLS

`student` → `moderator` → `admin`, stored in `profiles.role`. Helper functions
`is_admin()` and `is_moderator_or_admin()` are used inside policies.

Public reads are limited to `status = 'approved'` for events and news. Authors
always see their own rows. `admin_notifications` is admin/moderator only.

## Event lifecycle

```
student submits /post-event         n8n POSTs /api/webhooks/ingest-event
        │                                    │  (x-api-secret header)
        └──────────► events.status = 'pending' ◄──────── unless is_official,
                             │                            which auto-approves
                    trigger fires
                             │
                  admin_notifications row
                             │
              admin approves in /admin/events/[id]
                             │
                     status = 'approved'  → public
```

Events past their end date are removed by the `cleanup-old-events` edge function,
scheduled by `supabase/migrations/20260421_cleanup_cron.sql`.

## News lifecycle

n8n writes into `news_items` as `pending`, deduped on `external_id`. In
`/admin/news` an admin can hit "student tone", which calls `/api/student-tone` →
Groq, and returns a rewritten title and summary to edit before approving. That
route is admin/moderator gated because it spends API credits.

`/news` shows the last 7 days as a grid and everything older as a compact
archive list below it.

## Gupshup lifecycle

Student files a topic request → trigger creates an admin notification → admin
approves in `/admin/gupshup` → thread appears → anyone signed in can post.
Admins can delete messages.

## Known gaps

- No tests anywhere.
- `profiles.push_subscription` column is unused. Web push was removed on
  Aug 5, 2026 — the client helper was dead code and nothing ever sent a push.
- `INGEST_API_SECRET_KEY` is a single shared secret with no rotation.
