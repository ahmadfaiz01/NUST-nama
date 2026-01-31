"use client";

import Link from "next/link";
import { CampusHeatmap } from "@/components/events/CampusHeatmap";
import { EventCard } from "@/components/events/EventCard";

// Using just a subset for the home page to keep it clean
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
        title: "Cultural Night: Rang-e-Tehzeeb",
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
        tags: ["Career", "Networking"],
        is_official: true,
        rsvp_count: 456,
        checkin_count: 0,
        sentiment: null,
    },
    {
        id: "5",
        title: "AI/ML Workshop Series",
        description: "Hands-on workshops covering machine learning fundamentals.",
        start_time: "2026-02-12T14:00:00",
        end_time: "2026-02-12T18:00:00",
        venue_name: "RCMS Lab 3",
        tags: ["Workshop", "AI"],
        is_official: true,
        rsvp_count: 120,
        checkin_count: 0,
        sentiment: null,
    },
];

export default function HomePage() {
    return (
        <div className="min-h-screen overflow-hidden bg-cream">

            {/* 
        TAPE DESIGN (Part 1):
        Angled tape at top.
        User wanted these aligned. I'll make them parallel (both rotate-2).
      */}
            <div className="bg-nust-orange py-3 border-b-2 border-nust-blue overflow-hidden transform rotate-1 origin-left scale-110 relative z-20 shadow-md">
                <div className="animate-marquee flex gap-16 whitespace-nowrap">
                    <span className="font-heading text-xl text-nust-blue tracking-widest">
                        WHATS UP NUST • LIVE VIBES • CAMPUS EVENTS • DONT MISS OUT • SEECS TECH FEST • WHATS UP NUST • LIVE VIBES •
                    </span>
                    <span className="font-heading text-xl text-nust-blue tracking-widest">
                        • CAMPUS EVENTS • DONT MISS OUT • SEECS TECH FEST • WHATS UP NUST • LIVE VIBES •
                    </span>
                </div>
            </div>

            {/* Hero Section */}
            <section
                className="relative pt-20 pb-20"
                style={{
                    // Grid background restored
                    backgroundImage: `linear-gradient(var(--nust-blue) 1px, transparent 1px), linear-gradient(90deg, var(--nust-blue) 1px, transparent 1px)`,
                    backgroundSize: "100px 100px",
                }}
            >
                <div className="container relative z-10">
                    <div className="max-w-5xl mx-auto text-center">

                        <div className="absolute top-0 left-10 hidden md:block animate-bounce-slow">
                            {/* Decorative elements */}
                            <div className="w-16 h-16 bg-nust-blue rounded-full opacity-10"></div>
                        </div>

                        {/* Sticker Badge */}
                        <div className="absolute top-0 right-0 md:right-20 animate-float hidden md:block">
                            <div className="w-24 h-24 bg-nust-orange rounded-full border-2 border-nust-blue flex items-center justify-center rotate-12 shadow-[4px_4px_0px_var(--nust-blue)]">
                                <span className="font-heading text-nust-blue text-center leading-none text-sm">Gen Z<br />Approved</span>
                            </div>
                        </div>

                        <h1 className="text-6xl md:text-8xl lg:text-9xl text-nust-blue mb-6 leading-[0.85] drop-shadow-[4px_4px_0px_rgba(229,149,0,0.5)]">
                            YOUR CAMPUS<br />
                            <span className="text-stroke" style={{ WebkitTextStroke: "2px var(--nust-blue)", color: "transparent" }}>INTELLIGENCE</span><br />
                            PLATFORM
                        </h1>

                        <p className="text-xl md:text-2xl text-nust-blue/80 max-w-2xl mx-auto mb-10 font-display font-medium">
                            Real-time events, crowd sentiment, and social vibes. <br />
                            <span className="bg-nust-orange/20 px-2 rounded-lg -rotate-1 inline-block border border-nust-orange/50 mt-2">
                                All in one place.
                            </span>
                        </p>

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

            {/* 
        TAPE DESIGN (Part 2):
        The content in between these tapes will look "tilted" or framed.
        Blue tape with news.
      */}
            <div className="bg-nust-blue py-3 border-y-4 border-nust-orange overflow-hidden relative z-20 transform -rotate-1 scale-105 origin-right">
                <div className="animate-marquee flex gap-16 whitespace-nowrap">
                    <span className="font-heading text-xl text-white tracking-widest flex items-center gap-4">
                        <span className="text-nust-orange">📢</span> MESS CHALLAN IS UP
                        <span className="text-nust-orange">•</span> LIBRARY EXTENDED HOURS THIS WEEK
                        <span className="text-nust-orange">•</span> SEECS TECH FEST REGISTRATIONS OPEN
                        <span className="text-nust-orange">•</span> SEMESTER RESULTS ANNOUNCED
                    </span>
                    <span className="font-heading text-xl text-white tracking-widest flex items-center gap-4">
                        <span className="text-nust-orange">📢</span> MESS CHALLAN IS UP
                        <span className="text-nust-orange">•</span> LIBRARY EXTENDED HOURS THIS WEEK
                        <span className="text-nust-orange">•</span> SEECS TECH FEST REGISTRATIONS OPEN
                    </span>
                </div>
            </div>

            {/* 
        WHAT'S HOT (Real Map)
        Kept on homepage as requested.
     */}
            <section className="py-20 relative bg-cream">
                <div className="container">
                    <div className="mb-10 flex items-end justify-between">
                        <div>
                            <h2 className="text-5xl md:text-6xl text-nust-blue mb-2">WHAT&apos;S HOT 🔥</h2>
                            <p className="font-display text-lg text-nust-blue/60 uppercase tracking-widest">
                                Live Heatmap @ NUST H-12
                            </p>
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm text-nust-blue/50 max-w-xs text-right">
                                Real-time activity based on check-ins and social mentions.
                            </p>
                        </div>
                    </div>

                    {/* The Real Leaflet Map */}
                    <CampusHeatmap />
                </div>
            </section>

            {/* 
        POPULAR EVENTS
        Dark background + Orange Grid (User Request)
      */}
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
                            <p className="font-display text-lg text-white/70 uppercase tracking-widest">Trending this week</p>
                        </div>
                        <Link href="/events" className="btn bg-nust-orange text-nust-blue font-bold text-sm py-2 px-6 shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
                            View All Events
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredEvents.map((event, index) => (
                            <div key={event.id} className={`transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-transform duration-300`}>
                                <EventCard event={event} index={index} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 
         TAPE DESIGN (Part 3):
         Bottom orange tape. Aligned similar to top (parallel) or symmetrical.
         User said "make its angle aligned to the lower tape so that section looks a bit tilted".
         If top was rotate-1, let's make this rotate-1 too (parallel lines).
      */}
            <div className="bg-nust-orange py-2 border-y-2 border-nust-blue overflow-hidden transform rotate-1 scale-110 origin-right relative z-20">
                <div className="animate-marquee flex gap-16 whitespace-nowrap">
                    <span className="font-heading text-xl text-nust-blue tracking-widest">
                        • DONT MISS OUT • JOIN THE COMMUNITY • RSVP NOW • DONT MISS OUT • JOIN THE COMMUNITY • RSVP NOW •
                    </span>
                    <span className="font-heading text-xl text-nust-blue tracking-widest">
                        • DONT MISS OUT • JOIN THE COMMUNITY • RSVP NOW • DONT MISS OUT • JOIN THE COMMUNITY • RSVP NOW •
                    </span>
                </div>
            </div>

            {/* Footer is below this, in Layout or we can add minimal footer here if Layout is too generic */}
            <footer className="py-12 bg-cream">
                <div className="container text-center">
                    <p className="text-nust-blue/50 font-display text-sm">
                        What's Up NUST • Campus Intelligence Platform
                    </p>
                </div>
            </footer>

        </div>
    );
}
