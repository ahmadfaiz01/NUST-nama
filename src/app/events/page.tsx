"use client";

import Link from "next/link";
import { useRef, useCallback, useEffect, useState } from "react";
import { EventCard } from "@/components/events/EventCard";
import { useInfiniteEvents } from "@/hooks/useInfiniteEvents";
import { usePostHog } from "posthog-js/react";
import {
    Sparkles,
    Laptop,
    Palette,
    Trophy,
    Briefcase,
    Film,
    GraduationCap,
    Wrench,
    Layers,
    Search,
    X,
    CalendarDays,
} from "lucide-react";

interface CategoryOption {
    name: string;
    icon: React.ElementType;
}

const EVENT_CATEGORIES: CategoryOption[] = [
    { name: "All", icon: Sparkles },
    { name: "Tech", icon: Laptop },
    { name: "Cultural", icon: Palette },
    { name: "Sports", icon: Trophy },
    { name: "Career", icon: Briefcase },
    { name: "Entertainment", icon: Film },
    { name: "Academic", icon: GraduationCap },
    { name: "Workshop", icon: Wrench },
    { name: "Other", icon: Layers },
];

const DATE_FILTERS = [
    { id: "all", label: "All Dates" },
    { id: "today", label: "Today" },
    { id: "tomorrow", label: "Tomorrow" },
    { id: "week", label: "This Week" },
] as const;

