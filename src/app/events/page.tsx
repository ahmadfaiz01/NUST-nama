"use client";

import Link from "next/link";
import { useRef, useCallback, useEffect, useState } from "react";
import { EventCard } from "@/components/events/EventCard";
import { useInfiniteEvents } from "@/hooks/useInfiniteEvents";
import { usePostHog } from "posthog-js/react";

const categories = ["All", "Tech", "Cultural", "Sports", "Career", "Entertainment", "Academic", "Workshop", "Other"];

// ─── Sentinel component for IntersectionObserver ──────────────────────────────
// When this div scrolls into view, it triggers loadMore()
function InfiniteScrollSentinel({ onIntersect, disabled }: { onIntersect: () => void; disabled: boolean }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (disabled) return;
        const observer = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) onIntersect(); },
            { rootMargin: "300px" } // Start loading 300px before the bottom
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [onIntersect, disabled]);

    return <div ref={ref} aria-hidden />;
}

// ─── Events Page ──────────────────────────────────────────────────────────────
export default function EventsPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [dateFilter, setDateFilter] = useState<"all" | "today" | "tomorrow" | "week">("all");
    const posthog = usePostHog();

    // Debounced search value — only passed to the hook after 500ms
    const [debouncedSearch, setDebouncedSearch] = useState("");
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            if (searchQuery.trim().length > 1) {
                posthog?.capture("events_searched", { query: searchQuery.trim() });
            }
        }, 500);
        return () => clearTimeout(t);
    }, [searchQuery, posthog]);

    // PostHog: fire when category/date filter changes
    useEffect(() => {
        if (selectedCategory !== "All") posthog?.capture("events_filtered", { filter_type: "category", value: selectedCategory });
    }, [selectedCategory, posthog]);
    useEffect(() => {
        if (dateFilter !== "all") posthog?.capture("events_filtered", { filter_type: "date", value: dateFilter });
    }, [dateFilter, posthog]);

    // ── Paginated data fetching via the new hook ──────────────────────────────
    const { events, isLoading, isLoadingMore, hasMore, loadMore } = useInfiniteEvents({
        category: selectedCategory,
        search: debouncedSearch,
        dateFilter,
    });

    const handleLoadMore = useCallback(() => loadMore(), [loadMore]);

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
                                    onClick={() => setDateFilter(filter.id as any)}
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
                            Showing {events.length} events{hasMore ? "+" : ""}
                        </p>
                    </div>

                    {/* Initial load spinner */}
                    {isLoading && events.length === 0 ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nust-blue"></div>
                        </div>
                    ) : events.length === 0 && !isLoading ? (
                        /* Empty State */
                        <div className="text-center py-20 bg-white/50 rounded-xl border-2 border-dashed border-nust-blue/20">
                            <div className="text-6xl mb-4 opacity-50">🕵️‍♂️</div>
                            <h3 className="text-2xl font-heading text-nust-blue mb-2">NO EVENTS FOUND</h3>
                            <p className="text-nust-blue/60 max-w-md mx-auto mb-8">
                                We couldn&apos;t find any events matching your filters. Try adjusting your search or category.
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
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {events.map((event, index) => (
                                    <div key={event.id} className="transform transition-all hover:-translate-y-2 duration-300">
                                        <EventCard event={event} index={index} />
                                    </div>
                                ))}
                            </div>

                            {/* Infinite scroll sentinel — triggers loadMore when scrolled into view */}
                            <InfiniteScrollSentinel
                                onIntersect={handleLoadMore}
                                disabled={!hasMore || isLoadingMore}
                            />

                            {/* Loading more spinner */}
                            {isLoadingMore && (
                                <div className="flex justify-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nust-blue"></div>
                                </div>
                            )}

                            {/* End of results */}
                            {!hasMore && events.length > 0 && (
                                <div className="text-center py-10 text-nust-blue/40 font-display text-sm uppercase tracking-widest">
                                    — You&apos;ve seen all {events.length} events —
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
