import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Calendar, ExternalLink, Sparkles, Building2, Newspaper } from "lucide-react";

export const metadata: Metadata = {
    title: "Campus News & Official Announcements | NUST Nama",
    description:
        "Stay updated with the latest verified news, academic circulars, research breakthroughs, and campus happenings at NUST H-12 Islamabad.",
    alternates: {
        canonical: "https://nustnama.life/news",
    },
    openGraph: {
        title: "Campus News & Official Announcements | NUST Nama",
        description: "Latest news, QS rankings, career updates, and academic notices from NUST Islamabad.",
        url: "https://nustnama.life/news",
        type: "website",
    },
};

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function getSourceStyle(source: string) {
    const styles: Record<string, { bg: string; text: string; border: string }> = {
        "NUST Official": { bg: "bg-nust-blue", text: "text-white", border: "border-nust-blue" },
        "Student Affairs": { bg: "bg-nust-orange", text: "text-white", border: "border-nust-blue" },
        "SEECS": { bg: "bg-purple-600", text: "text-white", border: "border-nust-blue" },
        "Library": { bg: "bg-emerald-600", text: "text-white", border: "border-nust-blue" },
        "Sports Complex": { bg: "bg-blue-600", text: "text-white", border: "border-nust-blue" },
        "Placement Office": { bg: "bg-amber-500", text: "text-nust-blue", border: "border-nust-blue" },
    };
    return styles[source] || { bg: "bg-nust-orange", text: "text-white", border: "border-nust-blue" };
}

const SOURCES = ["All", "NUST Official", "Student Affairs", "SEECS", "Library", "Placement Office", "Sports Complex"] as const;

