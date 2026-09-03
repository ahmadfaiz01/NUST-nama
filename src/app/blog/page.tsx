import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blogs/blogData";
import { BookOpen } from "lucide-react";

export const metadata: Metadata = {
    title: "NUST Campus Guides & Student Blog | Rules, Cafes & Life at H-12",
    description:
        "Official student guides, orientation breakdowns, attendance rules, GPA calculation, and campus life tips for NUST H-12 Islamabad.",
    keywords: [
        "NUST blog",
        "NUST campus guide",
        "NUST student guide",
        "NUST Orientation 2026",
        "NUST attendance rules",
        "NUST GPA grading",
        "NUST H-12 food cafes",
    ],
    alternates: {
        canonical: "https://nustnama.life/blog",
    },
    openGraph: {
        title: "NUST Campus Guides & Student Blog | NUST Nama",
        description: "Verified student guides, orientation breakdowns, academic rules, and campus life on H-12 Islamabad.",
        url: "https://nustnama.life/blog",
        type: "website",
        images: [{ url: "/images/hero_aerial_1.jpg", width: 1200, height: 630, alt: "NUST Campus Guides" }],
    },
};

const CATEGORIES = ["All", "Admissions", "Orientation", "Academics", "Food & Cafes", "Campus Life"] as const;

export default async function BlogIndexPage({
    searchParams,
}: {
    searchParams?: Promise<{ category?: string }>;
}) {
    const resolvedParams = searchParams ? await searchParams : {};
    const selectedCategory = resolvedParams?.category || "All";

    const filteredPosts =
        selectedCategory === "All"
            ? BLOG_POSTS
            : BLOG_POSTS.filter((p) => p.category === selectedCategory);

    return (
        <div className="min-h-screen pb-24 bg-cream">
            {/* Standardized Hero Banner */}
            <div className="bg-nust-blue text-white py-12 relative overflow-hidden border-b-2 border-nust-blue">
                <div className="container relative z-10 text-center max-w-3xl mx-auto px-4">
                    <span className="inline-block bg-nust-orange text-white text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full border-2 border-nust-blue shadow-[2px_2px_0px_var(--nust-blue)] mb-3">
                        Campus Intelligence & Survival Guides
                    </span>
                    <h1 className="text-5xl md:text-7xl text-white mb-3 drop-shadow-[4px_4px_0px_var(--nust-orange)] font-heading leading-tight tracking-tight">
                        NUST NAMA BLOG
                    </h1>
                    <p className="font-display text-white/80 text-sm md:text-base max-w-xl mx-auto font-medium">
                        Student-verified survival guides, orientation schedules, GPA grading secrets, and food reviews on H-12.
                    </p>

                    {/* Category Filter Pills */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                        {CATEGORIES.map((cat) => {
                            const isSelected = selectedCategory === cat;
                            return (
                                <Link
                                    key={cat}
                                    href={cat === "All" ? "/blog" : `/blog?category=${encodeURIComponent(cat)}`}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold font-sans transition-all border-2 border-nust-blue shadow-[2px_2px_0px_var(--nust-blue)] cursor-pointer ${
                                        isSelected
                                            ? "bg-nust-orange text-white translate-y-[1px] shadow-none"
                                            : "bg-white text-nust-blue hover:bg-cream"
                                    }`}
                                >
                                    {cat}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="container max-w-6xl mx-auto px-4 mt-8">
                {/* Articles Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b-2 border-nust-blue/15 pb-4">
                        <div>
                            <h2 className="font-heading text-2xl md:text-3xl text-nust-blue">
                                {selectedCategory === "All" ? "LATEST ARTICLES & SURVIVAL GUIDES" : `${selectedCategory.toUpperCase()} ARTICLES`}
                            </h2>
                            <p className="text-xs text-nust-blue/70 font-sans mt-0.5">
                                Verified by students & updated every semester.
                            </p>
                        </div>
                    </div>

                    {/* Articles Grid */}
                    {filteredPosts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                            {filteredPosts.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className="group flex flex-col bg-white rounded-2xl border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)] hover:shadow-[7px_7px_0px_var(--nust-orange)] hover:-translate-y-1 transition-all duration-200 overflow-hidden"
                                >
                                    <div className="h-48 w-full overflow-hidden border-b-2 border-nust-blue relative bg-gray-50">
                                        <img
                                            src={post.coverImage}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <span className="absolute top-2.5 left-2.5 bg-nust-orange text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-nust-blue shadow-sm">
                                            {post.category}
                                        </span>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 text-xs text-nust-blue/60 font-sans font-medium mb-2">
                                                <span>
                                                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </span>
                                                <span>•</span>
                                                <span>{post.readTime}</span>
                                            </div>

                                            <h3 className="font-heading text-2xl text-nust-blue mb-2 leading-tight group-hover:text-nust-orange transition-colors">
                                                {post.title}
                                            </h3>

                                            <p className="text-xs text-gray-600 font-sans line-clamp-3 leading-relaxed mb-4">
                                                {post.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t-2 border-dashed border-gray-100 mt-auto">
                                            <div className="flex items-center gap-2">
                                                <img
                                                    src={post.author.avatar}
                                                    alt={post.author.name}
                                                    className="w-6 h-6 rounded-full border border-nust-blue object-cover bg-white"
                                                />
                                                <span className="text-xs font-bold text-nust-blue font-sans">{post.author.name}</span>
                                            </div>

                                            <span className="text-xs font-bold text-nust-orange flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                Read Guide →
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl border-2 border-nust-blue p-6">
                            <BookOpen className="w-12 h-12 text-nust-blue/30 mx-auto mb-3" />
                            <p className="font-heading text-xl text-nust-blue">More articles coming soon in this category!</p>
                            <Link href="/blog" className="btn btn-primary text-xs mt-4">
                                View All Guides
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
