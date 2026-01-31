"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { EventCalendar } from "@/components/events/EventCalendar";

export default function CalendarPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from("events")
                .select("*, rsvps(count), checkins(count)");

            if (error) {
                console.error("Error loading calendar events:", error);
            } else {
                setEvents(data || []);
            }
            setLoading(false);
        };
        fetchEvents();
    }, []);

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: "var(--cream)",
                backgroundImage: `linear-gradient(var(--nust-blue) 1px, transparent 1px), linear-gradient(90deg, var(--nust-blue) 1px, transparent 1px)`,
                backgroundSize: "100px 100px",
            }}
        >
            {/* Header */}
            <section className="py-12 bg-nust-blue">
                <div className="container">
                    <h1 className="text-4xl md:text-6xl text-white drop-shadow-[4px_4px_0px_var(--nust-orange)]">
                        EVENT CALENDAR
                    </h1>
                    <p className="font-display text-white/70 text-lg mt-2">
                        Plan ahead • Never miss an event
                    </p>
                </div>
            </section>

            {/* Calendar */}
            <section className="py-12">
                <div className="container">
                    {loading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nust-blue"></div>
                        </div>
                    ) : (
                        <EventCalendar
                            events={events.map(e => ({
                                ...e,
                                rsvp_count: e.rsvps?.[0]?.count || 0,
                                checkin_count: e.checkins?.[0]?.count || 0
                            }))}
                        />
                    )}
                </div>
            </section>
        </div>
    );
}