export default async function NewsPage({
    searchParams,
}: {
    searchParams?: Promise<{ source?: string }>;
}) {
    const resolvedParams = searchParams ? await searchParams : {};
    const selectedSource = resolvedParams?.source || "All";

    const supabase = await createClient();

    let query = supabase
        .from("news_items")
        .select("*")
        .eq("status", "approved")
        .order("published_at", { ascending: false });

    if (selectedSource !== "All") {
        query = query.eq("source", selectedSource);
    }

    const { data: newsItems } = await query;
    const items = newsItems && newsItems.length > 0 ? newsItems : [];

    const featuredItem = items[0];
    const regularItems = items.slice(1);

    return (
        <div className="min-h-screen pb-24 bg-cream">
            {/* Standardized Hero Banner */}
            <div className="bg-nust-blue text-white py-12 relative overflow-hidden border-b-2 border-nust-blue">
                <div className="container relative z-10 text-center max-w-3xl mx-auto px-4">
                    <span className="inline-block bg-nust-orange text-white text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full border-2 border-nust-blue shadow-[2px_2px_0px_var(--nust-blue)] mb-3">
                        Official Updates & Announcements
                    </span>
                    <h1 className="text-5xl md:text-7xl text-white mb-3 drop-shadow-[4px_4px_0px_var(--nust-orange)] font-heading leading-tight tracking-tight">
                        CAMPUS NEWS
                    </h1>
                    <p className="font-display text-white/80 text-sm md:text-base max-w-xl mx-auto font-medium">
                        Verified circulars, research milestones, placement drives, and society updates across NUST H-12.
                    </p>

                    {/* Source Filter Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                        {SOURCES.map((src) => {
                            const isSelected = selectedSource === src;
                            return (
                                <Link
                                    key={src}
                                    href={src === "All" ? "/news" : `/news?source=${encodeURIComponent(src)}`}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold font-sans transition-all border-2 border-nust-blue shadow-[2px_2px_0px_var(--nust-blue)] cursor-pointer ${
                                        isSelected
                                            ? "bg-nust-orange text-white translate-y-[1px] shadow-none"
                                            : "bg-white text-nust-blue hover:bg-cream"
                                    }`}
                                >
                                    {src}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="container max-w-6xl mx-auto px-4 mt-10">
                {/* Featured Headline Story */}
                {featuredItem && (
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-3 px-1">
                            <Sparkles className="w-5 h-5 text-nust-orange" />
                            <h2 className="font-heading text-xl text-nust-blue tracking-wider uppercase">
                                TOP STORY
                            </h2>
                        </div>

                        <div className="bg-white rounded-2xl border-2 border-nust-blue shadow-[6px_6px_0px_var(--nust-blue)] p-6 md:p-8">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span
                                    className={`text-xs font-bold px-3 py-1 rounded-full border-2 shadow-xs uppercase tracking-wider ${
                                        getSourceStyle(featuredItem.source).bg
                                    } ${getSourceStyle(featuredItem.source).text} ${
                                        getSourceStyle(featuredItem.source).border
                                    }`}
                                >
                                    {featuredItem.source}
                                </span>
                                <span className="text-xs text-nust-blue/60 font-sans font-medium flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-nust-orange" />
                                    {formatDate(featuredItem.published_at)}
                                </span>
                            </div>

                            <h3 className="font-heading text-3xl md:text-5xl text-nust-blue mb-4 leading-tight">
                                {featuredItem.title}
                            </h3>

                            <p className="text-gray-700 font-sans text-base md:text-lg leading-relaxed mb-6">
                                {featuredItem.summary}
                            </p>

                            {featuredItem.url && featuredItem.url !== "#" && (
                                <Link
                                    href={featuredItem.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary text-xs py-2 px-5 inline-flex items-center gap-1.5 shadow-[2px_2px_0px_var(--nust-blue)]"
                                >
                                    <span>Read Official Release</span>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                            )}
                        </div>
                    </div>
                )}

                {/* News Grid */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b-2 border-nust-blue/15 pb-4">
                        <div>
                            <h2 className="font-heading text-2xl md:text-3xl text-nust-blue">
                                {selectedSource === "All" ? "LATEST NOTICES & HIGHLIGHTS" : `${selectedSource.toUpperCase()} NEWS`}
                            </h2>
                            <p className="text-xs text-nust-blue/70 font-sans mt-0.5">
                                Showing verified announcements from campus departments.
                            </p>
                        </div>
                    </div>

                    {regularItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                            {regularItems.map((item) => {
                                const sourceStyle = getSourceStyle(item.source);
                                return (
                                    <div
                                        key={item.id}
                                        className="group flex flex-col bg-white rounded-2xl border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)] hover:shadow-[7px_7px_0px_var(--nust-orange)] hover:-translate-y-1 transition-all duration-200 p-6 justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center justify-between gap-2 mb-3">
                                                <span
                                                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border shadow-xs uppercase tracking-wider ${sourceStyle.bg} ${sourceStyle.text} ${sourceStyle.border}`}
                                                >
                                                    {item.source}
                                                </span>
                                                <span className="text-[11px] text-nust-blue/60 font-sans font-medium">
                                                    {formatDate(item.published_at)}
                                                </span>
                                            </div>

                                            <h3 className="font-heading text-2xl text-nust-blue mb-3 leading-tight group-hover:text-nust-orange transition-colors">
                                                {item.title}
                                            </h3>

                                            <p className="text-xs text-gray-600 font-sans leading-relaxed line-clamp-4 mb-4">
                                                {item.summary}
                                            </p>
                                        </div>

                                        <div className="pt-3 border-t-2 border-dashed border-gray-100 mt-auto">
                                            {item.url && item.url !== "#" ? (
                                                <Link
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs font-bold text-nust-orange hover:underline flex items-center justify-between"
                                                >
                                                    <span>View Official Notice</span>
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-gray-400 font-sans">
                                                    Verified Campus Notice
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl border-2 border-nust-blue p-6">
                            <Newspaper className="w-12 h-12 text-nust-blue/30 mx-auto mb-3" />
                            <p className="font-heading text-xl text-nust-blue">No news found for this category.</p>
                            <Link href="/news" className="btn btn-primary text-xs mt-4">
                                View All News
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
