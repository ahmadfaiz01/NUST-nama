"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface NewsItem {
    id: string;
    title: string;
    summary: string | null;
    url: string | null;
    source: string | null;
    published_at: string | null;
    status: "pending" | "approved" | "rejected";
    created_at: string;
}

export default function AdminNewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [toneLoading, setToneLoading] = useState<string | null>(null);
    const [editingItem, setEditingItem] = useState<string | null>(null);
    const [editedTitles, setEditedTitles] = useState<Record<string, string>>({});
    const [editedSummaries, setEditedSummaries] = useState<Record<string, string>>({});
    const [filter, setFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");

    const fetchNews = useCallback(async () => {
        setLoading(true);
        const supabase = createClient();

        let query = supabase
            .from("news_items")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(50);

        if (filter !== "all") {
            query = query.eq("status", filter);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching news:", error);
        } else {
            setNews(data || []);
        }
        setLoading(false);
    }, [filter]);

    useEffect(() => {
        fetchNews();
    }, [fetchNews]);

    const handleApprove = async (id: string) => {
        setActionLoading(id);
        const supabase = createClient();

        // Check if there are edited title/summary to save
        const updates: { status: string; title?: string; summary?: string } = { status: "approved" };
        if (editedTitles[id]) {
            updates.title = editedTitles[id];
        }
        if (editedSummaries[id]) {
            updates.summary = editedSummaries[id];
        }

        const { error } = await supabase
            .from("news_items")
            .update(updates)
            .eq("id", id);

        if (error) {
            console.error("Error approving news:", error);
            alert("Failed to approve news item");
        } else {
            setNews(news.filter((item) => item.id !== id));
        }
        setActionLoading(null);
    };

    const handleReject = async (id: string) => {
        setActionLoading(id);
        const supabase = createClient();

        const { error } = await supabase
            .from("news_items")
            .update({ status: "rejected" })
            .eq("id", id);

        if (error) {
            console.error("Error rejecting news:", error);
            alert("Failed to reject news item");
        } else {
            setNews(news.filter((item) => item.id !== id));
        }
        setActionLoading(null);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this news item permanently?")) {
            return;
        }
        
        setActionLoading(id);
        const supabase = createClient();

        const { error } = await supabase
            .from("news_items")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("Error deleting news:", error);
            alert("Failed to delete news item");
        } else {
            setNews(news.filter((item) => item.id !== id));
        }
        setActionLoading(null);
    };

    const handleStudentTone = async (id: string, originalTitle: string, originalSummary: string) => {
        setToneLoading(id);

        try {
            const response = await fetch("/api/student-tone", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: originalTitle, summary: originalSummary }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to generate student tone");
            }

            const data = await response.json();
            setEditedTitles((prev) => ({ ...prev, [id]: data.title }));
            setEditedSummaries((prev) => ({ ...prev, [id]: data.summary }));
            setEditingItem(id);
        } catch (error) {
            console.error("Error generating student tone:", error);
            const message = error instanceof Error ? error.message : "Failed to generate student tone. Make sure GEMINI_API_KEY is set and restart your dev server.";
            alert(message);
        }

        setToneLoading(null);
    };

    const formatDate = (dateStr: string | null) => {
        if (!dateStr) return "Unknown";
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="p-6 pt-28">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-heading text-nust-blue">📰 News Desk</h1>
                        <p className="text-nust-blue/60 mt-1">
                            Review and approve news from n8n automation
                        </p>
                    </div>
                    <button
                        onClick={fetchNews}
                        className="btn bg-nust-blue text-white px-4 py-2 rounded-lg"
                    >
                        🔄 Refresh
                    </button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-6">
                    {(["pending", "approved", "rejected", "all"] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg font-medium capitalize transition-all ${
                                filter === f
                                    ? "bg-nust-blue text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {f === "pending" && "⏳ "}
                            {f === "approved" && "✅ "}
                            {f === "rejected" && "❌ "}
                            {f === "all" && "📋 "}
                            {f}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-nust-blue mx-auto"></div>
                        <p className="mt-4 text-nust-blue/60">Loading news...</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && news.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
                        <span className="text-6xl">🎉</span>
                        <p className="mt-4 text-xl text-gray-600">
                            {filter === "pending"
                                ? "No pending news to review!"
                                : `No ${filter} news items found.`}
                        </p>
                    </div>
                )}

                {/* News Items */}
                <div className="space-y-4">
                    {news.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border-2 border-nust-blue rounded-xl p-6 shadow-[4px_4px_0px_var(--nust-blue)]"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between gap-4 mb-3">
                                <div>
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold uppercase mr-2 ${
                                        item.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                                        item.status === "approved" ? "bg-green-100 text-green-700" :
                                        "bg-red-100 text-red-700"
                                    }`}>
                                        {item.status}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {item.source || "Unknown Source"} • {formatDate(item.published_at)}
                                    </span>
                                </div>
                                {item.url && (
                                    <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-nust-orange hover:underline text-sm"
                                    >
                                        View Original ↗
                                    </a>
                                )}
                            </div>

                            {/* Title */}
                            {editingItem === item.id ? (
                                <div className="mb-3">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">TITLE</label>
                                    <input
                                        type="text"
                                        value={editedTitles[item.id] ?? item.title}
                                        onChange={(e) =>
                                            setEditedTitles((prev) => ({
                                                ...prev,
                                                [item.id]: e.target.value,
                                            }))
                                        }
                                        className="w-full p-3 border-2 border-nust-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-nust-orange font-heading text-xl text-nust-blue"
                                    />
                                </div>
                            ) : (
                                <h2 className="text-xl font-heading text-nust-blue mb-3">
                                    {editedTitles[item.id] || item.title}
                                    {editedTitles[item.id] && (
                                        <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-normal">
                                            ✨ Edited
                                        </span>
                                    )}
                                </h2>
                            )}

                            {/* Summary */}
                            {editingItem === item.id ? (
                                <div className="mb-4">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">SUMMARY</label>
                                    <textarea
                                        value={editedSummaries[item.id] ?? item.summary ?? ""}
                                        onChange={(e) =>
                                            setEditedSummaries((prev) => ({
                                                ...prev,
                                                [item.id]: e.target.value,
                                            }))
                                        }
                                        className="w-full p-3 border-2 border-nust-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                        rows={3}
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => setEditingItem(null)}
                                            className="text-sm text-green-600 hover:text-green-700 font-medium"
                                        >
                                            ✓ Done Editing
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-600 mb-4">
                                    {editedSummaries[item.id] || item.summary || "No summary available."}
                                    {editedSummaries[item.id] && (
                                        <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                            ✨ Student Tone Applied
                                        </span>
                                    )}
                                </p>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap gap-3">
                                {item.status === "pending" && (
                                    <>
                                        <button
                                            onClick={() => handleApprove(item.id)}
                                            disabled={actionLoading === item.id}
                                            className="btn bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 disabled:opacity-50"
                                        >
                                            {actionLoading === item.id ? "..." : "✅ Approve"}
                                        </button>
                                        <button
                                            onClick={() => handleReject(item.id)}
                                            disabled={actionLoading === item.id}
                                            className="btn bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50"
                                        >
                                            {actionLoading === item.id ? "..." : "❌ Reject"}
                                        </button>
                                    </>
                                )}
                                
                                <button
                                    onClick={() => handleStudentTone(item.id, item.title, item.summary || "")}
                                    disabled={toneLoading === item.id}
                                    className="btn bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 disabled:opacity-50"
                                >
                                    {toneLoading === item.id ? "✨ Generating..." : "✨ Student Tone"}
                                </button>

                                <button
                                    onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                                    className="btn bg-nust-orange text-nust-blue px-4 py-2 rounded-lg font-medium hover:opacity-90"
                                >
                                    ✏️ Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(item.id)}
                                    disabled={actionLoading === item.id}
                                    className="btn bg-red-100 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-200 disabled:opacity-50"
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
