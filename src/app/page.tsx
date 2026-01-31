import Link from "next/link";
import { EventCard } from "@/components/events/EventCard";
import { CampusHeatmap } from "@/components/events/CampusHeatmap";
import { EventCalendar } from "@/components/events/EventCalendar";

// Mock data
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
    checkin_count: 45,
    sentiment: "pos" as const,
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
    checkin_count: 12,
    sentiment: "pos" as const,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden">

      {/* Orange Tape Marquee - Top */}
      <div className="bg-nust-orange py-2 border-b-2 border-nust-blue overflow-hidden rotate-1 scale-105 transform origin-left">
        <div className="animate-marquee flex gap-16 whitespace-nowrap">
          <span className="font-heading text-xl text-nust-blue tracking-widest">
            WHATS UP NUST • LIVE VIBES • CAMPUS EVENTS • DONT MISS OUT • SEECS TECH FEST • WHATS UP NUST • LIVE VIBES • CAMPUS EVENTS • DONT MISS OUT •
          </span>
          <span className="font-heading text-xl text-nust-blue tracking-widest">
            WHATS UP NUST • LIVE VIBES • CAMPUS EVENTS • DONT MISS OUT • SEECS TECH FEST • WHATS UP NUST • LIVE VIBES • CAMPUS EVENTS • DONT MISS OUT •
          </span>
        </div>
      </div>

      {/* Hero Section - Cream with Blue Grid */}
      <section
        className="relative pt-12 pb-16"
        style={{
          backgroundColor: "var(--cream)",
          backgroundImage: `linear-gradient(var(--nust-blue) 1px, transparent 1px), linear-gradient(90deg, var(--nust-blue) 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
        }}
      >
        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto text-center">

            {/* Sticker Badge */}
            <div className="absolute top-0 right-0 md:right-20 animate-float hidden md:block">
              <div className="w-24 h-24 bg-nust-orange rounded-full border-2 border-nust-blue flex items-center justify-center -rotate-12 shadow-[4px_4px_0px_var(--nust-blue)]">
                <span className="font-heading text-nust-blue text-center leading-none text-sm">Gen Z<br />Approved</span>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-6xl md:text-8xl lg:text-9xl text-nust-blue mb-6 leading-[0.85] drop-shadow-[4px_4px_0px_rgba(229,149,0,0.5)]">
              YOUR CAMPUS<br />
              <span className="text-stroke" style={{ WebkitTextStroke: "2px var(--nust-blue)", color: "transparent" }}>INTELLIGENCE</span><br />
              PLATFORM
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-nust-blue/80 max-w-2xl mx-auto mb-10 font-display font-medium">
              Real-time events, crowd sentiment, and social vibes. <br />
              <span className="bg-nust-orange/20 px-2 rounded-lg -rotate-1 inline-block border border-nust-orange/50 mt-2">
                All in one place.
              </span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/events" className="btn btn-primary text-xl px-10 py-4 shadow-[6px_6px_0px_var(--nust-orange)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all">
                Explore Events
              </Link>
              <Link href="/auth?mode=signup" className="btn btn-outline text-xl px-10 py-4 hover:bg-nust-blue hover:text-white transition-all">
                Join the Vibe
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* News Ticker - Blue Tape */}
      <div className="bg-nust-blue py-3 border-y-4 border-nust-orange overflow-hidden relative">
        <div className="animate-marquee flex gap-16 whitespace-nowrap">
          <span className="font-heading text-xl text-white tracking-widest flex items-center gap-4">
            <span className="text-nust-orange">📢</span> MESS CHALLAN IS UP
            <span className="text-nust-orange">•</span> LIBRARY EXTENDED HOURS THIS WEEK
            <span className="text-nust-orange">•</span> SEECS TECH FEST REGISTRATIONS OPEN
            <span className="text-nust-orange">•</span> SEMESTER RESULTS ANNOUNCED
            <span className="text-nust-orange">•</span> SPORTS WEEK STARTING MONDAY
          </span>
          <span className="font-heading text-xl text-white tracking-widest flex items-center gap-4">
            <span className="text-nust-orange">📢</span> MESS CHALLAN IS UP
            <span className="text-nust-orange">•</span> LIBRARY EXTENDED HOURS THIS WEEK
            <span className="text-nust-orange">•</span> SEECS TECH FEST REGISTRATIONS OPEN
            <span className="text-nust-orange">•</span> SEMESTER RESULTS ANNOUNCED
            <span className="text-nust-orange">•</span> SPORTS WEEK STARTING MONDAY
          </span>
        </div>
      </div>

      {/* Popular Events (Dark Blue with Orange Grid) */}
      <section
        className="py-20 relative"
        style={{
          backgroundColor: "var(--nust-blue)",
          backgroundImage: `linear-gradient(var(--nust-orange) 1px, transparent 1px), linear-gradient(90deg, var(--nust-orange) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      >
        <div className="container relative z-10">

          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-5xl md:text-6xl text-white mb-2 drop-shadow-[2px_2px_0px_var(--nust-orange)]">POPULAR EVENTS</h2>
              <p className="font-display text-lg text-white/70 uppercase tracking-widest">Check out where the crowd is headed</p>
            </div>
            <Link href="/events" className="btn bg-nust-orange text-nust-blue font-bold text-sm py-2 px-6 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mockEvents.map((event, index) => (
              <div key={event.id} className={`transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-transform duration-300`}>
                <EventCard event={event} index={index} />
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Orange Tape Marquee - Bottom of Events */}
      <div className="bg-nust-orange py-2 border-y-2 border-nust-blue overflow-hidden -rotate-1 scale-105 transform origin-right">
        <div className="animate-marquee flex gap-16 whitespace-nowrap">
          <span className="font-heading text-xl text-nust-blue tracking-widest">
            • DONT MISS OUT • JOIN THE COMMUNITY • RSVP NOW • DONT MISS OUT • JOIN THE COMMUNITY • RSVP NOW •
          </span>
          <span className="font-heading text-xl text-nust-blue tracking-widest">
            • DONT MISS OUT • JOIN THE COMMUNITY • RSVP NOW • DONT MISS OUT • JOIN THE COMMUNITY • RSVP NOW •
          </span>
        </div>
      </div>

      {/* What's Hot - Campus Heatmap */}
      <section
        className="py-20"
        style={{
          backgroundColor: "var(--cream)",
          backgroundImage: `linear-gradient(var(--nust-blue) 1px, transparent 1px), linear-gradient(90deg, var(--nust-blue) 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
        }}
      >
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl text-nust-blue mb-4">WHAT&apos;S HOT 🔥</h2>
            <p className="font-display text-lg text-nust-blue/60 uppercase tracking-widest">
              Live activity across NUST campus
            </p>
          </div>

          <CampusHeatmap />
        </div>
      </section>

      {/* Event Calendar Section */}
      <section className="py-20 bg-white border-y-2 border-nust-blue">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl text-nust-blue mb-4">EVENT CALENDAR</h2>
            <p className="font-display text-lg text-nust-blue/60 uppercase tracking-widest">
              Click a date to see what&apos;s happening
            </p>
          </div>

          <EventCalendar events={mockEvents} />
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20"
        style={{
          backgroundColor: "var(--cream)",
          backgroundImage: `linear-gradient(var(--nust-blue) 1px, transparent 1px), linear-gradient(90deg, var(--nust-blue) 1px, transparent 1px)`,
          backgroundSize: "100px 100px",
        }}
      >
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl text-nust-blue mb-4">WHY WHAT&apos;S UP NUST?</h2>
            <p className="font-display text-lg text-nust-blue/60 uppercase tracking-widest">
              More than just an event app
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card bg-white border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)] text-center p-8 hover:shadow-[8px_8px_0px_var(--nust-blue)] hover:-translate-y-2 transition-all">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-nust-blue flex items-center justify-center shadow-[4px_4px_0px_var(--nust-orange)]">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-heading text-2xl text-nust-blue mb-3">All Events, One Place</h3>
              <p className="text-nust-blue/70 font-display">
                Official announcements, society events, and spontaneous hangouts — all synced automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card bg-white border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)] text-center p-8 hover:shadow-[8px_8px_0px_var(--nust-blue)] hover:-translate-y-2 transition-all">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-nust-orange flex items-center justify-center shadow-[4px_4px_0px_var(--nust-blue)]">
                <svg className="w-10 h-10 text-nust-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <h3 className="font-heading text-2xl text-nust-blue mb-3">Live Crowd Vibes</h3>
              <p className="text-nust-blue/70 font-display">
                See real-time sentiment from people who are actually there. No more FOMO guessing games.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card bg-white border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)] text-center p-8 hover:shadow-[8px_8px_0px_var(--nust-blue)] hover:-translate-y-2 transition-all">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-nust-blue flex items-center justify-center shadow-[4px_4px_0px_var(--nust-orange)]">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="font-heading text-2xl text-nust-blue mb-3">Post Your Event</h3>
              <p className="text-nust-blue/70 font-display">
                Hosting something? Post it in seconds and reach thousands of students instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-nust-orange">
        <div className="container text-center">
          <h2 className="text-5xl md:text-6xl text-nust-blue mb-4 drop-shadow-[2px_2px_0px_rgba(255,255,255,0.5)]">READY TO VIBE?</h2>
          <p className="text-nust-blue/80 max-w-xl mx-auto mb-8 text-lg font-display">
            Join thousands of NUST students who never miss what&apos;s happening on campus.
          </p>
          <Link href="/auth?mode=signup" className="btn bg-nust-blue text-white text-xl px-10 py-4 shadow-[6px_6px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-nust-blue border-t-4 border-nust-orange">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center border-2 border-nust-orange">
                <span className="font-heading text-sm text-nust-blue">W</span>
              </div>
              <span className="font-display text-sm text-white/70">
                © 2026 What&apos;s Up NUST. Made with 💙 by students, for students.
              </span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="/about" className="text-sm text-white/70 hover:text-nust-orange transition-colors font-display">
                About
              </Link>
              <Link href="/faq" className="text-sm text-white/70 hover:text-nust-orange transition-colors font-display">
                FAQ
              </Link>
              <Link href="/privacy" className="text-sm text-white/70 hover:text-nust-orange transition-colors font-display">
                Privacy
              </Link>
              <Link href="/contact" className="text-sm text-white/70 hover:text-nust-orange transition-colors font-display">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
