import Link from "next/link";
import { EventCard } from "@/components/events/EventCard";
import { CampusHeatmap } from "@/components/events/CampusHeatmap";

// Mock featured events
const featuredEvents = [
  {
    id: "1",
    title: "SEECS Tech Fest 2026",
    description: "The biggest tech event at NUST featuring hackathons, workshops, and amazing speakers.",
    start_time: "2026-02-15T10:00:00",
    end_time: "2026-02-15T18:00:00",
    venue_name: "SEECS Auditorium",
    tags: ["Tech", "Hackathon"],
    is_official: true,
    rsvp_count: 234,
    checkin_count: 45,
    sentiment: "pos" as const,
  },
  {
    id: "2",
    title: "Cultural Night",
    description: "Celebrate Pakistan's rich cultural heritage with performances, food, and art.",
    start_time: "2026-02-10T17:00:00",
    end_time: "2026-02-10T22:00:00",
    venue_name: "Student Center",
    tags: ["Culture", "Music"],
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
    tags: ["Career", "Jobs"],
    is_official: true,
    rsvp_count: 456,
    checkin_count: 0,
    sentiment: null,
  },
  {
    id: "4",
    title: "Football Tournament",
    description: "Inter-school football competition under the lights.",
    start_time: "2026-02-08T20:00:00",
    end_time: "2026-02-08T23:59:00",
    venue_name: "Sports Complex",
    tags: ["Sports", "Football"],
    is_official: false,
    rsvp_count: 78,
    checkin_count: 12,
    sentiment: "pos" as const,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* Orange Tape - Top Overlay */}
      <div className="absolute top-20 left-0 right-0 z-30 pointer-events-none mix-blend-normal">
        <div className="bg-nust-orange py-2 border-b-2 border-nust-blue overflow-hidden -rotate-1 scale-105 transform origin-right shadow-md">
          <div className="animate-marquee flex gap-16 whitespace-nowrap">
            <span className="font-heading text-xl text-nust-blue tracking-widest">
              WHATS UP NUST • LIVE VIBES • CAMPUS EVENTS • DONT MISS OUT • SEECS TECH FEST • WHATS UP NUST • LIVE VIBES • CAMPUS EVENTS • DONT MISS OUT •
            </span>
            <span className="font-heading text-xl text-nust-blue tracking-widest">
              WHATS UP NUST • LIVE VIBES • CAMPUS EVENTS • DONT MISS OUT • SEECS TECH FEST • WHATS UP NUST • LIVE VIBES • CAMPUS EVENTS • DONT MISS OUT •
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section
        className="relative pt-32 pb-20"
        style={{
          backgroundColor: "var(--cream)",
          backgroundImage: `linear-gradient(var(--nust-blue) 1px, transparent 1px), linear-gradient(90deg, var(--nust-blue) 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
        }}
      >
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center">

            {/* Minimalist Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl text-nust-blue mb-6 leading-tight font-heading">
              YOUR CAMPUS<br />
              INTELLIGENCE
            </h1>

            <p className="text-xl md:text-2xl text-nust-blue/80 max-w-2xl mx-auto mb-10 font-display font-light">
              Real-time events. Live vibes. One platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/events" className="btn btn-primary text-lg px-8 py-3 shadow-[4px_4px_0px_var(--nust-orange)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
                Explore Events
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* What's Hot - Campus Heatmap (Minimal Container) */}
      <section className="py-20 bg-white border-y-2 border-nust-blue relative z-10">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-4xl md:text-5xl text-nust-blue mb-1 font-heading">WHAT&apos;S HOT</h2>
              <p className="font-display text-nust-blue/60 uppercase tracking-widest text-sm">
                Live activity map
              </p>
            </div>
          </div>

          <CampusHeatmap />
        </div>
      </section>

      {/* Featured Events (Dark Section) */}
      <section
        className="py-24 relative"
        style={{
          backgroundColor: "var(--nust-blue)",
          backgroundImage: `linear-gradient(var(--nust-orange) 1px, transparent 1px), linear-gradient(90deg, var(--nust-orange) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      >
        {/* News Ticker Overlay (Above Cards) */}
        <div className="absolute top-0 left-0 right-0 z-30 -translate-y-1/2 pointer-events-none">
          <div className="bg-nust-orange py-2 border-2 border-nust-blue overflow-hidden rotate-1 scale-105 transform origin-left shadow-lg">
            <div className="animate-marquee flex gap-16 whitespace-nowrap">
              <span className="font-heading text-xl text-nust-blue tracking-widest">
                • HAPPENING NOW • JOIN THE VIBE • HAPPENING NOW • JOIN THE VIBE • HAPPENING NOW • JOIN THE VIBE •
              </span>
              <span className="font-heading text-xl text-nust-blue tracking-widest">
                • HAPPENING NOW • JOIN THE VIBE • HAPPENING NOW • JOIN THE VIBE • HAPPENING NOW • JOIN THE VIBE •
              </span>
            </div>
          </div>
        </div>

        <div className="container relative z-10 pt-8">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl text-white mb-2 font-heading">UPCOMING EVENTS</h2>
            </div>
            <Link href="/events" className="text-nust-orange hover:text-white font-display font-bold decoration-2 underline-offset-4 hover:underline transition-all">
              View Calendar →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredEvents.map((event, index) => (
              <div key={event.id} className="hover:-translate-y-2 transition-transform duration-300">
                <EventCard event={event} index={index} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links (Minimal) */}
      <section className="py-20 bg-cream">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Calendar", icon: "📅", href: "/calendar" },
              { title: "Post Event", icon: "➕", href: "/post-event" },
              { title: "News", icon: "📰", href: "/news" },
              { title: "Profile", icon: "👤", href: "/profile" }
            ].map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="bg-white border-2 border-nust-blue rounded-lg p-6 text-center hover:bg-nust-blue hover:text-white transition-colors group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{link.icon}</div>
                <h3 className="font-heading text-lg">{link.title.toUpperCase()}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-nust-blue text-center">
        <div className="container">
          <p className="font-display text-white/50 text-sm">
            © 2026 What&apos;s Up NUST
          </p>
        </div>
      </footer>
    </div>
  );
}
