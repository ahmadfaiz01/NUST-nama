import Link from "next/link";

// Mock news data
const newsItems = [
    {
        id: "1",
        source: "NUST Official",
        title: "Semester Fee Challan Released for Spring 2026",
        summary: "The fee challan for Spring 2026 semester is now available on QALAM. Deadline for payment is February 28th.",
        url: "#",
        published_at: "2026-01-30T10:00:00",
        category: "Announcements",
    },
    {
        id: "2",
        source: "Library",
        title: "Extended Library Hours During Midterms",
        summary: "The library will remain open until 2 AM during the midterm examination period from Feb 5-15.",
        url: "#",
        published_at: "2026-01-29T14:00:00",
        category: "Facilities",
    },
    {
        id: "3",
        source: "SEECS",
        title: "Tech Fest 2026 Registrations Now Open",
        summary: "Register for Pakistan's largest student-run tech festival. Early bird discounts available until Feb 5th.",
        url: "#",
        published_at: "2026-01-28T09:00:00",
        category: "Events",
    },
    {
        id: "4",
        source: "Sports Complex",
        title: "Inter-School Sports Week Starting Monday",
        summary: "Annual sports week featuring cricket, football, basketball, and athletics. Come support your school!",
        url: "#",
        published_at: "2026-01-27T16:00:00",
        category: "Sports",
    },
    {
        id: "5",
        source: "Placement Office",
        title: "Google Hiring Event on Campus",
        summary: "Google will be conducting on-campus interviews for SWE internships. Register through the placement portal.",
        url: "#",
        published_at: "2026-01-26T11:00:00",
        category: "Career",
    },
    {
        id: "6",
        source: "Student Affairs",
        title: "New Bus Route Added for H-13 Sector",
        summary: "A new point bus service has been added covering H-13, with stops at major landmarks.",
        url: "#",
        published_at: "2026-01-25T08:00:00",
        category: "Transport",
    },
];

function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getCategoryColor(category: string) {
    const colors: Record<string, string> = {
        Announcements: "bg-red-500",
        Facilities: "bg-green-500",
        Events: "bg-purple-500",
        Sports: "bg-blue-500",
        Career: "bg-yellow-500",
        Transport: "bg-teal-500",
    };
    return colors[category] || "bg-gray-500";
}

export default function NewsPage() {
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
                        {newsItems.map((item, index) => (
                            <Link
                                key={item.id}
                                href={item.url}
                                className={`block bg-white border-2 border-nust-blue rounded-lg overflow-hidden shadow-[4px_4px_0px_var(--nust-blue)] hover:shadow-[8px_8px_0px_var(--nust-blue)] hover:-translate-y-1 transition-all ${index === 0 ? "lg:col-span-2" : ""
                                    }`}
                            >
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`px-3 py-1 rounded-full text-white text-xs font-bold uppercase ${getCategoryColor(item.category)}`}>
                                            {item.category}
                                        </span>
                                        <span className="text-nust-blue/50 text-sm font-medium">
                                            {formatDate(item.published_at)}
                                        </span>
                                        <span className="text-nust-blue/50 text-sm">
                                            via {item.source}
                                        </span>
                                    </div>

                                    <h3 className={`font-heading text-nust-blue mb-3 ${index === 0 ? "text-3xl md:text-4xl" : "text-2xl"}`}>
                                        {item.title}
                                    </h3>

                                    <p className="text-nust-blue/70 line-clamp-2">
                                        {item.summary}
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

                    {/* Newsletter Signup */}
                    <div className="mt-16 bg-nust-blue rounded-xl p-8 md:p-12 text-center shadow-[8px_8px_0px_var(--nust-orange)]">
                        <h2 className="text-4xl text-white mb-4">NEVER MISS AN UPDATE</h2>
                        <p className="text-white/70 mb-6 max-w-xl mx-auto">
                            Get important announcements delivered straight to your inbox. No spam, just what matters.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your NUST email"
                                className="flex-1 px-4 py-3 rounded-full border-2 border-white bg-white/10 text-white placeholder:text-white/50 focus:outline-none focus:border-nust-orange"
                            />
                            <button className="btn bg-nust-orange text-nust-blue font-bold px-6 py-3">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
