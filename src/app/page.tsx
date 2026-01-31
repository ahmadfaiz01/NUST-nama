"use client";

import Link from "next/link";
import { CampusHeatmap } from "@/components/events/CampusHeatmap";
import { EventCard } from "@/components/events/EventCard";

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

            {/* Hero Section */}
            <section
                className="relative pt-20 pb-28"
                style={{
                    backgroundImage: `linear-gradient(var(--nust-blue) 1px, transparent 1px), linear-gradient(90deg, var(--nust-blue) 1px, transparent 1px)`,
                    backgroundSize: "100px 100px",
                }}
            >
                {/* Decorative B&W Images */}
                <div className="absolute top-10 left-0 md:left-10 w-48 md:w-64 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 hidden lg:block rotate-3 pointer-events-none">
                    <img src="/images/nust_building_1.png" alt="NUST H-12" className="rounded-xl border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)]" />
                </div>
                <div className="absolute bottom-10 right-0 md:right-10 w-48 md:w-64 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 hidden lg:block -rotate-6 pointer-events-none">
                    <img src="/images/nust_building_2.png" alt="NUST Aerial" className="rounded-xl border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)]" />
                </div>
                <div className="container relative z-10">
                    <div className="max-w-5xl mx-auto text-center">

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

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                            <Link href="/events" className="btn btn-primary text-xl px-10 py-4 shadow-[6px_6px_0px_var(--nust-orange)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all">
                                Explore Events
                            </Link>
                            <Link href="/auth?mode=signup" className="btn btn-outline text-xl px-10 py-4 hover:bg-nust-blue hover:text-white transition-all">
                                Join the Vibe
                            </Link>
                        </div>

                        <div className="animate-bounce mt-8">
                            <p className="font-heading text-lg text-nust-blue/70 mb-2">CHECK OUT WHAT&apos;S HOT</p>
                            <svg className="w-8 h-8 mx-auto text-nust-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </div>
                    </div>
                </div>
            </section>

            {/* What's Hot Section */}
            <section className="py-20 bg-white" id="whats-hot">
                <div className="container">
                    <div className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                        <div>
                            <h2 className="text-5xl md:text-6xl text-nust-blue mb-2">WHAT&apos;S HOT 🔥</h2>
                            <p className="font-display text-lg text-nust-blue/60 uppercase tracking-widest">
                                Live Activity @ NUST H-12
                            </p>
                        </div>
                        <p className="text-sm text-nust-blue/50 max-w-xs md:text-right font-display">
                            Real-time activity based on check-ins and social mentions
                        </p>
                    </div>

                    <CampusHeatmap />
                </div>
            </section>

            {/* Popular Events with Overlayed Tapes */}
            <div className="relative">
                {/* Top Tape */}
                <div className="absolute top-0 left-0 right-0 z-20 bg-nust-orange py-3 border-y-2 border-nust-blue overflow-hidden transform -rotate-1 scale-110 origin-left shadow-md">
                    <div className="animate-marquee flex gap-16 whitespace-nowrap">
                        <span className="font-heading text-xl text-nust-blue tracking-widest">
                            WHATS UP NUST • LIVE VIBES • CAMPUS EVENTS • DONT MISS OUT • SEECS TECH FEST •
                        </span>
                        <span className="font-heading text-xl text-nust-blue tracking-widest">
                            WHATS UP NUST • LIVE VIBES • CAMPUS EVENTS • DONT MISS OUT • SEECS TECH FEST •
                        </span>
                    </div>
                </div>

                <section
                    className="pt-24 pb-24 relative"
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

                {/* Bottom Tape - Overlays Footer (Extreme overlap) */}
                <div className="absolute -bottom-16 left-0 right-0 z-[100] bg-nust-orange py-3 border-y-2 border-nust-blue overflow-hidden transform rotate-1 scale-110 origin-right shadow-[0px_-4px_10px_rgba(0,0,0,0.1)] pointer-events-none">
                    <div className="animate-marquee flex gap-16 whitespace-nowrap">
                        <span className="font-heading text-xl text-nust-blue tracking-widest">
                            • DONT MISS OUT • JOIN THE COMMUNITY • RSVP NOW • DONT MISS OUT • JOIN THE COMMUNITY •
                        </span>
                        <span className="font-heading text-xl text-nust-blue tracking-widest">
                            • DONT MISS OUT • JOIN THE COMMUNITY • RSVP NOW • DONT MISS OUT • JOIN THE COMMUNITY •
                        </span>
                    </div>
                </div>
            </div>

        </div>
    );
}
