"use client";

import Link from "next/link";
import { useState } from "react";

// Mock user data
const mockUser = {
    name: "Ahmed Hassan",
    email: "bcsf21m001@seecs.edu.pk",
    school: "SEECS",
    avatar: null,
    joinedDate: "2024-09-15",
    eventsAttended: 23,
    eventsPosted: 5,
    rsvpCount: 12,
};

// Mock posted events
const myEvents = [
    {
        id: "101",
        title: "SEECS Study Group",
        date: "2026-02-05",
        status: "approved",
        rsvpCount: 15,
    },
    {
        id: "102",
        title: "Coding Workshop",
        date: "2026-02-12",
        status: "pending",
        rsvpCount: 0,
    },
    {
        id: "103",
        title: "Basketball Meetup",
        date: "2026-01-28",
        status: "approved",
        rsvpCount: 8,
    },
];

// Mock RSVPs
const myRsvps = [
    {
        id: "1",
        title: "SEECS Tech Fest 2026",
        date: "2026-02-15",
        venue: "SEECS Auditorium",
    },
    {
        id: "3",
        title: "Career Fair 2026",
        date: "2026-02-20",
        venue: "Convention Center",
    },
];

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<"rsvps" | "events" | "settings">("rsvps");

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            approved: "bg-green-500 text-white",
            pending: "bg-yellow-500 text-nust-blue",
            rejected: "bg-red-500 text-white",
        };
        return styles[status] || "bg-gray-500 text-white";
    };

    return (
        <div className="min-h-screen bg-cream">
            {/* Header */}
            <section
                className="py-12"
                style={{
                    backgroundColor: "var(--nust-blue)",
                    backgroundImage: `linear-gradient(var(--nust-orange) 1px, transparent 1px), linear-gradient(90deg, var(--nust-orange) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            >
                <div className="container">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="w-28 h-28 rounded-full bg-cream border-4 border-nust-orange flex items-center justify-center shadow-[4px_4px_0px_rgba(0,0,0,0.3)]">
                            <span className="font-heading text-4xl text-nust-blue">
                                {mockUser.name.split(" ").map(n => n[0]).join("")}
                            </span>
                        </div>

                        {/* Info */}
                        <div className="text-center md:text-left">
                            <h1 className="font-heading text-4xl text-white mb-1">{mockUser.name.toUpperCase()}</h1>
                            <p className="font-display text-white/70 mb-2">{mockUser.email}</p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                <span className="px-3 py-1 bg-nust-orange text-nust-blue font-bold text-sm rounded-full">
                                    {mockUser.school}
                                </span>
                                <span className="text-white/50 text-sm font-display">
                                    Member since {new Date(mockUser.joinedDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-8 max-w-lg">
                        <div className="bg-white/10 rounded-lg p-4 text-center">
                            <div className="font-heading text-3xl text-white">{mockUser.eventsAttended}</div>
                            <div className="font-display text-xs text-white/70 uppercase">Attended</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4 text-center">
                            <div className="font-heading text-3xl text-white">{mockUser.eventsPosted}</div>
                            <div className="font-display text-xs text-white/70 uppercase">Posted</div>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4 text-center">
                            <div className="font-heading text-3xl text-white">{mockUser.rsvpCount}</div>
                            <div className="font-display text-xs text-white/70 uppercase">RSVPs</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs */}
            <div className="bg-white border-b-2 border-nust-blue sticky top-20 z-40">
                <div className="container">
                    <div className="flex gap-1">
                        {[
                            { key: "rsvps", label: "My RSVPs" },
                            { key: "events", label: "My Events" },
                            { key: "settings", label: "Settings" },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                                className={`px-6 py-4 font-heading text-lg border-b-4 transition-colors ${activeTab === tab.key
                                        ? "border-nust-orange text-nust-blue"
                                        : "border-transparent text-nust-blue/50 hover:text-nust-blue"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <section className="py-12">
                <div className="container max-w-4xl">
                    {/* RSVPs Tab */}
                    {activeTab === "rsvps" && (
                        <div className="space-y-4">
                            <h2 className="font-heading text-2xl text-nust-blue mb-6">UPCOMING EVENTS</h2>

                            {myRsvps.length > 0 ? (
                                myRsvps.map((event) => (
                                    <Link
                                        key={event.id}
                                        href={`/events/${event.id}`}
                                        className="block bg-white border-2 border-nust-blue rounded-xl p-5 hover:shadow-[4px_4px_0px_var(--nust-blue)] transition-all"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-heading text-xl text-nust-blue">{event.title}</h3>
                                                <p className="font-display text-sm text-nust-blue/60 mt-1">
                                                    📅 {new Date(event.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                                    &nbsp;&nbsp;📍 {event.venue}
                                                </p>
                                            </div>
                                            <span className="text-nust-orange font-heading text-2xl">→</span>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white border-2 border-nust-blue rounded-xl">
                                    <div className="text-5xl mb-4">📅</div>
                                    <p className="font-display text-nust-blue/60">No upcoming RSVPs</p>
                                    <Link href="/events" className="btn btn-primary mt-4">
                                        Explore Events
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Events Tab */}
                    {activeTab === "events" && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-heading text-2xl text-nust-blue">MY POSTED EVENTS</h2>
                                <Link href="/post-event" className="btn btn-primary text-sm">
                                    + Post New
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {myEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="bg-white border-2 border-nust-blue rounded-xl p-5"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-heading text-xl text-nust-blue">{event.title}</h3>
                                                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${getStatusBadge(event.status)}`}>
                                                        {event.status}
                                                    </span>
                                                </div>
                                                <p className="font-display text-sm text-nust-blue/60">
                                                    📅 {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                    {event.status === "approved" && (
                                                        <span className="ml-4">👥 {event.rsvpCount} RSVPs</span>
                                                    )}
                                                </p>
                                            </div>
                                            <button className="text-nust-blue/50 hover:text-nust-blue">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === "settings" && (
                        <div className="bg-white border-2 border-nust-blue rounded-xl p-6 shadow-[4px_4px_0px_var(--nust-blue)]">
                            <h2 className="font-heading text-2xl text-nust-blue mb-6">ACCOUNT SETTINGS</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                        Display Name
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={mockUser.name}
                                        className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                    />
                                </div>

                                <div>
                                    <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase">
                                        School/Department
                                    </label>
                                    <select className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue focus:outline-none focus:ring-2 focus:ring-nust-orange">
                                        <option value="seecs">SEECS</option>
                                        <option value="smme">SMME</option>
                                        <option value="scme">SCME</option>
                                        <option value="sada">SADA</option>
                                        <option value="nbs">NBS</option>
                                    </select>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <h3 className="font-heading text-lg text-nust-blue mb-4">NOTIFICATIONS</h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-2 border-nust-blue" />
                                            <span className="font-display text-nust-blue">Email me about events I RSVPd to</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-2 border-nust-blue" />
                                            <span className="font-display text-nust-blue">Weekly digest of popular events</span>
                                        </label>
                                        <label className="flex items-center gap-3 cursor-pointer">
                                            <input type="checkbox" className="w-5 h-5 rounded border-2 border-nust-blue" />
                                            <span className="font-display text-nust-blue">Push notifications on mobile</span>
                                        </label>
                                    </div>
                                </div>

                                <button className="btn btn-primary w-full mt-4">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
