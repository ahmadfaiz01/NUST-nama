import Link from "next/link";
import { EventCard } from "@/components/events/EventCard";

// Mock data for development
const mockEvents = [
  {
    id: "1",
    title: "SEECS Tech Fest 2026",
    description: "The biggest tech event at NUST featuring hackathons, workshops, and amazing speakers.",
    start_time: "2026-02-15T10:00:00",
    end_time: "2026-02-15T18:00:00",
    venue_name: "SEECS Auditorium",
    tags: ["Tech", "Hackathon", "Workshop"],
    is_official: true,
    rsvp_count: 234,
    checkin_count: 0,
    sentiment: null,
  },
  {
    id: "2",
    title: "Cultural Night: Rang-e-Tehzeeb",
    description: "Celebrate Pakistan's rich cultural heritage with performances, food, and art.",
    start_time: "2026-02-10T17:00:00",
    end_time: "2026-02-10T22:00:00",
    venue_name: "Student Center",
    tags: ["Culture", "Music", "Food"],
    is_official: false,
    rsvp_count: 189,
    checkin_count: 0,
    sentiment: null,
  },
  {
    id: "3",
    title: "Career Fair 2026",
    description: "Connect with top companies and explore internship and job opportunities.",
    start_time: "2026-02-20T09:00:00",
    end_time: "2026-02-20T16:00:00",
    venue_name: "Convention Center",
    tags: ["Career", "Networking", "Jobs"],
    is_official: true,
    rsvp_count: 456,
    checkin_count: 0,
    sentiment: null,
  },
  {
    id: "4",
    title: "Midnight Football Tournament",
    description: "Inter-school football competition under the lights. Are you ready?",
    start_time: "2026-02-08T20:00:00",
    end_time: "2026-02-08T23:59:00",
    venue_name: "Sports Complex",
    tags: ["Sports", "Football", "Competition"],
    is_official: false,
    rsvp_count: 78,
    checkin_count: 0,
    sentiment: null,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nust-blue/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-nust-orange/10 rounded-full blur-3xl" />
        </div>

        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 badge badge-primary mb-6 animate-fade-in">
              <span className="w-2 h-2 bg-nust-orange rounded-full animate-pulse" />
              <span>Live Campus Intelligence</span>
            </div>

            {/* Headline */}
            <h1 className="mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <span className="block text-foreground">WHAT&apos;S</span>
              <span className="block">
                <span className="text-foreground">HAPPENING AT </span>
                <span className="gradient-text">NUST</span>
                <span className="text-nust-orange">?</span>
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className="text-lg md:text-xl text-foreground-muted max-w-2xl mx-auto mb-8 animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Discover events, feel the crowd vibe, and never miss out on campus life.
              Your real-time guide to everything NUST.
            </p>

            {/* CTA Buttons */}
            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <Link href="/events" className="btn btn-primary text-base px-8 py-3">
                Explore Events
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
              <Link href="/auth?mode=signup" className="btn btn-outline text-base px-8 py-3">
                Join the Vibe
              </Link>
            </div>

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-8 mt-16 max-w-md mx-auto animate-fade-in"
              style={{ animationDelay: "0.5s" }}
            >
              <div className="text-center">
                <div className="font-heading text-3xl md:text-4xl text-nust-orange">50+</div>
                <div className="text-sm text-foreground-muted">Events/Month</div>
              </div>
              <div className="text-center">
                <div className="font-heading text-3xl md:text-4xl text-nust-blue">2.5K</div>
                <div className="text-sm text-foreground-muted">Active Users</div>
              </div>
              <div className="text-center">
                <div className="font-heading text-3xl md:text-4xl text-nust-orange">Live</div>
                <div className="text-sm text-foreground-muted">Crowd Vibes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-16 bg-background-secondary">
        <div className="container">
          {/* Section Header */}
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-foreground">UPCOMING EVENTS</h2>
              <p className="text-foreground-muted mt-1">What&apos;s buzzing on campus</p>
            </div>
            <Link
              href="/events"
              className="hidden sm:inline-flex items-center gap-2 text-primary hover:text-accent transition-colors font-display font-medium"
            >
              View All
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Event Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}
          </div>

          {/* Mobile View All */}
          <div className="mt-8 text-center sm:hidden">
            <Link href="/events" className="btn btn-outline">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-foreground mb-4">WHY WHAT&apos;S UP NUST?</h2>
            <p className="text-foreground-muted max-w-2xl mx-auto">
              More than just an event app. It&apos;s your campus companion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card text-center group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-nust-blue to-ceramic flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-foreground mb-2">All Events, One Place</h4>
              <p className="text-foreground-muted text-sm">
                Official announcements, society events, and spontaneous hangouts — all synced automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card text-center group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-nust-orange to-nust-orange-light flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-foreground mb-2">Live Crowd Vibes</h4>
              <p className="text-foreground-muted text-sm">
                See real-time sentiment from people who are actually there. No more FOMO guessing games.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card text-center group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-ceramic to-nust-blue-light flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-foreground mb-2">Squad Up</h4>
              <p className="text-foreground-muted text-sm">
                RSVP, see who&apos;s going, and coordinate with friends. Never attend alone again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-nust-blue to-nust-blue-dark">
        <div className="container text-center">
          <h2 className="text-white mb-4">READY TO VIBE?</h2>
          <p className="text-white/80 max-w-xl mx-auto mb-8">
            Join thousands of NUST students who never miss what&apos;s happening on campus.
          </p>
          <Link href="/auth?mode=signup" className="btn btn-accent text-base px-8 py-3">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-nust-blue to-ceramic flex items-center justify-center">
                <span className="font-heading text-sm text-white">W</span>
              </div>
              <span className="font-display text-sm text-foreground-muted">
                © 2026 What&apos;s Up NUST. Made with 💙 by students, for students.
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/about" className="text-sm text-foreground-muted hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/privacy" className="text-sm text-foreground-muted hover:text-primary transition-colors">
                Privacy
              </Link>
              <Link href="/contact" className="text-sm text-foreground-muted hover:text-primary transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