// ─── Sentinel component for IntersectionObserver ──────────────────────────────
function InfiniteScrollSentinel({ onIntersect, disabled }: { onIntersect: () => void; disabled: boolean }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (disabled) return;
        const observer = new IntersectionObserver(
            (entries) => { if (entries[0].isIntersecting) onIntersect(); },
            { rootMargin: "300px" }
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

    // Debounced search value — only passed to the hook after 400ms
    const [debouncedSearch, setDebouncedSearch] = useState("");
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            if (searchQuery.trim().length > 1) {
                posthog?.capture("events_searched", { query: searchQuery.trim() });
            }
        }, 400);
        return () => clearTimeout(t);
    }, [searchQuery, posthog]);

    // PostHog: fire when category/date filter changes
    useEffect(() => {
        if (selectedCategory !== "All") posthog?.capture("events_filtered", { filter_type: "category", value: selectedCategory });
    }, [selectedCategory, posthog]);
    useEffect(() => {
        if (dateFilter !== "all") posthog?.capture("events_filtered", { filter_type: "date", value: dateFilter });
    }, [dateFilter, posthog]);

    // ── Paginated data fetching via hook ─────────────────────────────────────
    const { events, isLoading, isLoadingMore, hasMore, loadMore } = useInfiniteEvents({
        category: selectedCategory,
        search: debouncedSearch,
        dateFilter,
    });

    const handleLoadMore = useCallback(() => loadMore(), [loadMore]);

    const isFiltered = selectedCategory !== "All" || searchQuery.trim().length > 0 || dateFilter !== "all";

    const clearAllFilters = () => {
        setSelectedCategory("All");
        setSearchQuery("");
        setDateFilter("all");
    };

    return (
        <div
            className="min-h-screen pb-20"
            style={{
                backgroundColor: "var(--cream)",
                backgroundImage: `linear-gradient(var(--nust-blue) 1px, transparent 1px), linear-gradient(90deg, var(--nust-blue) 1px, transparent 1px)`,
                backgroundSize: "100px 100px",
            }}
        >
            {/* Hero Banner */}
            <section className="py-10 bg-nust-blue">
                <div className="container">
                    <h1 className="text-5xl md:text-6xl text-white mb-2 drop-shadow-[4px_4px_0px_var(--nust-orange)] font-heading leading-tight">
                        DISCOVER EVENTS
                    </h1>
                    <p className="font-display text-white/70 text-lg md:text-xl max-w-2xl leading-normal">
                        From tech hackathons to sports matches, explore everything happening at NUST.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-8">
                <div className="container flex flex-col gap-6">

                    {/* Unified Search & Filters Bar */}
                    <div className="bg-white p-5 md:p-6 rounded-2xl border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)] flex flex-col gap-4">
                        {/* Top: Accessible Search Input + Date Filter Switcher */}
                        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                            <div className="relative flex-1">
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-nust-blue" aria-hidden="true" />
                                <input
                                    type="search"
                                    aria-label="Search events"
                                    placeholder="Search events by title, society, venue..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border-2 border-nust-blue bg-cream/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-nust-orange text-sm font-display text-nust-blue placeholder:text-nust-blue/50 transition-colors"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        aria-label="Clear search query"
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-nust-blue/60 hover:text-nust-blue p-1 cursor-pointer"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            {/* Date Filter Buttons */}
                            <div className="flex items-center gap-1.5 overflow-x-auto p-1" role="tablist" aria-label="Date filters">
                                {DATE_FILTERS.map((f) => {
                                    const active = dateFilter === f.id;
                                    return (
                                        <button
                                            key={f.id}
                                            type="button"
                                            role="tab"
                                            aria-selected={active}
                                            onClick={() => setDateFilter(f.id)}
                                            className={`px-3.5 py-1.5 rounded-full font-sans font-medium text-sm border-2 border-nust-blue transition-all cursor-pointer whitespace-nowrap ${
                                                active
                                                    ? "bg-nust-orange text-nust-blue font-semibold shadow-[2px_2px_0px_var(--nust-blue)]"
                                                    : "bg-white text-nust-blue shadow-[2px_2px_0px_var(--nust-blue)] hover:bg-cream hover:translate-y-[-1px]"
                                            }`}
                                        >
                                            {f.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Bottom: Clean Category Filter Pills */}
                        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-3 border-t-2 border-nust-blue/10 p-1" role="tablist" aria-label="Category filters">
                            {EVENT_CATEGORIES.map((cat) => {
                                const isActive = selectedCategory === cat.name;
                                return (
                                    <button
                                        key={cat.name}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        onClick={() => setSelectedCategory(cat.name)}
                                        className={`px-4 py-1.5 rounded-full font-sans font-medium text-sm border-2 border-nust-blue transition-all cursor-pointer ${
                                            isActive
                                                ? "bg-nust-blue text-white font-semibold shadow-[3px_3px_0px_var(--nust-orange)]"
                                                : "bg-white text-nust-blue shadow-[2px_2px_0px_var(--nust-blue)] hover:bg-cream hover:translate-y-[-1px]"
                                        }`}
                                    >
                                        {cat.name}
                                    </button>
                                );
                            })}

                            {isFiltered && (
                                <button
                                    type="button"
                                    onClick={clearAllFilters}
                                    className="text-xs font-sans font-semibold text-nust-blue/70 hover:text-nust-orange underline cursor-pointer px-2 py-1"
                                >
                                    Reset Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Results Count Bar */}
                    <div className="flex items-center justify-between px-1">
                        <p className="text-nust-blue font-display text-sm font-semibold">
                            {isLoading && events.length === 0
                                ? "Loading events..."
                                : `Showing ${events.length} event${events.length === 1 ? "" : "s"}${hasMore ? "+" : ""}`}
                        </p>
                    </div>

                    {/* Loading State */}
                    {isLoading && events.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-nust-blue" />
                            <p className="font-display text-sm text-nust-blue/60">Fetching events...</p>
                        </div>
                    ) : events.length === 0 ? (
                        /* Decluttered Empty State */
                        <div className="text-center py-16 px-6 bg-white rounded-2xl border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)] max-w-lg mx-auto w-full">
                            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-nust-orange/20 border-2 border-nust-blue flex items-center justify-center text-2xl shadow-[2px_2px_0px_var(--nust-blue)]">
                                📅
                            </div>
                            <h3 className="font-heading text-2xl text-nust-blue mb-2">NO EVENTS FOUND</h3>
                            <p className="font-display text-nust-blue/70 text-sm mb-6 leading-relaxed">
                                {isFiltered
                                    ? "No events match your current filter selection. Try resetting filters or searching for something else."
                                    : "No upcoming events posted right now. Check back soon or post an event yourself!"}
                            </p>
                            {isFiltered ? (
                                <button
                                    type="button"
                                    onClick={clearAllFilters}
                                    className="btn btn-primary text-sm py-2 px-5"
                                >
                                    Clear All Filters
                                </button>
                            ) : (
                                <Link href="/post-event" className="btn btn-primary text-sm py-2 px-5">
                                    Post an Event
                                </Link>
                            )}
                        </div>
                    ) : (
                        /* Events Grid */
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    )}

                    {/* Infinite Scroll Sentinel */}
                    <InfiniteScrollSentinel onIntersect={handleLoadMore} disabled={!hasMore || isLoadingMore} />

                    {/* Load More Indicator */}
                    {isLoadingMore && (
                        <div className="flex items-center justify-center py-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nust-blue" />
                        </div>
                    )}

                    {/* End of results */}
                    {!hasMore && events.length > 0 && !isLoading && (
                        <p className="text-center py-6 text-nust-blue/50 font-display text-sm">
                            🎉 You have seen all upcoming events!
                        </p>
                    )}
                </div>
            </section>
        </div>
    );
}
