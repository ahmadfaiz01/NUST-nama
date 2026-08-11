# NUST Nama (What's Up NUST)

Campus events, news and chatter for NUST students. Next.js 16 + Supabase.

Live: https://nustnama.vercel.app

## Features

- **Events** — browse (infinite scroll), calendar view, Leaflet map, RSVP, check-in with vibe/sentiment
- **Post an event** — student submissions land as `pending`, admins approve
- **News** — n8n scrapes sources into `news_items` via a webhook, admins approve, optional AI rewrite into student tone
- **Gupshup** — threaded discussion, users request new topics
- **Admin** — approve events/news/topics, manage users, stats, realtime notification bell
- **Auth** — Google OAuth only, restricted to `@*.nust.edu.pk` addresses

## Stack

| Layer | What |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4 |
| Backend | Supabase — Postgres, Auth, Storage, Realtime, Edge Functions |
| Maps | Leaflet / react-leaflet |
| Analytics | PostHog |
| AI | Groq (`llama-3.3-70b-versatile`) for news rewriting |
| Automation | n8n → `/api/webhooks/ingest-event` |

## Setup

```bash
npm install
cp .env.local.example .env.local   # then fill it in
npm run dev
```

### Environment

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | Server-only. Used by the ingest webhook to bypass RLS |
| `NEXT_PUBLIC_APP_URL` | yes | OAuth callback base URL |
| `NEXT_PUBLIC_POSTHOG_KEY` | no | Analytics |
| `NEXT_PUBLIC_POSTHOG_HOST` | no | Analytics region host |
| `GROQ_API_KEY` | yes | Chat agent's first provider, and the news "student tone" rewriter in `/admin/news` |
| `GROQ_API_KEY_2` | no | Second Groq key, tried when the first is rate limited |
| `MISTRAL_API_KEY` | no | Chat fallback after both Groq keys |
| `GEMINI_API_KEY` | no | Last chat fallback. 403s from Pakistan, fails over harmlessly |
| `INGEST_API_SECRET_KEY` | no | Shared secret for the n8n event webhook |

### Database

Migrations live in `supabase/migrations/`. Earlier hand-run scripts are in
`supabase/legacy-sql/` — see the README there for the reconstructed run order
if you ever rebuild from scratch.

```bash
supabase link --project-ref <ref>
supabase db push
supabase functions deploy cleanup-old-events
```

## Structure

```
src/
├── app/            routes (App Router)
│   ├── admin/      protected dashboard
│   ├── api/        student-tone (Groq), webhooks/ingest-event (n8n)
│   └── auth/       Google OAuth + callback with NUST domain check
├── components/     events, chatter, admin, layout, providers
├── hooks/          useInfiniteEvents
├── lib/            supabase clients, admin checks, venue list
└── types/          generated database types
supabase/
├── functions/      cleanup-old-events edge function
├── migrations/     tracked migrations
└── legacy-sql/     historical hand-run scripts
```

## Roles

| Role | Can |
|---|---|
| `student` | view, RSVP, check in, post to chatter, submit events |
| `moderator` | + approve events/news, use the news rewriter |
| `admin` | everything, incl. user management |

RLS is on for every table. Public sees only `status = 'approved'` events and news;
authors always see their own.
