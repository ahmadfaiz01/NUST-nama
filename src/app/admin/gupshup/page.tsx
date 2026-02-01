"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface TopicRequest {
    id: string;
    topic_title: string;
    reason: string | null;
    status: "pending" | "approved" | "rejected";
    created_at: string;
    user_id: string;
    requester_name?: string;
}

interface Thread {
    id: string;
    title: string;
    emoji: string;
    is_active: boolean;
}

export default function AdminGupshupPage() {
    const [requests, setRequests] = useState<TopicRequest[]>([]);
    const [threads, setThreads] = useState<Thread[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
    
    // For creating new thread
    const [showThreadModal, setShowThreadModal] = useState(false);
    const [newThread, setNewThread] = useState({
        title: "",
        description: "",
        emoji: "💬",
        color_theme: "bg-nust-blue"
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        const supabase = createClient();

        // Fetch topic requests
        let requestQuery = supabase
            .from("topic_requests")
            .select("*")
            .order("created_at", { ascending: false });

        if (filter !== "all") {
            requestQuery = requestQuery.eq("status", filter);
        }

        const { data: requestsData } = await requestQuery;

        if (requestsData) {
            // Fetch requester names
            const userIds = [...new Set(requestsData.map(r => r.user_id).filter(Boolean))];
            let userNames: Record<string, string> = {};

            if (userIds.length > 0) {
                const { data: profiles } = await supabase
                    .from("profiles")
                    .select("id, name")
                    .in("id", userIds);

                if (profiles) {
                    userNames = Object.fromEntries(
                        profiles.map(p => [p.id, p.name || "Anonymous"])
                    );
                }
            }

            setRequests(requestsData.map(r => ({
                ...r,
                requester_name: r.user_id ? userNames[r.user_id] || "Anonymous" : "Unknown"
            })));
        }

        // Fetch existing threads
        const { data: threadsData } = await supabase
            .from("threads")
            .select("*")
            .order("created_at", { ascending: true });

        if (threadsData) {
            setThreads(threadsData);
        }

        setLoading(false);
    }, [filter]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleApprove = async (request: TopicRequest) => {
        setActionLoading(request.id);
        const supabase = createClient();

        // Create a new thread from the request
        const { data: newThreadData, error: threadError } = await supabase
            .from("threads")
            .insert({
                title: request.topic_title,
                description: `Community-requested topic: ${request.reason || "Let's discuss!"}`,
                emoji: "✨",
                color_theme: "bg-green-500",
                is_active: true
            })
            .select()
            .single();

        if (threadError) {
            alert(`Error creating thread: ${threadError.message}`);
            setActionLoading(null);
            return;
        }

        // Update the request status
        const { error: updateError } = await supabase
            .from("topic_requests")
            .update({ status: "approved" })
            .eq("id", request.id);

        if (updateError) {
            alert(`Error updating request: ${updateError.message}`);
            setActionLoading(null);
            return;
        }

        // Update local state
        setRequests(prev => prev.map(r => 
            r.id === request.id ? { ...r, status: "approved" as const } : r
        ));
        
        if (newThreadData) {
            setThreads(prev => [...prev, newThreadData]);
        }

        setActionLoading(null);
    };

    const handleReject = async (requestId: string) => {
        if (!confirm("Are you sure you want to reject this request?")) return;

        setActionLoading(requestId);
        const supabase = createClient();

        const { error } = await supabase
            .from("topic_requests")
            .update({ status: "rejected" })
            .eq("id", requestId);

        if (!error) {
            setRequests(prev => prev.map(r => 
                r.id === requestId ? { ...r, status: "rejected" as const } : r
            ));
        }

        setActionLoading(null);
    };

    const handleToggleThread = async (threadId: string, currentActive: boolean) => {
        const supabase = createClient();

        const { error } = await supabase
            .from("threads")
            .update({ is_active: !currentActive })
            .eq("id", threadId);

        if (!error) {
            setThreads(prev => prev.map(t => 
                t.id === threadId ? { ...t, is_active: !currentActive } : t
            ));
        }
    };

    const handleCreateThread = async (e: React.FormEvent) => {
        e.preventDefault();
        setActionLoading("new-thread");
        const supabase = createClient();

        const { data, error } = await supabase
            .from("threads")
            .insert({
                ...newThread,
                is_active: true
            })
            .select()
            .single();

        if (error) {
            alert(`Error creating thread: ${error.message}`);
        } else if (data) {
            setThreads(prev => [...prev, data]);
            setShowThreadModal(false);
            setNewThread({ title: "", description: "", emoji: "💬", color_theme: "bg-nust-blue" });
        }

        setActionLoading(null);
    };

    const colorOptions = [
        { value: "bg-nust-blue", label: "NUST Blue" },
        { value: "bg-nust-orange", label: "NUST Orange" },
        { value: "bg-green-500", label: "Green" },
        { value: "bg-purple-600", label: "Purple" },
        { value: "bg-red-500", label: "Red" },
        { value: "bg-yellow-500", label: "Yellow" },
        { value: "bg-pink-500", label: "Pink" },
        { value: "bg-blue-600", label: "Blue" },
    ];

    const emojiOptions = ["💬", "🎮", "📚", "🍔", "🚌", "🏠", "💡", "🎵", "⚽", "🎬", "❤️", "🔥", "✨", "🤫", "😂", "🎓"];

    const pendingCount = requests.filter(r => r.status === "pending").length;

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
                <h1 className="font-heading text-4xl text-nust-blue mb-2">GUPSHUP REQUESTS</h1>
                <p className="text-gray-600 font-display">Manage Campus Chatter topics and user requests.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Topic Requests Panel */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Filters */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {(["pending", "approved", "rejected", "all"] as const).map((status) => (
                            <button
                                key={status}
                                onClick={() => setFilter(status)}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                                    filter === status
                                        ? "bg-nust-blue text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                {status === "pending" && pendingCount > 0 && (
                                    <span className="ml-2 bg-yellow-400 text-yellow-900 text-xs px-2 py-0.5 rounded-full">
                                        {pendingCount}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Requests List */}
                    <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100">
                            <h2 className="font-heading text-xl text-nust-blue flex items-center gap-2">
                                <span>💬</span> Topic Requests
                            </h2>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {requests.length === 0 ? (
                                <div className="p-8 text-center">
                                    <span className="text-4xl mb-2 block">📭</span>
                                    <p className="text-gray-500 font-display">
                                        {filter === "pending" 
                                            ? "No pending requests!" 
                                            : `No ${filter} requests found.`}
                                    </p>
                                </div>
                            ) : (
                                requests.map((request) => (
                                    <div key={request.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className="font-bold text-nust-blue">
                                                        {request.topic_title}
                                                    </h3>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                                        request.status === "pending" 
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : request.status === "approved"
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}>
                                                        {request.status}
                                                    </span>
                                                </div>
                                                {request.reason && (
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        &ldquo;{request.reason}&rdquo;
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-400">
                                                    Requested by: {request.requester_name} • 
                                                    {new Date(request.created_at).toLocaleDateString()}
                                                </p>
                                            </div>

                                            {request.status === "pending" && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApprove(request)}
                                                        disabled={actionLoading === request.id}
                                                        className="px-3 py-1.5 bg-green-500 text-white text-sm font-bold rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                                                        title="Approve & Create Thread"
                                                    >
                                                        {actionLoading === request.id ? "..." : "✓ Approve"}
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(request.id)}
                                                        disabled={actionLoading === request.id}
                                                        className="px-3 py-1.5 bg-red-500 text-white text-sm font-bold rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors"
                                                    >
                                                        {actionLoading === request.id ? "..." : "✗"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Threads Management Panel */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="font-heading text-xl text-nust-blue flex items-center gap-2">
                                <span>🗂️</span> Active Topics
                            </h2>
                            <button
                                onClick={() => setShowThreadModal(true)}
                                className="px-3 py-1.5 bg-nust-blue text-white text-sm font-bold rounded-lg hover:bg-nust-blue/90 transition-colors"
                            >
                                + New
                            </button>
                        </div>

                        <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                            {threads.map((thread) => (
                                <div 
                                    key={thread.id} 
                                    className={`p-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                                        !thread.is_active ? "opacity-50" : ""
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{thread.emoji}</span>
                                        <span className="font-medium text-sm">{thread.title}</span>
                                    </div>
                                    <button
                                        onClick={() => handleToggleThread(thread.id, thread.is_active)}
                                        className={`text-xs px-2 py-1 rounded font-bold ${
                                            thread.is_active
                                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        }`}
                                    >
                                        {thread.is_active ? "Active" : "Hidden"}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-gradient-to-br from-nust-blue to-nust-blue/80 rounded-xl p-6 text-white">
                        <h3 className="font-heading text-lg mb-4">Quick Stats</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                                <p className="text-3xl font-heading">{threads.filter(t => t.is_active).length}</p>
                                <p className="text-xs opacity-80">Active Topics</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-heading">{pendingCount}</p>
                                <p className="text-xs opacity-80">Pending Requests</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Thread Modal */}
            {showThreadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setShowThreadModal(false)}
                    />
                    
                    <div className="relative bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <button 
                            onClick={() => setShowThreadModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>

                        <h2 className="font-heading text-xl text-nust-blue mb-4">Create New Topic</h2>

                        <form onSubmit={handleCreateThread} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newThread.title}
                                    onChange={(e) => setNewThread(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="e.g., Gaming Talk"
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-nust-blue rounded-lg px-4 py-2 outline-none transition-colors"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                                    Description
                                </label>
                                <textarea
                                    required
                                    value={newThread.description}
                                    onChange={(e) => setNewThread(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="What's this topic about?"
                                    rows={2}
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-nust-blue rounded-lg px-4 py-2 outline-none transition-colors resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                                        Emoji
                                    </label>
                                    <div className="flex flex-wrap gap-1">
                                        {emojiOptions.map((emoji) => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => setNewThread(prev => ({ ...prev, emoji }))}
                                                className={`w-8 h-8 rounded flex items-center justify-center text-lg hover:bg-gray-100 ${
                                                    newThread.emoji === emoji ? "bg-nust-blue/10 ring-2 ring-nust-blue" : ""
                                                }`}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-400 mb-1">
                                        Color
                                    </label>
                                    <div className="flex flex-wrap gap-1">
                                        {colorOptions.map((color) => (
                                            <button
                                                key={color.value}
                                                type="button"
                                                onClick={() => setNewThread(prev => ({ ...prev, color_theme: color.value }))}
                                                className={`w-8 h-8 rounded ${color.value} ${
                                                    newThread.color_theme === color.value ? "ring-2 ring-offset-2 ring-nust-blue" : ""
                                                }`}
                                                title={color.label}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={actionLoading === "new-thread"}
                                className="w-full bg-nust-blue text-white font-bold py-3 rounded-lg hover:bg-nust-blue/90 disabled:opacity-50 transition-colors"
                            >
                                {actionLoading === "new-thread" ? "Creating..." : "Create Topic 🚀"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
