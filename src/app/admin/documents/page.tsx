"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";

interface DocumentRow {
    id: string;
    url: string;
    title: string | null;
    host: string | null;
    school: string | null;
    doc_type: string | null;
    source_type: string;
    indexed: boolean;
    needs_ocr: boolean;
    last_seen: string;
    last_changed: string | null;
    // PostgREST embedded aggregate: one row with the child count.
    sections: { count: number }[];
}

function fileName(url: string) {
    try {
        const path = new URL(url).pathname;
        return decodeURIComponent(path.split("/").filter(Boolean).pop() || url);
    } catch {
        return url;
    }
}

function formatDate(value: string | null) {
    if (!value) return null;
    return new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function AdminDocumentsPage() {
    const [docs, setDocs] = useState<DocumentRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [onlyBlacklisted, setOnlyBlacklisted] = useState(false);

    const fetchDocs = useCallback(async () => {
        setLoading(true);
        setError(null);
        const supabase = createClient();

        // One query: documents plus an aggregated child count, no N+1.
        const { data, error } = await supabase
            .from("documents")
            .select("id, url, title, host, school, doc_type, source_type, indexed, needs_ocr, last_seen, last_changed, sections(count)")
            .order("last_seen", { ascending: false });

        if (error) {
            console.error("Error fetching documents:", error);
            setError(error.message);
        } else {
            setDocs((data as DocumentRow[]) || []);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchDocs();
    }, [fetchDocs]);

    const toggleIndexed = async (doc: DocumentRow) => {
        setBusyId(doc.id);
        const supabase = createClient();
        const next = !doc.indexed;

        const { data, error } = await supabase
            .from("documents")
            .update({ indexed: next })
            .eq("id", doc.id)
            .select("id");

        if (error || !data || data.length === 0) {
            console.error("Error updating document:", error);
            alert(
                error
                    ? `Failed to update: ${error.message}`
                    : "Update affected 0 rows — the database policy is blocking this write."
            );
        } else {
            setDocs((prev) =>
                prev.map((d) => (d.id === doc.id ? { ...d, indexed: next } : d))
            );
        }
        setBusyId(null);
    };

    const counts = useMemo(() => ({
        total: docs.length,
        sections: docs.reduce((sum, d) => sum + (d.sections[0]?.count ?? 0), 0),
        blacklisted: docs.filter((d) => !d.indexed).length,
    }), [docs]);

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase();
        return docs.filter((d) => {
            if (onlyBlacklisted && d.indexed) return false;
            if (!q) return true;
            return (
                (d.title || "").toLowerCase().includes(q) ||
                d.url.toLowerCase().includes(q)
            );
        });
    }, [docs, search, onlyBlacklisted]);

    return (
        <div className="p-4 sm:p-6 pt-24 sm:pt-28">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-heading text-nust-blue">📄 Documents</h1>
                        <p className="text-nust-blue/60 mt-1 text-sm">
                            The chatbot corpus. Blacklisting removes a document from every future answer.
                        </p>
                    </div>
                    <button
                        onClick={fetchDocs}
                        className="btn bg-nust-blue text-white px-4 py-2 rounded-lg"
                    >
                        🔄 Refresh
                    </button>
                </div>

                {/* Counts */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
                    {[
                        { label: "Documents", value: counts.total },
                        { label: "Sections", value: counts.sections },
                        { label: "Blacklisted", value: counts.blacklisted },
                    ].map((c) => (
                        <div
                            key={c.label}
                            className="bg-white border-2 border-nust-blue rounded-xl p-3 sm:p-4 shadow-[4px_4px_0px_var(--nust-blue)]"
                        >
                            <p className="text-2xl sm:text-3xl font-heading text-nust-blue">{c.value}</p>
                            <p className="text-xs uppercase tracking-wide text-gray-500">{c.label}</p>
                        </div>
                    ))}
                </div>

                {/* Search + filter */}
                <div className="flex flex-col sm:flex-row gap-2 mb-6">
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search title or URL..."
                        className="flex-1 min-w-0 p-3 border-2 border-nust-blue rounded-lg focus:outline-none focus:ring-2 focus:ring-nust-orange"
                    />
                    <button
                        onClick={() => setOnlyBlacklisted((v) => !v)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            onlyBlacklisted
                                ? "bg-nust-blue text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        🚫 Blacklisted only
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded-xl border-2 border-red-300 bg-red-50 text-red-700 text-sm">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-nust-blue mx-auto"></div>
                        <p className="mt-4 text-nust-blue/60">Loading documents...</p>
                    </div>
                )}

                {!loading && visible.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
                        <span className="text-6xl">📭</span>
                        <p className="mt-4 text-lg text-gray-600">
                            {docs.length === 0
                                ? "No documents in the corpus yet."
                                : "No documents match this filter."}
                        </p>
                    </div>
                )}

                {/* Documents */}
                <div className="space-y-4">
                    {visible.map((doc) => (
                        <div
                            key={doc.id}
                            className={`bg-white border-2 rounded-xl p-4 sm:p-6 shadow-[4px_4px_0px_var(--nust-blue)] ${
                                doc.indexed ? "border-nust-blue" : "border-red-400 opacity-80"
                            }`}
                        >
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <h2 className="text-lg sm:text-xl font-heading text-nust-blue break-words min-w-0">
                                    {doc.title || fileName(doc.url)}
                                </h2>
                                <a
                                    href={doc.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-nust-orange hover:underline text-sm whitespace-nowrap flex-shrink-0"
                                >
                                    Open ↗
                                </a>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3 text-xs">
                                {!doc.indexed && (
                                    <span className="px-2 py-1 rounded bg-red-100 text-red-700 font-bold uppercase">
                                        Blacklisted
                                    </span>
                                )}
                                <span className="px-2 py-1 rounded bg-gray-100 text-gray-600 uppercase font-bold">
                                    {doc.source_type}
                                </span>
                                {doc.doc_type && (
                                    <span className="px-2 py-1 rounded bg-gray-100 text-gray-600">{doc.doc_type}</span>
                                )}
                                {doc.school && (
                                    <span className="px-2 py-1 rounded bg-gray-100 text-gray-600">{doc.school}</span>
                                )}
                                {doc.host && (
                                    <span className="px-2 py-1 rounded bg-gray-100 text-gray-500">{doc.host}</span>
                                )}
                                <span className="px-2 py-1 rounded bg-nust-orange/15 text-nust-blue font-medium">
                                    {doc.sections[0]?.count ?? 0} sections
                                </span>
                                {doc.needs_ocr && (
                                    <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 font-bold">
                                        Needs OCR
                                    </span>
                                )}
                                {doc.last_changed && (
                                    <span className="px-2 py-1 rounded bg-gray-100 text-gray-500">
                                        Changed {formatDate(doc.last_changed)}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-xs text-gray-500">
                                    Last seen {formatDate(doc.last_seen)}
                                </span>
                                <button
                                    onClick={() => toggleIndexed(doc)}
                                    disabled={busyId === doc.id}
                                    className={`btn px-4 py-2 rounded-lg font-medium ml-auto disabled:opacity-50 ${
                                        doc.indexed
                                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                                            : "bg-green-500 text-white hover:bg-green-600"
                                    }`}
                                >
                                    {busyId === doc.id ? "..." : doc.indexed ? "🚫 Blacklist" : "✅ Restore"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
