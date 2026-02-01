"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface AdminStats {
    total_users: number;
    banned_users: number;
    pending_events: number;
    approved_events: number;
    rejected_events: number;
    total_events: number;
    total_rsvps: number;
    total_checkins: number;
}

interface PendingEvent {
    id: string;
    title: string;
    start_time: string;
    venue_name: string;
    created_at: string;
    created_by: string;
    creator_name?: string;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [pendingEvents, setPendingEvents] = useState<PendingEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        const supabase = createClient();

        // Fetch stats (using individual queries as view might not exist yet)
        const [
            { count: totalUsers },
            { count: bannedUsers },
            { count: pendingCount },
            { count: approvedCount },
            { count: rejectedCount },
            { count: totalRsvps },
            { count: totalCheckins },
        ] = await Promise.all([
            supabase.from("profiles").select("*", { count: "exact", head: true }),
            supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_banned", true),
            supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "pending"),
            supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "approved"),
            supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "rejected"),
            supabase.from("rsvps").select("*", { count: "exact", head: true }),
            supabase.from("checkins").select("*", { count: "exact", head: true }),
        ]);

        setStats({
            total_users: totalUsers || 0,
            banned_users: bannedUsers || 0,
            pending_events: pendingCount || 0,
            approved_events: approvedCount || 0,
            rejected_events: rejectedCount || 0,
            total_events: (pendingCount || 0) + (approvedCount || 0) + (rejectedCount || 0),
            total_rsvps: totalRsvps || 0,
            total_checkins: totalCheckins || 0,
        });

        // Fetch pending events
        const { data: eventsData } = await supabase
            .from("events")
            .select("*")
            .eq("status", "pending")
            .order("created_at", { ascending: false })
            .limit(5);

        if (eventsData) {
            // Fetch creator names
            const creatorIds = [...new Set(eventsData.map(e => e.created_by).filter(Boolean))];
            let creatorNames: Record<string, string> = {};
            
            if (creatorIds.length > 0) {
                const { data: profiles } = await supabase
                    .from("profiles")
                    .select("id, name")
                    .in("id", creatorIds);
                
                if (profiles) {
                    creatorNames = Object.fromEntries(
                        profiles.map(p => [p.id, p.name || "Unknown"])
                    );
                }
            }

            setPendingEvents(eventsData.map(e => ({
                ...e,
                creator_name: e.created_by ? creatorNames[e.created_by] || "Unknown" : "System"
            })));
        }

        setLoading(false);
    };

    const handleEventAction = async (eventId: string, action: "approved" | "rejected") => {
        setActionLoading(eventId);
        const supabase = createClient();

        const { error } = await supabase
            .from("events")
            .update({ status: action })
            .eq("id", eventId);

        if (!error) {
            // Remove from pending list
            setPendingEvents(prev => prev.filter(e => e.id !== eventId));
            // Update stats
            if (stats) {
                setStats({
                    ...stats,
                    pending_events: stats.pending_events - 1,
                    [action === "approved" ? "approved_events" : "rejected_events"]: 
                        stats[action === "approved" ? "approved_events" : "rejected_events"] + 1,
                });
            }
        }

        setActionLoading(null);
    };

    const statCards = [
        { label: "Pending Events", value: stats?.pending_events || 0, icon: "⏳", color: "bg-yellow-500", href: "/admin/events?status=pending" },
        { label: "Approved Events", value: stats?.approved_events || 0, icon: "✅", color: "bg-green-500", href: "/admin/events?status=approved" },
        { label: "Total Users", value: stats?.total_users || 0, icon: "👥", color: "bg-blue-500", href: "/admin/users" },
        { label: "Total RSVPs", value: stats?.total_rsvps || 0, icon: "🎟️", color: "bg-purple-500", href: "/admin/stats" },
        { label: "Check-ins", value: stats?.total_checkins || 0, icon: "📍", color: "bg-pink-500", href: "/admin/stats" },
        { label: "Banned Users", value: stats?.banned_users || 0, icon: "🚫", color: "bg-red-500", href: "/admin/users?filter=banned" },
    ];

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nust-blue"></div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-heading text-4xl text-nust-blue mb-2">ADMIN DASHBOARD</h1>
                <p className="text-gray-600 font-display">Welcome back! Here's what's happening on campus.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {statCards.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="bg-white rounded-xl p-4 border-2 border-gray-100 hover:border-nust-blue hover:shadow-lg transition-all group"
                    >
                        <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                            <span className="text-xl">{stat.icon}</span>
                        </div>
                        <p className="text-2xl font-heading text-nust-blue group-hover:text-nust-orange transition-colors">
                            {stat.value}
                        </p>
                        <p className="text-xs text-gray-500 font-display uppercase tracking-wide">
                            {stat.label}
                        </p>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Pending Events Queue */}
                <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">⏳</span>
                            <h2 className="font-heading text-xl text-nust-blue">PENDING EVENTS</h2>
                            {(stats?.pending_events || 0) > 0 && (
                                <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-full">
                                    {stats?.pending_events} pending
                                </span>
                            )}
                        </div>
                        <Link 
                            href="/admin/events?status=pending" 
                            className="text-sm text-nust-blue hover:text-nust-orange font-medium"
                        >
                            View All →
                        </Link>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {pendingEvents.length === 0 ? (
                            <div className="p-8 text-center">
                                <span className="text-4xl mb-2 block">✅</span>
                                <p className="text-gray-500 font-display">All caught up! No pending events.</p>
                            </div>
                        ) : (
                            pendingEvents.map((event) => (
                                <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-nust-blue truncate">
                                                {event.title}
                                            </h3>
                                            <p className="text-sm text-gray-500">
                                                📍 {event.venue_name || "TBA"} • 
                                                📅 {new Date(event.start_time).toLocaleDateString()}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                Posted by: {event.creator_name}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEventAction(event.id, "approved")}
                                                disabled={actionLoading === event.id}
                                                className="px-3 py-1.5 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                                            >
                                                {actionLoading === event.id ? "..." : "✓"}
                                            </button>
                                            <button
                                                onClick={() => handleEventAction(event.id, "rejected")}
                                                disabled={actionLoading === event.id}
                                                className="px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                                            >
                                                {actionLoading === event.id ? "..." : "✗"}
                                            </button>
                                            <Link
                                                href={`/admin/events/${event.id}`}
                                                className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors"
                                            >
                                                👁️
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Stats / Activity */}
                <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">📈</span>
                            <h2 className="font-heading text-xl text-nust-blue">QUICK OVERVIEW</h2>
                        </div>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Event Status Breakdown */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">
                                Event Status
                            </h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Approved</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-green-500 h-2 rounded-full" 
                                                style={{ 
                                                    width: `${stats?.total_events ? (stats.approved_events / stats.total_events) * 100 : 0}%` 
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-gray-600 w-8">
                                            {stats?.approved_events || 0}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Pending</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-yellow-500 h-2 rounded-full" 
                                                style={{ 
                                                    width: `${stats?.total_events ? (stats.pending_events / stats.total_events) * 100 : 0}%` 
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-gray-600 w-8">
                                            {stats?.pending_events || 0}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Rejected</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-red-500 h-2 rounded-full" 
                                                style={{ 
                                                    width: `${stats?.total_events ? (stats.rejected_events / stats.total_events) * 100 : 0}%` 
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold text-gray-600 w-8">
                                            {stats?.rejected_events || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">
                                Quick Actions
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/admin/events?status=pending"
                                    className="p-3 bg-yellow-50 text-yellow-700 rounded-lg text-center hover:bg-yellow-100 transition-colors"
                                >
                                    <span className="block text-2xl mb-1">⏳</span>
                                    <span className="text-sm font-bold">Review Queue</span>
                                </Link>
                                <Link
                                    href="/admin/users"
                                    className="p-3 bg-blue-50 text-blue-700 rounded-lg text-center hover:bg-blue-100 transition-colors"
                                >
                                    <span className="block text-2xl mb-1">👥</span>
                                    <span className="text-sm font-bold">Manage Users</span>
                                </Link>
                                <Link
                                    href="/admin/events"
                                    className="p-3 bg-green-50 text-green-700 rounded-lg text-center hover:bg-green-100 transition-colors"
                                >
                                    <span className="block text-2xl mb-1">📅</span>
                                    <span className="text-sm font-bold">All Events</span>
                                </Link>
                                <Link
                                    href="/admin/stats"
                                    className="p-3 bg-purple-50 text-purple-700 rounded-lg text-center hover:bg-purple-100 transition-colors"
                                >
                                    <span className="block text-2xl mb-1">📊</span>
                                    <span className="text-sm font-bold">Statistics</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
