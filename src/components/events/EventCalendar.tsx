"use client";

import { useState } from "react";
import Link from "next/link";

interface Event {
    id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    venue_name: string;
    tags: string[];
    is_official: boolean;
    rsvp_count: number;
    checkin_count: number;
    sentiment: "pos" | "neu" | "neg" | null;
}

interface EventCalendarProps {
    events: Event[];
}

export function EventCalendar({ events }: EventCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    // Get events for a specific date
    const getEventsForDate = (date: Date) => {
        return events.filter(event => {
            const eventDate = new Date(event.start_time);
            return (
                eventDate.getDate() === date.getDate() &&
                eventDate.getMonth() === date.getMonth() &&
                eventDate.getFullYear() === date.getFullYear()
            );
        });
    };

    // Generate calendar days
    const calendarDays = [];

    // Empty cells for days before the first day of month
    for (let i = 0; i < startingDayOfWeek; i++) {
        calendarDays.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(new Date(year, month, day));
    }

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
        setSelectedDate(null);
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
        setSelectedDate(null);
    };

    const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar */}
            <div className="bg-white border-2 border-nust-blue rounded-xl p-6 shadow-[4px_4px_0px_var(--nust-blue)]">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={prevMonth}
                        className="w-10 h-10 rounded-full border-2 border-nust-blue text-nust-blue hover:bg-nust-blue hover:text-white transition-colors flex items-center justify-center"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <h3 className="font-heading text-2xl text-nust-blue">{monthName.toUpperCase()}</h3>
                    <button
                        onClick={nextMonth}
                        className="w-10 h-10 rounded-full border-2 border-nust-blue text-nust-blue hover:bg-nust-blue hover:text-white transition-colors flex items-center justify-center"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                        <div key={day} className="text-center font-display text-xs text-nust-blue/60 uppercase py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((date, index) => {
                        if (!date) {
                            return <div key={`empty-${index}`} className="aspect-square" />;
                        }

                        const dayEvents = getEventsForDate(date);
                        const isToday = date.toDateString() === new Date().toDateString();
                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                        const hasEvents = dayEvents.length > 0;

                        return (
                            <button
                                key={date.toISOString()}
                                onClick={() => setSelectedDate(date)}
                                className={`aspect-square rounded-lg border-2 flex flex-col items-center justify-center transition-all relative ${isSelected
                                        ? "bg-nust-blue text-white border-nust-blue"
                                        : isToday
                                            ? "bg-nust-orange/20 border-nust-orange text-nust-blue"
                                            : hasEvents
                                                ? "border-nust-blue hover:bg-nust-blue/10"
                                                : "border-transparent hover:border-nust-blue/30"
                                    }`}
                            >
                                <span className={`font-heading text-lg ${isSelected ? 'text-white' : 'text-nust-blue'}`}>
                                    {date.getDate()}
                                </span>
                                {hasEvents && (
                                    <div className="flex gap-0.5 mt-1">
                                        {dayEvents.slice(0, 3).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-nust-orange' : 'bg-nust-orange'}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Selected Date Events */}
            <div className="bg-white border-2 border-nust-blue rounded-xl p-6 shadow-[4px_4px_0px_var(--nust-blue)]">
                {selectedDate ? (
                    <>
                        <h3 className="font-heading text-2xl text-nust-blue mb-4">
                            {selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }).toUpperCase()}
                        </h3>

                        {selectedEvents.length > 0 ? (
                            <div className="space-y-4">
                                {selectedEvents.map(event => {
                                    const time = new Date(event.start_time).toLocaleTimeString("en-US", {
                                        hour: "numeric",
                                        minute: "2-digit",
                                        hour12: true,
                                    });

                                    return (
                                        <Link
                                            key={event.id}
                                            href={`/events/${event.id}`}
                                            className="block p-4 bg-cream rounded-lg border-2 border-nust-blue hover:shadow-[4px_4px_0px_var(--nust-blue)] hover:-translate-y-1 transition-all"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-display text-sm text-nust-orange font-bold">{time}</p>
                                                    <h4 className="font-heading text-xl text-nust-blue">{event.title}</h4>
                                                    <p className="font-display text-sm text-nust-blue/60 mt-1">📍 {event.venue_name}</p>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-nust-blue/60">
                                                    <span>👥</span>
                                                    <span>{event.rsvp_count}</span>
                                                </div>
                                            </div>
                                            {event.is_official && (
                                                <span className="inline-block mt-2 px-2 py-1 bg-nust-blue text-white text-xs font-bold rounded">
                                                    OFFICIAL
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-5xl mb-4">📅</div>
                                <p className="font-display text-nust-blue/60">No events scheduled for this day</p>
                                <Link href="/post-event" className="btn btn-primary mt-4">
                                    Post an Event
                                </Link>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-5xl mb-4">👆</div>
                        <p className="font-heading text-2xl text-nust-blue mb-2">SELECT A DATE</p>
                        <p className="font-display text-nust-blue/60">Click on a date to see events</p>
                    </div>
                )}
            </div>
        </div>
    );
}
