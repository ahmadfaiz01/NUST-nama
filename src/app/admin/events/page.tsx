"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Event {
    id: string;
    title: string;
    description: string | null;
    start_time: string;
    end_time: string | null;
    venue_name: string | null;
    status: "pending" | "approved" | "rejected";
    is_official: boolean;
    tags: string[] | null;
    created_at: string;
    created_by: string | null;
    creator_name?: string;
}

export default function AdminEventsPage() {
    const searchParams = useSearchParams();
    const initialStatus = searchParams.get("status") || "all";
    
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState(initialStatus);
    const [searchQuery, setSearchQuery] = useState("");
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchEvents();
    }, [statusFilter, searchQuery]);

    const fetchEvents = async () => {
        setLoading(true);
        const supabase = createClient();

        let query = supabase
            .from("events")
            .select("*")
            .order("created_at", { ascending: false });

        // Status filter
        if (statusFilter !== "all") {
            query = query.eq("status", statusFilter);
        }

        // Search filter
        if (searchQuery.trim()) {
            query = query.ilike("title", `%${searchQuery.trim()}%`);
        }

        const { data, error } = await query.limit(100);

        if (data) {
            // Fetch creator names
            const creatorIds = [...new Set(data.map(e => e.created_by).filter(Boolean))];
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

            setEvents(data.map(e => ({
                ...e,
                creator_name: e.created_by ? creatorNames[e.created_by] || "Unknown" : "System"
            })));
        }

        setLoading(false);
    };

    const handleEventAction = async (eventId: string, action: "approved" | "rejected" | "pending") => {
        setActionLoading(eventId);
        const supabase = createClient();

        const { error } = await supabase
            .from("events")
            .update({ status: action })
            .eq("id", eventId);

        if (!error) {
            // Update local state
            setEvents(prev => prev.map(e => 
                e.id === eventId ? { ...e, status: action } : e
            ));
        }

        setActionLoading(null);
    };

    const handleBulkAction = async (action: "approved" | "rejected") => {
        if (selectedEvents.size === 0) return;
        
        setActionLoading("bulk");
        const supabase = createClient();

        const { error } = await supabase
            .from("events")
            .update({ status: action })
            .in("id", Array.from(selectedEvents));

        if (!error) {
            setEvents(prev => prev.map(e => 
                selectedEvents.has(e.id) ? { ...e, status: action } : e
            ));
            setSelectedEvents(new Set());
        }

        setActionLoading(null);
    };

    const handleDeleteEvent = async (eventId: string) => {
        if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
            return;
        }

        setActionLoading(eventId);
        const supabase = createClient();

        const { error } = await supabase
            .from("events")
            .delete()
            .eq("id", eventId);

        if (!error) {
            setEvents(prev => prev.filter(e => e.id !== eventId));
        }

        setActionLoading(null);
    };

    const toggleSelectEvent = (eventId: string) => {
        setSelectedEvents(prev => {
            const newSet = new Set(prev);
            if (newSet.has(eventId)) {
                newSet.delete(eventId);
            } else {
                newSet.add(eventId);
            }
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedEvents.size === events.length) {
            setSelectedEvents(new Set());
        } else {
            setSelectedEvents(new Set(events.map(e => e.id)));
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
            approved: "bg-green-100 text-green-700 border-green-200",
            rejected: "bg-red-100 text-red-700 border-red-200",
        };
        return styles[status] || "bg-gray-100 text-gray-700 border-gray-200";
    };

    return (
        <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-heading text-4xl text-nust-blue mb-2">EVENT MANAGEMENT</h1>
                <p className="text-gray-600 font-display">Review, approve, or reject event submissions.</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border-2 border-gray-100 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2">🔍</span>
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-2.5 rounded-lg border-2 border-gray-200 focus:border-nust-blue focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Status Tabs */}
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        {[
                            { id: "all", label: "All" },
                            { id: "pending", label: "Pending", count: events.filter(e => e.status === "pending").length },
                            { id: "approved", label: "Approved" },
                            { id: "rejected", label: "Rejected" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setStatusFilter(tab.id)}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${
                                    statusFilter === tab.id
                                        ? "bg-white text-nust-blue shadow-sm"
                                        : "text-gray-500 hover:text-nust-blue"
                                }`}
                            >
                                {tab.label}
                                {tab.count !== undefined && tab.count > 0 && (
                                    <span className="bg-yellow-400 text-yellow-900 text-xs px-1.5 py-0.5 rounded-full">
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedEvents.size > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4">
                        <span className="text-sm text-gray-500">
                            {selectedEvents.size} event(s) selected
                        </span>
                        <button
                            onClick={() => handleBulkAction("approved")}
                            disabled={actionLoading === "bulk"}
                            className="px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 disabled:opacity-50"
                        >
                            ✓ Approve All
                        </button>
                        <button
                            onClick={() => handleBulkAction("rejected")}
                            disabled={actionLoading === "bulk"}
                            className="px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 disabled:opacity-50"
                        >
                            ✗ Reject All
                        </button>
                        <button
                            onClick={() => setSelectedEvents(new Set())}
                            className="px-4 py-2 text-gray-500 text-sm font-bold hover:text-gray-700"
                        >
                            Clear Selection
                        </button>
                    </div>
                )}
            </div>

            {/* Events Table */}
            <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-nust-blue"></div>
                    </div>
                ) : events.length === 0 ? (
                    <div className="p-12 text-center">
                        <span className="text-5xl mb-4 block">📭</span>
                        <h3 className="font-heading text-xl text-gray-600 mb-2">No Events Found</h3>
                        <p className="text-gray-500">
                            {statusFilter === "pending" 
                                ? "No pending events to review." 
                                : "No events match your search criteria."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedEvents.size === events.length && events.length > 0}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 rounded border-gray-300"
                                        />
                                    </th>
                                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Event</th>
                                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Date</th>
                                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Venue</th>
                                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Creator</th>
                                    <th className="p-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Status</th>
                                    <th className="p-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {events.map((event) => (
                                    <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedEvents.has(event.id)}
                                                onChange={() => toggleSelectEvent(event.id)}
                                                className="w-4 h-4 rounded border-gray-300"
                                            />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {event.is_official && (
                                                    <span className="text-lg" title="Official Event">🏛️</span>
                                                )}
                                                <div>
                                                    <Link 
                                                        href={`/events/${event.id}`}
                                                        className="font-bold text-nust-blue hover:text-nust-orange transition-colors"
                                                    >
                                                        {event.title}
                                                    </Link>
                                                    {event.tags && event.tags.length > 0 && (
                                                        <div className="flex gap-1 mt-1">
                                                            {event.tags.slice(0, 2).map(tag => (
                                                                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {new Date(event.start_time).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                            <br />
                                            <span className="text-gray-400">
                                                {new Date(event.start_time).toLocaleTimeString("en-US", {
                                                    hour: "numeric",
                                                    minute: "2-digit",
                                                })}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {event.venue_name || "TBA"}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {event.creator_name}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getStatusBadge(event.status)}`}>
                                                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                {event.status !== "approved" && (
                                                    <button
                                                        onClick={() => handleEventAction(event.id, "approved")}
                                                        disabled={actionLoading === event.id}
                                                        className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 disabled:opacity-50 transition-colors"
                                                        title="Approve"
                                                    >
                                                        ✓
                                                    </button>
                                                )}
                                                {event.status !== "rejected" && (
                                                    <button
                                                        onClick={() => handleEventAction(event.id, "rejected")}
                                                        disabled={actionLoading === event.id}
                                                        className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 disabled:opacity-50 transition-colors"
                                                        title="Reject"
                                                    >
                                                        ✗
                                                    </button>
                                                )}
                                                {event.status !== "pending" && (
                                                    <button
                                                        onClick={() => handleEventAction(event.id, "pending")}
                                                        disabled={actionLoading === event.id}
                                                        className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 disabled:opacity-50 transition-colors"
                                                        title="Move to Pending"
                                                    >
                                                        ⏳
                                                    </button>
                                                )}
                                                <Link
                                                    href={`/events/${event.id}`}
                                                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                                    title="View"
                                                >
                                                    👁️
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteEvent(event.id)}
                                                    disabled={actionLoading === event.id}
                                                    className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-100 hover:text-red-600 disabled:opacity-50 transition-colors"
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
