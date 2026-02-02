# NUST-NAMA Project Documentation

## 📋 Overview

**NUST-NAMA** is a Next.js web application for NUST (National University of Sciences and Technology) that serves as a central hub for:
- **Events** - Discover, RSVP, and check-in to campus events
- **News** - Stay updated with campus announcements
- **Chatter (Gupshup)** - Discussion forums for students
- **Calendar** - View upcoming events in calendar format

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14+ (App Router), React, TypeScript |
| **Styling** | Tailwind CSS |
| **Backend** | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| **Automation** | n8n (planned for news ingestion) |
| **Maps** | Leaflet.js for event locations |

---

## 📁 Project Structure

```
NUST-nama/
├── public/              # Static assets
│   └── images/          # Images and icons
├── src/
│   ├── app/             # Next.js App Router (pages)
│   │   ├── admin/       # Admin dashboard (protected)
│   │   │   ├── events/  # Manage events (approve/reject)
│   │   │   ├── users/   # User management
│   │   │   ├── gupshup/ # Topic request management
│   │   │   └── stats/   # Analytics
│   │   ├── api/         # API routes
│   │   │   └── webhooks/ingest-event/  # n8n webhook endpoint
│   │   ├── auth/        # Login/signup with Supabase Auth
│   │   ├── events/      # Public events listing & details
│   │   ├── chatter/     # Discussion forums (Gupshup)
│   │   ├── calendar/    # Calendar view of events
│   │   ├── news/        # News feed
│   │   ├── post-event/  # Event submission form
│   │   └── profile/     # User profile page
│   ├── components/      # Reusable React components
│   │   ├── admin/       # Admin components (notifications)
│   │   ├── chatter/     # Chat/forum components
│   │   ├── events/      # Event cards, maps, check-in
│   │   ├── layout/      # Navbar, Footer
│   │   └── social/      # RSVP button
│   ├── lib/             # Utility functions
│   │   └── supabase/    # Supabase client setup
│   └── types/           # TypeScript type definitions
├── *.sql                # Database migrations & setup scripts
└── package.json
```

---

## 🗄️ Database Schema (Supabase)

### Core Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (id, name, faculty, role, etc.) |
| `events` | All events with status (pending/approved/rejected) |
| `rsvps` | User RSVPs to events (going/interested) |
| `checkins` | User check-ins at events (with sentiment) |
| `news_items` | News articles (with status for approval) |
| `threads` | Gupshup discussion topics |
| `messages` | Messages within threads |
| `topic_requests` | User requests for new discussion topics |
| `admin_notifications` | Notifications for admins |

### Key Relationships
- `events.created_by` → `profiles.id`
- `rsvps.user_id` → `profiles.id`
- `rsvps.event_id` → `events.id`
- `messages.thread_id` → `threads.id`
- `messages.user_id` → `profiles.id`

---

## 🔐 Authentication & Authorization

### User Roles
| Role | Access |
|------|--------|
| `student` | View events, RSVP, check-in, post to chatter |
| `moderator` | Above + view pending content, approve events |
| `admin` | Full access to all admin features |

### Row Level Security (RLS)
All tables have RLS enabled with policies:
- **Events**: Public can only see `status = 'approved'` OR their own events
- **News**: Public can only see approved news
- **Messages**: Only authenticated users can view/post
- **Admin Notifications**: Only admins/moderators can view

---

## 📅 Event Workflow

### 1. Event Creation
```
User submits event via /post-event
    ↓
Event inserted with status = 'pending'
    ↓
Trigger fires → Creates admin notification
    ↓
Admin sees notification in dashboard
```

### 2. Event Approval
```
Admin views pending events in /admin/events
    ↓
Admin approves or rejects
    ↓
If approved: status = 'approved' → visible to public
If rejected: status = 'rejected' → not visible
```

### 3. Event Visibility
- **Public pages** (`/events`): Only show `status = 'approved'`
- **Admin pages** (`/admin/events`): Show all events with status filter
- **User's own events**: Visible to creator regardless of status

---

## 🔔 Admin Notification System

### When Notifications Are Created
| Trigger | Notification Type |
|---------|-------------------|
| New event with `status = 'pending'` | `event_request` |
| New news item with `status = 'pending'` | `news_request` |
| New topic request | `topic_request` |

### Notification Flow
1. User creates event/news/topic request
2. Database trigger fires
3. Notification inserted into `admin_notifications`
4. Admin layout has bell icon with real-time updates
5. Admin clicks notification → navigates to approval page

---

## 📰 News System (n8n Integration)

### Current Setup
- `news_items` table stores news with status column
- n8n can POST to `/api/webhooks/ingest-event` (or similar news endpoint)
- News items start as `pending` until admin approves

### Required for n8n
1. Run `fix_newsitems.sql` to add status column
2. Set up n8n workflow to POST news items
3. Use `external_id` for deduplication

---

## 💬 Chatter (Gupshup) System

### Structure
- **Threads**: Discussion topics (created by admins)
- **Messages**: User posts within threads
- **Topic Requests**: Users can request new topics

### Flow
```
User requests new topic → status = 'pending'
    ↓
Admin notification created
    ↓
Admin approves in /admin/gupshup
    ↓
New thread created → Users can post messages
```

---

## 🚀 SQL Files to Run

Run these in order in Supabase SQL Editor:

| File | Purpose |
|------|---------|
| `COMPLETE_SETUP.sql` | Initial database setup |
| `setup_chatter.sql` | Chatter tables (threads, messages, topic_requests) |
| `setup_admins.sql` | Admin role setup |
| `fix_school_column.sql` | Add school column to profiles, update trigger |
| `fix_newsitems.sql` | Add status column to news_items |
| `setup_admin_notifications.sql` | Admin notifications system with triggers |
| `admin_dashboard.sql` | RLS policies for events |

---

## 🔑 Key Features Status

| Feature | Status |
|---------|--------|
| User Authentication | ✅ Working |
| Event Listing | ✅ Working (approved only) |
| Event Creation | ✅ Working (pending status) |
| Admin Approval | ✅ Working |
| RSVP System | ✅ Working |
| Check-in System | ✅ Working |
| Chatter/Gupshup | ✅ Working |
| Admin Notifications | ✅ Just Added |
| News Approval | ✅ Just Added |
| n8n Integration | 🔄 Ready for setup |

---

## 📝 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_VAPID_PUBLIC_KEY=for_push_notifications (optional)
```

---

## 🎯 Next Steps

1. Run `fix_newsitems.sql` and `setup_admin_notifications.sql` in Supabase
2. Test event creation → check admin notifications appear
3. Set up n8n workflow for news ingestion
4. Test news approval flow

---

*Last Updated: February 2, 2026*
