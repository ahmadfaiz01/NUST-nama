"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { EventCard } from "@/components/events/EventCard";

const categories = ["All", "Tech", "Cultural", "Sports", "Career", "Entertainment", "Academic", "Workshop", "Other"];

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [dateFilter, setDateFilter] = useState("all"); // 'all', 'today', 'tomorrow', 'week'

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchEvents();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory, dateFilter]);

    const fetchEvents = async () => {
        setLoading(true);
        const supabase = createClient();

        let query = supabase
            .from("events")
            .select(`
                *,
                rsvps (count),
                checkins (count)
            `)
            .order("start_time", { ascending: true });

        // Date Filtering
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // 00:00 today

        if (dateFilter === "today") {
            const endOfToday = new Date(startOfToday);
            endOfToday.setDate(endOfToday.getDate() + 1);
            query = query.gte("start_time", startOfToday.toISOString()).lt("start_time", endOfToday.toISOString());
        } else if (dateFilter === "tomorrow") {
            const startOfTomorrow = new Date(startOfToday);
            startOfTomorrow.setDate(startOfTomorrow.getDate() + 1);
            const endOfTomorrow = new Date(startOfTomorrow);
            endOfTomorrow.setDate(endOfTomorrow.getDate() + 1);
            query = query.gte("start_time", startOfTomorrow.toISOString()).lt("start_time", endOfTomorrow.toISOString());
        } else if (dateFilter === "week") {
            const endOfWeek = new Date(startOfToday);
            endOfWeek.setDate(endOfWeek.getDate() + 7);
            query = query.gte("start_time", startOfToday.toISOString()).lt("start_time", endOfWeek.toISOString());
        } else {
            // Default: All future events from now
            query = query.gte("start_time", new Date().toISOString());
        }

        // Category Filtering
        if (selectedCategory !== "All") {
            query = query.contains("tags", [selectedCategory]);
        }

        // Text Search
        if (searchQuery.trim()) {
            query = query.ilike("title", `%${searchQuery.trim()}%`);
            // Note: simple OR queries can be tricky with other filters in basic Supabase client, keeping it simple to Title for now.
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching events:", error);
        } else {
            setEvents(data || []);
        }
        setLoading(false);
    };

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: "var(--cream)",
                backgroundImage: `linear-gradient(var(--nust-blue) 1px, transparent 1px), linear-gradient(90deg, var(--nust-blue) 1px, transparent 1px)`,
                backgroundSize: "100px 100px",
            }}
        >
            {/* Hero Banner */}
            <section className="py-12 bg-nust-blue transition-all duration-500 ease-in-out">
                <div className="container">
                    <h1 className="text-5xl md:text-7xl text-white mb-4 drop-shadow-[4px_4px_0px_var(--nust-orange)] font-heading">
                        DISCOVER EVENTS
                    </h1>
                    <p className="font-display text-white/70 text-xl max-w-2xl mt-2">
                        From tech talks to cultural nights, find everything happening at NUST.
                    </p>
                </div>
            </section>

            {/* Filters Section (Sticky) */}
            <section className="py-4 border-b-2 border-nust-blue bg-white sticky top-20 z-40 shadow-sm">
                <div className="container space-y-4">

                    {/* Top Row: Search & Date */}
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-lg">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-nust-blue bg-cream/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-nust-orange transition-all font-display placeholder:text-nust-blue/40"
                            />
                        </div>

                        {/* Date Filter */}
                        <div className="flex bg-gray-100 p-1 rounded-full border-2 border-transparent">
                            {[
                                { id: "all", label: "All Upcoming" },
                                { id: "today", label: "Today" },
                                { id: "tomorrow", label: "Tomorrow" },
                                { id: "week", label: "This Week" }
                            ].map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setDateFilter(filter.id)}
                                    className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${dateFilter === filter.id
                                            ? "bg-white text-nust-blue shadow-sm border border-gray-200"
                                            : "text-gray-500 hover:text-nust-blue"
                                        }`}
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bottom Row: Categories */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-full font-heading text-lg border-2 transition-all whitespace-nowrap ${selectedCategory === cat
                                        ? "bg-nust-blue text-white border-nust-blue"
                                        : "bg-white text-nust-blue border-nust-blue hover:bg-nust-blue hover:text-white"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                </div>
            </section>

            {/* Events Grid */}
            <section className="py-12">
                <div className="container">
                    <div className="flex items-center justify-between mb-8">
                        <p className="text-nust-blue/60 font-display uppercase tracking-widest font-bold">
                            Showing {events.length} events
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nust-blue"></div>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-20 bg-white/50 rounded-xl border-2 border-dashed border-nust-blue/20">
                            <div className="text-6xl mb-4 opacity-50">🕵️‍♂️</div>
                            <h3 className="text-2xl font-heading text-nust-blue mb-2">NO EVENTS FOUND</h3>
                            <p className="text-nust-blue/60 max-w-md mx-auto mb-8">
                                We couldn't find any events matching your filters. Try adjusting your search or category.
                            </p>
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => { setSearchQuery(""); setDateFilter("all"); setSelectedCategory("All"); }}
                                    className="btn btn-outline"
                                >
                                    Clear Filters
                                </button>
                                <Link href="/post-event" className="btn btn-primary">
                                    Post an Event
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {events.map((event, index) => (
                                <div key={event.id} className={`transform transition-all hover:-translate-y-2 duration-300`}>
                                    <EventCard
                                        event={{
                                            ...event,
                                            rsvp_count: event.rsvps?.[0]?.count || 0,
                                            checkin_count: event.checkins?.[0]?.count || 0,
                                        }}
                                        index={index}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
