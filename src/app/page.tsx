import Link from "next/link";
import { EventCard } from "@/components/events/EventCard";

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
    <div className="min-h-screen overflow-hidden">

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 bg-cream">
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
            <p className="text-xl md:text-2xl text-nust-blue/80 max-w-2xl mx-auto mb-10 font-medium">
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

      {/* News Ticker / Tape */}
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

      {/* Popular Events (Dark Blue Background with Orange Grid) */}
      <section
        className="py-20 relative"
        style={{
          backgroundColor: "var(--nust-blue)",
          backgroundImage: `linear-gradient(var(--nust-orange) 1px, transparent 1px), linear-gradient(90deg, var(--nust-orange) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
          backgroundPosition: "center top",
        }}
      >
        <div className="container relative z-10">

          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-5xl md:text-6xl text-white mb-2 drop-shadow-[2px_2px_0px_var(--nust-orange)]">Popular Events</h2>
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

      {/* Features Section */}
      <section className="py-20 bg-cream">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl text-nust-blue mb-4">WHY WHAT&apos;S UP NUST?</h2>
            <p className="text-nust-blue/60 font-display uppercase tracking-widest">
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
              <p className="text-nust-blue/70">
                Official announcements, society events, and spontaneous hangouts — all synced automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card bg-white border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)] text-center p-8 hover:shadow-[8px_8px_0px_var(--nust-blue)] hover:-translate-y-2 transition-all">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-nust-orange flex items-center justify-center shadow-[4px_4px_0px_var(--nust-blue)]">
                <svg className="w-10 h-10 text-nust-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-2xl text-nust-blue mb-3">Live Crowd Vibes</h3>
              <p className="text-nust-blue/70">
                See real-time sentiment from people who are actually there. No more FOMO guessing games.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card bg-white border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)] text-center p-8 hover:shadow-[8px_8px_0px_var(--nust-blue)] hover:-translate-y-2 transition-all">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-nust-blue flex items-center justify-center shadow-[4px_4px_0px_var(--nust-orange)]">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-2xl text-nust-blue mb-3">Squad Up</h3>
              <p className="text-nust-blue/70">
                RSVP, see who&apos;s going, and coordinate with friends. Never attend alone again.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-nust-orange">
        <div className="container text-center">
          <h2 className="text-5xl md:text-6xl text-nust-blue mb-4 drop-shadow-[2px_2px_0px_rgba(255,255,255,0.5)]">READY TO VIBE?</h2>
          <p className="text-nust-blue/80 max-w-xl mx-auto mb-8 text-lg">
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
              <Link href="/about" className="text-sm text-white/70 hover:text-nust-orange transition-colors">
                About
              </Link>
              <Link href="/privacy" className="text-sm text-white/70 hover:text-nust-orange transition-colors">
                Privacy
              </Link>
              <Link href="/contact" className="text-sm text-white/70 hover:text-nust-orange transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
