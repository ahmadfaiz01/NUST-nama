"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import EventMap from "@/components/events/EventMap";
import RSVPButton from "@/components/social/RSVPButton";
import CheckInButton from "@/components/events/CheckInButton";

interface Event {
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    venue_name: string;
    venue_lat: number | null;
    venue_lng: number | null;
    tags: string[];
    is_official: boolean;
    poster_url: string | null;
    registration_url: string | null;
    created_by: string;
    // Relationships
    profiles?: { name: string; avatar_url: string };
    rsvps: { count: number }[];
    checkins: { count: number }[];
}

export default function EventDetailPage() {
    const { id } = useParams();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        setLoading(true);
        console.log("Fetching event for ID:", id); // DEBUG

        if (!id) {
            setError("No event ID provided.");
            setLoading(false);
            return;
        }

        const supabase = createClient();

        const { data, error } = await supabase
            .from("events")
            .select(`
                *,
                profiles:created_by (name, avatar_url),
                rsvps (count),
                checkins (count)
            `)
            .eq("id", id)
            .single();

        if (error) {
            console.error("Error fetching event:", error);
            setError("Event not found or failed to load. " + error.message);
        } else {
            setEvent(data);
        }
        setLoading(false);
    };

    if (loading) return (
        <div className="min-h-screen bg-cream flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nust-blue"></div>
        </div>
    );

    if (error || !event) return (
        <div className="min-h-screen bg-cream flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-4xl font-heading text-nust-blue mb-4">404 - EVENT NOT FOUND</h1>
            <p className="text-gray-500 mb-6">{error}</p>
            <Link href="/events" className="btn btn-primary">Back to Events</Link>
        </div>
    );

    // Date formatting
    const startDate = new Date(event.start_time);
    const endDate = event.end_time ? new Date(event.end_time) : null;

    return (
        <div className="min-h-screen bg-cream pb-20">
            {/* Hero / Header */}
            <div className="bg-nust-blue text-white py-12 relative overflow-hidden">
                <div className="container relative z-10">
                    <Link href="/events" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors font-display text-sm font-bold uppercase tracking-wider">
                        ← Back to Feed
                    </Link>

                    <h1 className="text-4xl md:text-6xl font-heading mb-4 drop-shadow-[4px_4px_0px_var(--nust-orange)]">
                        {event.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-lg font-display opacity-90">
                        <span className="bg-white/10 px-3 py-1 rounded border border-white/20">
                            📅 {startDate.toLocaleDateString("en-US", { weekday: 'short', month: 'long', day: 'numeric' })}
                        </span>
                        <span className="bg-white/10 px-3 py-1 rounded border border-white/20">
                            ⏰ {startDate.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' })}
                            {endDate && ` - ${endDate.toLocaleTimeString("en-US", { hour: 'numeric', minute: '2-digit' })}`}
                        </span>
                    </div>
                </div>

                {/* Background pattern */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-nust-orange/10 transform skew-x-12"></div>
            </div>

            <div className="container -mt-8 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content (Left Col) */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Poster Image */}
                        {event.poster_url ? (
                            <div className="rounded-xl overflow-hidden border-4 border-white shadow-xl bg-gray-100">
                                <img src={event.poster_url} alt={event.title} className="w-full h-auto max-h-[500px] object-contain bg-black/5" />
                            </div>
                        ) : (
                            <div className="h-64 rounded-xl border-4 border-white shadow-xl bg-nust-blue/5 flex items-center justify-center">
                                <span className="text-nust-blue/30 font-display text-xl uppercase font-bold">No Poster Available</span>
                            </div>
                        )}

                        {/* Description */}
                        <div className="bg-white rounded-xl p-8 border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)]">
                            <h2 className="font-heading text-2xl text-nust-blue mb-4 flex items-center gap-2">
                                📝 Event Details
                            </h2>
                            <p className="text-gray-600 whitespace-pre-line leading-relaxed text-lg">
                                {event.description}
                            </p>

                            {/* Tags */}
                            <div className="mt-6 flex flex-wrap gap-2">
                                {event.tags?.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-nust-blue/5 text-nust-blue rounded-full text-sm font-bold border border-nust-blue/10">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Sidebar (Right Col) */}
                    <div className="space-y-6">

                        {/* Action Card */}
                        <div className="bg-white rounded-xl p-6 border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)] sticky top-24">

                            {/* Venue & Map */}
                            <div className="mb-6">
                                <h3 className="font-bold text-nust-blue uppercase text-sm mb-2">Location</h3>
                                <p className="text-xl mb-4 text-gray-800">📍 {event.venue_name}</p>

                                {event.venue_lat && event.venue_lng ? (
                                    <EventMap lat={event.venue_lat} lng={event.venue_lng} venueName={event.venue_name} />
                                ) : (
                                    <div className="bg-gray-100 p-4 rounded text-center text-gray-500 text-sm italic">
                                        Map not available for this venue
                                    </div>
                                )}
                            </div>

                            {/* Registration Button */}
                            {event.registration_url && (
                                <a
                                    href={event.registration_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary w-full justify-center mb-3"
                                >
                                    Register Now ↗
                                </a>
                            )}

                            {/* RSVP Button */}
                            <RSVPButton
                                eventId={event.id}
                                initialCount={event.rsvps?.[0]?.count || 0}
                            />

                            {/* Live Check-in Button */}
                            <div className="mt-4">
                                <CheckInButton
                                    eventId={event.id}
                                    venueLat={event.venue_lat}
                                    venueLng={event.venue_lng}
                                    initialCount={event.checkins?.[0]?.count || 0}
                                />
                            </div>

                            {/* Organizer */}
                            <div className="mt-6 pt-6 border-t border-gray-100 flex items-center gap-3">
                                {event.profiles?.avatar_url ? (
                                    <img src={event.profiles.avatar_url} alt="" className="w-10 h-10 rounded-full" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-nust-blue/10 flex items-center justify-center text-nust-blue font-bold">
                                        {event.profiles?.name?.[0] || "?"}
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Hosted by</p>
                                    <p className="font-medium text-nust-blue">{event.profiles?.name || "Anonymous Student"}</p>
                                </div>
                            </div>

                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
