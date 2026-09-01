import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS, type BlogPost } from "@/lib/blogs/blogData";
import { BookOpen, Calendar, Clock, Sparkles, Tag } from "lucide-react";

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

const CATEGORIES = ["All", "Orientation", "Academics", "Food & Cafes", "Campus Life"] as const;

export default function BlogIndexPage({
    searchParams,
}: {
    searchParams?: Promise<{ category?: string; q?: string }>;
}) {
    const posts = BLOG_POSTS;
    const featuredPost = posts[0];
    const regularPosts = posts.slice(1);

    return (
        <div className="min-h-screen pb-20 bg-cream">
            {/* Standardized Hero Banner */}
            <div className="bg-nust-blue text-white py-10 relative overflow-hidden border-b-2 border-nust-blue">
                <div className="container relative z-10 text-center max-w-3xl mx-auto px-4">
                    <span className="inline-block bg-nust-orange text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border-2 border-nust-blue shadow-[2px_2px_0px_var(--nust-blue)] mb-3">
                        Campus Intelligence & Guides
                    </span>
                    <h1 className="text-5xl md:text-6xl text-white mb-2 drop-shadow-[4px_4px_0px_var(--nust-orange)] font-heading leading-tight">
                        NUST NAMA BLOG
                    </h1>
                    <p className="font-display text-white/80 text-sm md:text-base max-w-xl mx-auto font-medium">
                        Verified student survival guides, orientation breakdowns, grading secrets, and campus life on H-12.
                    </p>
                </div>
            </div>

            <div className="container max-w-6xl mx-auto px-4 mt-8">
                {/* Featured Post Hero Card */}
                {featuredPost && (
                    <div className="mb-12">
                        <div className="flex items-center gap-2 mb-3 px-1">
                            <Sparkles className="w-5 h-5 text-nust-orange" />
                            <h2 className="font-heading text-xl text-nust-blue tracking-wider uppercase">
                                FEATURED GUIDE
                            </h2>
                        </div>

                        <Link
                            href={`/blog/${featuredPost.slug}`}
                            className="group block bg-white rounded-2xl border-2 border-nust-blue shadow-[6px_6px_0px_var(--nust-blue)] hover:shadow-[10px_10px_0px_var(--nust-orange)] hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                                <div className="lg:col-span-6 h-64 lg:h-auto min-h-[280px] relative overflow-hidden border-b-2 lg:border-b-0 lg:border-r-2 border-nust-blue bg-black/5">
                                    <img
                                        src={featuredPost.coverImage}
                                        alt={featuredPost.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3 bg-nust-orange text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-nust-blue shadow-[2px_2px_0px_var(--nust-blue)]">
                                        {featuredPost.category}
                                    </div>
                                </div>

                                <div className="lg:col-span-6 p-6 lg:p-8 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 text-xs text-nust-blue/70 mb-3 font-sans font-medium">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-nust-orange" />
                                                {new Date(featuredPost.publishedAt).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3.5 h-3.5 text-nust-blue" />
                                                {featuredPost.readTime}
                                            </span>
                                        </div>

                                        <h3 className="font-heading text-3xl md:text-4xl text-nust-blue mb-3 leading-tight group-hover:text-nust-orange transition-colors">
                                            {featuredPost.title}
                                        </h3>

                                        <p className="text-gray-600 font-sans text-sm md:text-base line-clamp-3 leading-relaxed mb-6">
                                            {featuredPost.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t-2 border-nust-blue/10">
                                        <div className="flex items-center gap-2.5">
                                            <img
                                                src={featuredPost.author.avatar}
                                                alt={featuredPost.author.name}
                                                className="w-8 h-8 rounded-full border border-nust-blue object-cover bg-white"
                                            />
                                            <div>
                                                <p className="text-xs font-bold text-nust-blue font-sans">{featuredPost.author.name}</p>
                                                <p className="text-[10px] text-gray-500 font-sans">{featuredPost.author.role}</p>
                                            </div>
                                        </div>

                                        <span className="btn btn-primary text-xs py-1.5 px-4">
                                            Read Guide →
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                )}

                {/* All Articles Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b-2 border-nust-blue/15 pb-4">
                        <div>
                            <h2 className="font-heading text-2xl md:text-3xl text-nust-blue">
                                LATEST ARTICLES & GUIDES
                            </h2>
                            <p className="text-xs text-nust-blue/70 font-sans mt-0.5">
                                Search-optimized, student-verified articles updated every semester.
                            </p>
                        </div>
                    </div>

                    {/* Articles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                        {regularPosts.map((post) => (
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

                                        <span className="text-xs font-bold text-nust-orange group-hover:translate-x-1 transition-transform">
                                            Read →
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
