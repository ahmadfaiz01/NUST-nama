import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

// Fallback mock data (shown if no news in database)
const mockNewsItems = [
    {
        id: "1",
        source: "NUST Official",
        title: "Welcome to What's Up NUST!",
        summary: "Stay tuned for the latest news and announcements from NUST. We're fetching fresh content for you!",
        url: "#",
        published_at: new Date().toISOString(),
    },
];

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getSourceColor(source: string) {
    const colors: Record<string, string> = {
        "NUST Official": "bg-red-500",
        "SEECS": "bg-purple-500",
        "Library": "bg-green-500",
        "Sports Complex": "bg-blue-500",
        "Placement Office": "bg-yellow-500",
        "Student Affairs": "bg-teal-500",
    };
    return colors[source] || "bg-nust-orange";
}

export default async function NewsPage() {
    const supabase = await createClient();
    
    // Calculate date 7 days ago
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const [{ data: recentNews }, { data: olderNews }] = await Promise.all([
        supabase
            .from("news_items")
            .select("*")
            .eq("status", "approved")
            .gte("published_at", oneWeekAgo.toISOString())
            .order("published_at", { ascending: false })
            .limit(20),
        supabase
            .from("news_items")
            .select("*")
            .eq("status", "approved")
            .lt("published_at", oneWeekAgo.toISOString())
            .order("published_at", { ascending: false })
            .limit(10),
    ]);

    // Headline grid: this week's news, else fall back to older, else mock
    const hasRecent = !!recentNews?.length;
    const displayItems = hasRecent ? recentNews : (olderNews?.length ? olderNews : mockNewsItems);
    // Archive only when it isn't already the headline grid
    const archiveItems = hasRecent ? (olderNews ?? []) : [];

    return (
        <div className="min-h-screen bg-cream">
            {/* Hero */}
            <section className="py-16 bg-nust-orange">
                <div className="container">
                    <h1 className="text-5xl md:text-7xl text-nust-blue mb-4 drop-shadow-[4px_4px_0px_rgba(255,255,255,0.3)]">
                        CAMPUS NEWS
                    </h1>
                    <p className="text-nust-blue/80 text-xl max-w-2xl">
                        Stay updated with the latest announcements, notices, and happenings at NUST.
                    </p>
                </div>
            </section>

            {/* News Grid */}
            <section className="py-12">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {displayItems.map((item, index) => (
                            <Link
                                key={item.id}
                                href={item.url || "#"}
                                target={item.url && item.url !== "#" ? "_blank" : undefined}
                                rel={item.url && item.url !== "#" ? "noopener noreferrer" : undefined}
                                className={`block bg-white border-2 border-nust-blue rounded-lg overflow-hidden shadow-[4px_4px_0px_var(--nust-blue)] hover:shadow-[8px_8px_0px_var(--nust-blue)] hover:-translate-y-1 transition-all ${index === 0 ? "lg:col-span-2" : ""
                                    }`}
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`px-3 py-1 rounded-full text-white text-xs font-bold uppercase ${getSourceColor(item.source || "NUST Official")}`}>
                                            {item.source || "NUST"}
                                        </span>
                                        <span className="text-nust-blue/50 text-sm font-medium">
                                            {item.published_at ? formatDate(item.published_at) : "Recent"}
                                        </span>
                                    </div>

                                    <h3 className={`font-heading text-nust-blue mb-3 ${index === 0 ? "text-3xl md:text-4xl" : "text-2xl"}`}>
                                        {item.title}
                                    </h3>

                                    <p className="text-nust-blue/70 line-clamp-2">
                                        {item.summary || "Click to read the full article."}
                                    </p>

                                    <div className="mt-4 flex items-center gap-2 text-nust-orange font-bold">
                                        Read More
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Archive */}
                    {archiveItems.length > 0 && (
                        <div className="mt-16 bg-nust-blue rounded-xl p-8 md:p-12 shadow-[8px_8px_0px_var(--nust-orange)]">
                            <h2 className="text-4xl text-white mb-6 text-center">EARLIER ON CAMPUS</h2>
                            <div className="max-w-3xl mx-auto divide-y divide-white/20">
                                {archiveItems.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={item.url || "#"}
                                        target={item.url && item.url !== "#" ? "_blank" : undefined}
                                        rel={item.url && item.url !== "#" ? "noopener noreferrer" : undefined}
                                        className="flex items-baseline gap-4 py-3 group"
                                    >
                                        <span className="text-white/50 text-sm font-medium shrink-0 w-16">
                                            {item.published_at ? formatDate(item.published_at) : "—"}
                                        </span>
                                        <span className="text-white group-hover:text-nust-orange transition-colors">
                                            {item.title}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
