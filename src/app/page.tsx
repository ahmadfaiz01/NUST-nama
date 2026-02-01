"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CampusHeatmap } from "@/components/events/CampusHeatmap";
import { EventCard } from "@/components/events/EventCard";

export default function HomePage() {
    const [featuredEvents, setFeaturedEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("events")
                .select("*, rsvps(count), checkins(count)")
                .gte("start_time", new Date().toISOString())
                .order("start_time", { ascending: true })
                .limit(4);

            if (error) {
                console.error("Error loading featured events:", error);
            } else {
                setFeaturedEvents(data || []);
            }
            setLoading(false);
        };
        fetchFeatured();
    }, []);

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
                {/* Decorative Hero Images (Static for now, could be dynamic later) */}
                <div className="absolute top-10 -left-16 md:-left-5 w-56 md:w-80 grayscale hover:grayscale-0 transition-all duration-500 hidden lg:block rotate-12 pointer-events-none z-0">
                    <img src="/images/hero_badminton.jpg" alt="Sports at NUST" className="rounded-xl border-4 border-nust-blue shadow-[8px_8px_0px_var(--nust-blue)] aspect-[3/4] object-cover bg-white" />
                </div>
                <div className="absolute bottom-10 -left-10 md:left-10 w-64 md:w-96 grayscale hover:grayscale-0 transition-all duration-500 hidden lg:block -rotate-6 pointer-events-none z-0">
                    <img src="/images/hero_aerial_1.jpg" alt="Campus Aerial" className="rounded-xl border-4 border-nust-blue shadow-[8px_8px_0px_var(--nust-blue)] bg-white" />
                </div>
                <div className="absolute top-5 -right-16 md:-right-5 w-64 md:w-96 grayscale hover:grayscale-0 transition-all duration-500 hidden lg:block -rotate-3 pointer-events-none z-0">
                    <img src="/images/hero_concert.jpg" alt="Concert Vibes" className="rounded-xl border-4 border-nust-blue shadow-[8px_8px_0px_var(--nust-blue)] bg-white" />
                </div>
                <div className="absolute -bottom-5 -right-10 md:-right-10 w-56 md:w-80 grayscale hover:grayscale-0 transition-all duration-500 hidden lg:block rotate-6 pointer-events-none z-0">
                    <img src="/images/hero_aerial_2.jpg" alt="NUST Wide Shot" className="rounded-xl border-4 border-nust-blue shadow-[8px_8px_0px_var(--nust-blue)] bg-white" />
                </div>
                <div className="container relative z-10">
                    <div className="max-w-4xl mx-auto text-center">

                        <div className="absolute top-0 right-0 md:right-20 animate-float hidden md:block">
                            <div className="w-24 h-24 bg-nust-orange rounded-full border-2 border-nust-blue flex items-center justify-center rotate-12 shadow-[4px_4px_0px_var(--nust-blue)]">
                                <span className="font-heading text-nust-blue text-center leading-none text-sm">Gen Z<br />Approved</span>
                            </div>
                        </div>

                        <h1 className="text-7xl md:text-9xl lg:text-[10rem] text-nust-blue mb-6 leading-[0.8] drop-shadow-[4px_4px_0px_rgba(229,149,0,0.5)] transform -rotate-1">
                            CAMPUS LIFE.<br />
                            <span className="text-stroke text-white" style={{ WebkitTextStroke: "3px var(--nust-blue)" }}>UNFILTERED.</span>
                        </h1>

                        <p className="text-xl md:text-2xl text-nust-blue/80 max-w-2xl mx-auto mb-10 font-display font-medium leading-relaxed">
                            Realtime vibes, spotted events, and zero FOMO. <br />
                            <span className="bg-nust-orange px-2 py-1 transform -rotate-2 inline-block border-2 border-nust-blue text-white font-bold mt-2 shadow-[4px_4px_0px_var(--nust-blue)]">
                                Literally everything happening at NUST.
                            </span>
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                            <Link href="/events" className="btn btn-primary text-xl px-12 py-5 shadow-[8px_8px_0px_var(--nust-orange)] hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px] transition-all font-heading tracking-wider border-2 border-nust-blue">
                                FIND THE VIBE
                            </Link>
                            <Link href="/auth?mode=signup" className="btn btn-outline text-xl px-12 py-5 hover:text-white transition-all font-heading tracking-wider border-2 border-nust-blue bg-white shadow-[8px_8px_0px_rgba(0,0,0,0.1)] hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_var(--nust-blue)] hover:bg-nust-blue">
                                JOIN THE SQUAD
                            </Link>
                        </div>

                        <div className="animate-bounce mt-8">
                            <p className="font-heading text-lg text-nust-blue/70 mb-2">CHECK OUT WHAT'S HOT</p>
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
                            <h2 className="text-5xl md:text-6xl text-nust-blue mb-2">WHAT'S HOT 🔥</h2>
                            <p className="font-display text-lg text-nust-blue/60 uppercase tracking-widest">
                                Live Activity @ NUST H-12
                            </p>
                        </div>
                        <p className="text-sm text-nust-blue/50 max-w-xs md:text-right font-display">
                            Real-time activity based on events and locations.
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

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {featuredEvents.map((event, index) => (
                                    <div key={event.id} className={`transform ${index % 2 === 0 ? 'rotate-1' : '-rotate-1'} hover:rotate-0 transition-transform duration-300`}>
                                        <EventCard
                                            event={{
                                                ...event,
                                                rsvp_count: event.rsvps?.[0]?.count || 0,
                                                checkin_count: event.checkins?.[0]?.count || 0
                                            }}
                                            index={index}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Bottom Tape */}
                {/* Bottom Tape Removed (moved to Footer) */}
            </div>

        </div>
    );
}
