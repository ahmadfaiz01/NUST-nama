"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Event {
    id: string;
    title: string;
    description: string | null;
    start_time: string;
    end_time: string | null;
    venue_name: string | null;
    venue_lat: number | null;
    venue_lng: number | null;
    status: "pending" | "approved" | "rejected";
    is_official: boolean;
    tags: string[] | null;
    price: string | null;
    registration_url: string | null;
    allow_guests: boolean;
    poster_url?: string | null;
    created_at: string;
    created_by: string | null;
    creator_name?: string;
    creator_email?: string;
    rsvp_count?: number;
}

export default function AdminEventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);

    useEffect(() => {
        fetchEvent();
    }, [eventId]);

    const fetchEvent = async () => {
        const supabase = createClient();

        const { data: eventData, error } = await supabase
            .from("events")
            .select("*")
            .eq("id", eventId)
            .single();

        if (error || !eventData) {
            router.push("/admin/events");
            return;
        }

        // Get creator info
        let creatorName = "Unknown";
        let creatorEmail = "";
        if (eventData.created_by) {
            const { data: profile } = await supabase
                .from("profiles")
                .select("name")
                .eq("id", eventData.created_by)
                .single();
            
            if (profile) {
                creatorName = profile.name || "Unknown";
            }
        }

        // Get RSVP count
        const { count: rsvpCount } = await supabase
            .from("rsvps")
            .select("*", { count: "exact", head: true })
            .eq("event_id", eventId);

        setEvent({
            ...eventData,
            creator_name: creatorName,
            creator_email: creatorEmail,
            rsvp_count: rsvpCount || 0,
        });

        setLoading(false);
    };

    const handleStatusChange = async (newStatus: "approved" | "rejected" | "pending") => {
        setActionLoading(true);
        const supabase = createClient();

        const { error } = await supabase
            .from("events")
            .update({ status: newStatus })
            .eq("id", eventId);

        if (!error && event) {
            setEvent({ ...event, status: newStatus });
        }

        setActionLoading(false);
        setShowRejectModal(false);
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to permanently delete this event? This cannot be undone.")) {
            return;
        }

        setActionLoading(true);
        const supabase = createClient();

        const { error } = await supabase
            .from("events")
            .delete()
            .eq("id", eventId);

        if (!error) {
            router.push("/admin/events");
        }

        setActionLoading(false);
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, { bg: string; text: string; label: string }> = {
            pending: { bg: "bg-yellow-100", text: "text-yellow-700", label: "⏳ Pending Review" },
            approved: { bg: "bg-green-100", text: "text-green-700", label: "✓ Approved" },
            rejected: { bg: "bg-red-100", text: "text-red-700", label: "✗ Rejected" },
        };
        return styles[status] || styles.pending;
    };

    if (loading) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nust-blue"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="p-8 text-center">
                <p className="text-gray-500">Event not found.</p>
            </div>
        );
    }

    const statusBadge = getStatusBadge(event.status);

    return (
        <div className="p-6 lg:p-8">
            {/* Breadcrumb */}
            <div className="mb-6">
                <Link href="/admin/events" className="text-nust-blue hover:text-nust-orange transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Events
                </Link>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Header Card */}
                    <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
                        {/* Poster */}
                        {event.poster_url && (
                            <div className="h-64 w-full overflow-hidden border-b-2 border-gray-100">
                                <img
                                    src={event.poster_url}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="p-6">
                            {/* Status & Official Badge */}
                            <div className="flex items-center gap-3 mb-4">
                                <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${statusBadge.bg} ${statusBadge.text}`}>
                                    {statusBadge.label}
                                </span>
                                {event.is_official && (
                                    <span className="px-3 py-1.5 bg-nust-blue text-white text-sm font-bold rounded-full">
                                        🏛️ Official
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="font-heading text-3xl text-nust-blue mb-4">
                                {event.title}
                            </h1>

                            {/* Meta Info */}
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <span className="text-xl">📅</span>
                                    <div>
                                        <p className="font-bold">Date</p>
                                        <p>{new Date(event.start_time).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <span className="text-xl">🕐</span>
                                    <div>
                                        <p className="font-bold">Time</p>
                                        <p>
                                            {new Date(event.start_time).toLocaleTimeString("en-US", {
                                                hour: "numeric",
                                                minute: "2-digit",
                                            })}
                                            {event.end_time && ` - ${new Date(event.end_time).toLocaleTimeString("en-US", {
                                                hour: "numeric",
                                                minute: "2-digit",
                                            })}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <span className="text-xl">📍</span>
                                    <div>
                                        <p className="font-bold">Venue</p>
                                        <p>{event.venue_name || "TBA"}</p>
                                        {event.venue_lat && event.venue_lng && (
                                            <p className="text-xs text-gray-400">
                                                ({event.venue_lat.toFixed(4)}, {event.venue_lng.toFixed(4)})
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <span className="text-xl">🎟️</span>
                                    <div>
                                        <p className="font-bold">RSVPs</p>
                                        <p>{event.rsvp_count} people interested</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            {event.tags && event.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {event.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-nust-blue/10 text-nust-blue text-sm rounded-full">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <h3 className="font-bold text-gray-700 mb-2">Description</h3>
                                <p className="text-gray-600 whitespace-pre-wrap">
                                    {event.description || "No description provided."}
                                </p>
                            </div>

                            {/* Additional Info */}
                            <div className="mt-6 pt-6 border-t border-gray-100 grid md:grid-cols-2 gap-4">
                                {event.registration_url && (
                                    <div>
                                        <p className="font-bold text-gray-700 mb-1">Registration URL</p>
                                        <a href={event.registration_url} target="_blank" rel="noopener noreferrer" className="text-nust-blue hover:text-nust-orange break-all">
                                            {event.registration_url}
                                        </a>
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-gray-700 mb-1">Guests Allowed</p>
                                    <p>{event.allow_guests ? "Yes" : "No"}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-700 mb-1">Price</p>
                                    <p>{event.price || "Free"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar - Actions */}
                <div className="space-y-6">
                    {/* Creator Info */}
                    <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
                        <h3 className="font-heading text-lg text-nust-blue mb-4">SUBMITTED BY</h3>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-nust-blue rounded-full flex items-center justify-center text-white font-bold text-lg">
                                {(event.creator_name || "U").charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="font-bold text-gray-800">{event.creator_name}</p>
                                <p className="text-sm text-gray-500">
                                    {new Date(event.created_at).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white rounded-xl border-2 border-gray-100 p-6">
                        <h3 className="font-heading text-lg text-nust-blue mb-4">MODERATION ACTIONS</h3>
                        
                        <div className="space-y-3">
                            {event.status !== "approved" && (
                                <button
                                    onClick={() => handleStatusChange("approved")}
                                    disabled={actionLoading}
                                    className="w-full py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    ✓ Approve Event
                                </button>
                            )}
                            
                            {event.status !== "rejected" && (
                                <button
                                    onClick={() => setShowRejectModal(true)}
                                    disabled={actionLoading}
                                    className="w-full py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    ✗ Reject Event
                                </button>
                            )}

                            {event.status !== "pending" && (
                                <button
                                    onClick={() => handleStatusChange("pending")}
                                    disabled={actionLoading}
                                    className="w-full py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    ⏳ Move to Pending
                                </button>
                            )}

                            <hr className="my-4" />

                            <Link
                                href={`/events/${event.id}`}
                                className="w-full py-3 bg-nust-blue text-white font-bold rounded-lg hover:bg-nust-blue-dark transition-colors flex items-center justify-center gap-2"
                            >
                                👁️ View Public Page
                            </Link>

                            <button
                                onClick={handleDelete}
                                disabled={actionLoading}
                                className="w-full py-3 bg-gray-100 text-red-600 font-bold rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                            >
                                🗑️ Delete Permanently
                            </button>
                        </div>
                    </div>

                    {/* Event ID */}
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                        <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Event ID</p>
                        <p className="text-sm text-gray-600 font-mono break-all">{event.id}</p>
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                        <h3 className="font-heading text-2xl text-red-600 mb-2">
                            REJECT EVENT
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to reject "<strong>{event.title}</strong>"?
                        </p>

                        <div className="mb-6">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Reason (optional)
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Why is this event being rejected?"
                                className="w-full p-3 border-2 border-gray-200 rounded-lg focus:border-red-500 focus:outline-none"
                                rows={3}
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleStatusChange("rejected")}
                                disabled={actionLoading}
                                className="flex-1 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 disabled:opacity-50"
                            >
                                {actionLoading ? "Rejecting..." : "Confirm Rejection"}
                            </button>
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-lg hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
