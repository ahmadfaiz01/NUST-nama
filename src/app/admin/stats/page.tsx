"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Stats {
    // Overview
    totalUsers: number;
    totalEvents: number;
    totalRsvps: number;
    totalCheckins: number;
    
    // Event breakdown
    pendingEvents: number;
    approvedEvents: number;
    rejectedEvents: number;
    
    // User breakdown
    activeUsers: number;
    bannedUsers: number;
    adminCount: number;
    moderatorCount: number;
    
    // Activity
    eventsThisWeek: number;
    rsvpsThisWeek: number;
    checkinsThisWeek: number;
    newUsersThisWeek: number;
    
    // Top venues
    topVenues: { venue: string; count: number }[];
    
    // Top tags
    topTags: { tag: string; count: number }[];
}

export default function AdminStatsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        const supabase = createClient();
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Fetch all basic counts
        const [
            { count: totalUsers },
            { count: totalEvents },
            { count: totalRsvps },
            { count: totalCheckins },
            { count: pendingEvents },
            { count: approvedEvents },
            { count: rejectedEvents },
            { count: bannedUsers },
            { count: adminCount },
            { count: moderatorCount },
            { count: eventsThisWeek },
            { count: rsvpsThisWeek },
            { count: checkinsThisWeek },
            { count: newUsersThisWeek },
            { data: eventsData },
        ] = await Promise.all([
            supabase.from("profiles").select("*", { count: "exact", head: true }),
            supabase.from("events").select("*", { count: "exact", head: true }),
            supabase.from("rsvps").select("*", { count: "exact", head: true }),
            supabase.from("checkins").select("*", { count: "exact", head: true }),
            supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "pending"),
            supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "approved"),
            supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "rejected"),
            supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_banned", true),
            supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "admin"),
            supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "moderator"),
            supabase.from("events").select("*", { count: "exact", head: true }).gte("created_at", weekAgo.toISOString()),
            supabase.from("rsvps").select("*", { count: "exact", head: true }).gte("created_at", weekAgo.toISOString()),
            supabase.from("checkins").select("*", { count: "exact", head: true }).gte("created_at", weekAgo.toISOString()),
            supabase.from("profiles").select("*", { count: "exact", head: true }).gte("created_at", weekAgo.toISOString()),
            supabase.from("events").select("venue_name, tags"),
        ]);

        // Calculate top venues
        const venueCount: Record<string, number> = {};
        const tagCount: Record<string, number> = {};

        eventsData?.forEach(event => {
            if (event.venue_name) {
                venueCount[event.venue_name] = (venueCount[event.venue_name] || 0) + 1;
            }
            event.tags?.forEach((tag: string) => {
                tagCount[tag] = (tagCount[tag] || 0) + 1;
            });
        });

        const topVenues = Object.entries(venueCount)
            .map(([venue, count]) => ({ venue, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const topTags = Object.entries(tagCount)
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);

        setStats({
            totalUsers: totalUsers || 0,
            totalEvents: totalEvents || 0,
            totalRsvps: totalRsvps || 0,
            totalCheckins: totalCheckins || 0,
            pendingEvents: pendingEvents || 0,
            approvedEvents: approvedEvents || 0,
            rejectedEvents: rejectedEvents || 0,
            activeUsers: (totalUsers || 0) - (bannedUsers || 0),
            bannedUsers: bannedUsers || 0,
            adminCount: adminCount || 0,
            moderatorCount: moderatorCount || 0,
            eventsThisWeek: eventsThisWeek || 0,
            rsvpsThisWeek: rsvpsThisWeek || 0,
            checkinsThisWeek: checkinsThisWeek || 0,
            newUsersThisWeek: newUsersThisWeek || 0,
            topVenues,
            topTags,
        });

        setLoading(false);
    };

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
                <h1 className="font-heading text-4xl text-nust-blue mb-2">PLATFORM STATISTICS</h1>
                <p className="text-gray-600 font-display">Deep dive into platform metrics and insights.</p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: "Total Users", value: stats?.totalUsers, icon: "👥", color: "bg-blue-500" },
                    { label: "Total Events", value: stats?.totalEvents, icon: "📅", color: "bg-green-500" },
                    { label: "Total RSVPs", value: stats?.totalRsvps, icon: "🎟️", color: "bg-purple-500" },
                    { label: "Total Check-ins", value: stats?.totalCheckins, icon: "📍", color: "bg-pink-500" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-xl p-6 border-2 border-gray-100">
                        <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                            <span className="text-2xl">{stat.icon}</span>
                        </div>
                        <p className="text-3xl font-heading text-nust-blue">{stat.value}</p>
                        <p className="text-sm text-gray-500 font-display uppercase tracking-wide">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* This Week Activity */}
            <div className="bg-white rounded-xl border-2 border-gray-100 p-6 mb-8">
                <h2 className="font-heading text-xl text-nust-blue mb-4">THIS WEEK'S ACTIVITY</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: "New Events", value: stats?.eventsThisWeek, icon: "📅", color: "text-green-500" },
                        { label: "New RSVPs", value: stats?.rsvpsThisWeek, icon: "🎟️", color: "text-purple-500" },
                        { label: "New Check-ins", value: stats?.checkinsThisWeek, icon: "📍", color: "text-pink-500" },
                        { label: "New Users", value: stats?.newUsersThisWeek, icon: "👤", color: "text-blue-500" },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <span className={`text-3xl ${stat.color}`}>{stat.icon}</span>
                            <p className="text-2xl font-heading text-nust-blue mt-2">{stat.value}</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Event Breakdown */}
                <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
                    <h2 className="font-heading text-xl text-nust-blue mb-4">EVENT STATUS BREAKDOWN</h2>
                    <div className="space-y-4">
                        {[
                            { label: "Approved", value: stats?.approvedEvents, total: stats?.totalEvents, color: "bg-green-500" },
                            { label: "Pending", value: stats?.pendingEvents, total: stats?.totalEvents, color: "bg-yellow-500" },
                            { label: "Rejected", value: stats?.rejectedEvents, total: stats?.totalEvents, color: "bg-red-500" },
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium">{item.label}</span>
                                    <span className="text-gray-500">
                                        {item.value} ({item.total ? Math.round((item.value! / item.total) * 100) : 0}%)
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                        className={`${item.color} h-3 rounded-full transition-all duration-500`}
                                        style={{ width: `${item.total ? (item.value! / item.total) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Breakdown */}
                <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
                    <h2 className="font-heading text-xl text-nust-blue mb-4">USER BREAKDOWN</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: "Active Users", value: stats?.activeUsers, color: "bg-green-100 text-green-700" },
                            { label: "Banned Users", value: stats?.bannedUsers, color: "bg-red-100 text-red-700" },
                            { label: "Admins", value: stats?.adminCount, color: "bg-purple-100 text-purple-700" },
                            { label: "Moderators", value: stats?.moderatorCount, color: "bg-blue-100 text-blue-700" },
                        ].map((item) => (
                            <div key={item.label} className={`${item.color} rounded-lg p-4 text-center`}>
                                <p className="text-2xl font-heading">{item.value}</p>
                                <p className="text-sm font-medium">{item.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Venues */}
                <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
                    <h2 className="font-heading text-xl text-nust-blue mb-4">TOP VENUES</h2>
                    {stats?.topVenues.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No venue data yet</p>
                    ) : (
                        <div className="space-y-3">
                            {stats?.topVenues.map((venue, index) => (
                                <div key={venue.venue} className="flex items-center gap-3">
                                    <span className="w-6 h-6 bg-nust-blue text-white rounded-full flex items-center justify-center text-xs font-bold">
                                        {index + 1}
                                    </span>
                                    <span className="flex-1 font-medium truncate">{venue.venue}</span>
                                    <span className="text-sm text-gray-500">{venue.count} events</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Popular Tags */}
                <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
                    <h2 className="font-heading text-xl text-nust-blue mb-4">POPULAR TAGS</h2>
                    {stats?.topTags.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No tag data yet</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {stats?.topTags.map((tag) => (
                                <span 
                                    key={tag.tag} 
                                    className="px-3 py-2 bg-nust-blue/10 text-nust-blue rounded-full text-sm font-medium"
                                >
                                    {tag.tag} <span className="text-nust-blue/50">({tag.count})</span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
