import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    getBlogPost,
    getAllBlogSlugs,
    getRelatedBlogPosts,
} from "@/lib/blogs/blogData";
import {
    Calendar,
    Clock,
    ChevronRight,
    HelpCircle,
    Bookmark,
    CheckCircle,
} from "lucide-react";
import { ShareButtons } from "./ShareButtons";

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
    params,
}: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getBlogPost(slug);

    if (!post) {
        return {
            title: "Post Not Found | NUST Nama",
            description: "The requested campus guide or article was not found.",
        };
    }

    const canonicalUrl = `https://nustnama.life/blog/${post.slug}`;

    return {
        title: post.title,
        description: post.description,
        keywords: post.keywords,
        authors: [{ name: post.author.name }],
        creator: post.author.name,
        publisher: "NUST Nama",
        alternates: {
            canonical: canonicalUrl,
        },
        other: {
            "geo.region": "PK-IS",
            "geo.placename": "Islamabad, NUST H-12 Campus, Pakistan",
            "geo.position": "33.6428;72.9905",
            "ICBM": "33.6428, 72.9905",
        },
        openGraph: {
            title: post.title,
            description: post.description,
            url: canonicalUrl,
            siteName: "NUST Nama",
            type: "article",
            publishedTime: post.publishedAt,
            modifiedTime: post.updatedAt,
            authors: [post.author.name],
            tags: post.tags,
            images: [
                {
                    url: post.coverImage,
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.description,
            images: [post.coverImage],
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = getBlogPost(slug);

    if (!post) {
        notFound();
    }

    const relatedPosts = getRelatedBlogPosts(slug, 3);
    const postUrl = `https://nustnama.life/blog/${post.slug}`;

    // ─── JSON-LD Structured Data Schemas ─────────────────────────────────────
    const articleSchema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.description,
        "image": [`https://nustnama.life${post.coverImage}`],
        "datePublished": post.publishedAt,
        "dateModified": post.updatedAt,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": postUrl,
        },
        "author": {
            "@type": "Person",
            "name": post.author.name,
            "jobTitle": post.author.role,
        },
        "publisher": {
            "@type": "Organization",
            "name": "NUST Nama",
            "logo": {
                "@type": "ImageObject",
                "url": "https://nustnama.life/icon.png",
            },
        },
        "keywords": post.keywords.join(", "),
        "articleSection": post.category,
    };

    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://nustnama.life",
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://nustnama.life/blog",
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": postUrl,
            },
        ],
    };

    const faqSchema = post.faqs && post.faqs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": post.faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer,
            },
        })),
    } : null;

    return (
        <div className="min-h-screen pb-24 bg-cream">
            {/* Schema Injection */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}

            {/* Breadcrumb Navigation */}
            <div className="bg-white border-b-2 border-nust-blue/15 py-3 shadow-xs">
                <div className="container max-w-4xl mx-auto px-4 flex items-center gap-1.5 text-xs text-nust-blue/70 font-sans font-medium">
                    <Link href="/" className="hover:text-nust-orange transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-nust-blue/40" />
                    <Link href="/blog" className="hover:text-nust-orange transition-colors">
                        Blog & Guides
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5 text-nust-blue/40" />
                    <span className="text-nust-blue font-bold truncate max-w-[200px] sm:max-w-md">
                        {post.title}
                    </span>
                </div>
            </div>

            {/* Article Main Container */}
            <article className="container max-w-4xl mx-auto px-4 mt-8">
                {/* Header Card */}
                <div className="bg-white rounded-2xl border-2 border-nust-blue shadow-[6px_6px_0px_var(--nust-blue)] p-6 md:p-10 mb-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="bg-nust-orange text-white text-xs font-bold px-3.5 py-1 rounded-full border-2 border-nust-blue shadow-[1.5px_1.5px_0px_var(--nust-blue)] uppercase tracking-wider">
                            {post.category}
                        </span>
                        <span className="text-xs text-nust-blue/70 font-sans font-medium flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-nust-orange" />
                            {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </span>
                        <span className="text-xs text-nust-blue/70 font-sans font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-nust-blue" />
                            {post.readTime}
                        </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-heading text-nust-blue mb-6 leading-[1.08] tracking-tight">
                        {post.title}
                    </h1>

                    {/* Author & Share Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t-2 border-nust-blue/10">
                        <div className="flex items-center gap-3">
                            <img
                                src={post.author.avatar}
                                alt={post.author.name}
                                className="w-11 h-11 rounded-full border-2 border-nust-blue object-cover bg-white shadow-xs"
                            />
                            <div>
                                <p className="text-sm font-bold text-nust-blue font-sans leading-tight">
                                    {post.author.name}
                                </p>
                                <p className="text-xs text-gray-500 font-sans mt-0.5">
                                    {post.author.role}
                                </p>
                            </div>
                        </div>

                        {/* Social Share Buttons */}
                        <ShareButtons title={post.title} url={postUrl} />
                    </div>
                </div>

                {/* Featured Cover Image */}
                <div className="rounded-2xl overflow-hidden border-2 border-nust-blue shadow-[6px_6px_0px_var(--nust-blue)] mb-8 bg-black/5 max-h-[480px]">
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover max-h-[480px]"
                    />
                </div>

                {/* Direct Answer Summary Box for GEO (Generative AI Overviews) */}
                <div className="bg-white border-2 border-nust-blue rounded-2xl shadow-[4px_4px_0px_var(--nust-blue)] p-6 mb-8 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-nust-orange text-white flex items-center justify-center shrink-0 border-2 border-nust-blue shadow-xs mt-0.5">
                        <Bookmark className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="font-heading text-xl text-nust-blue mb-1 leading-tight tracking-wide">
                            QUICK SUMMARY & TAKEAWAY
                        </h2>
                        <p className="text-sm text-gray-700 font-sans leading-relaxed">
                            {post.description}
                        </p>
                    </div>
                </div>

                {/* Article Body Content Rendered with ReactMarkdown */}
                <div className="bg-white rounded-2xl border-2 border-nust-blue shadow-[6px_6px_0px_var(--nust-blue)] p-6 sm:p-10 md:p-12 mb-10">
                    <div className="font-sans text-gray-800 leading-relaxed space-y-6">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h2: ({ children }) => (
                                    <h2 className="text-2xl sm:text-3xl font-heading text-nust-blue pt-6 pb-2 border-b-2 border-nust-blue/15 tracking-wide flex items-center gap-2">
                                        <span className="text-nust-orange">#</span>
                                        <span>{children}</span>
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="text-xl sm:text-2xl font-display font-bold text-nust-blue pt-4 tracking-tight">
                                        {children}
                                    </h3>
                                ),
                                p: ({ children }) => (
                                    <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                                        {children}
                                    </p>
                                ),
                                strong: ({ children }) => (
                                    <strong className="text-nust-blue font-bold">
                                        {children}
                                    </strong>
                                ),
                                a: ({ href, children }) => (
                                    <a
                                        href={href}
                                        className="text-nust-blue font-bold underline decoration-nust-orange decoration-2 hover:text-nust-orange transition-colors"
                                        target={href?.startsWith("http") ? "_blank" : undefined}
                                        rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
                                    >
                                        {children}
                                    </a>
                                ),
                                ul: ({ children }) => (
                                    <ul className="space-y-2.5 my-4 pl-2 list-none">
                                        {children}
                                    </ul>
                                ),
                                ol: ({ children }) => (
                                    <ol className="space-y-3 my-4 pl-2 list-decimal list-inside text-gray-700 font-medium">
                                        {children}
                                    </ol>
                                ),
                                li: ({ children }) => (
                                    <li className="flex items-start gap-2.5 text-base sm:text-lg text-gray-700 leading-relaxed">
                                        <span className="text-nust-orange font-bold mt-1 text-xs shrink-0">◆</span>
                                        <div className="flex-1">{children}</div>
                                    </li>
                                ),
                                blockquote: ({ children }) => (
                                    <div className="border-l-4 border-nust-orange bg-nust-orange/5 p-4 sm:p-5 rounded-r-xl font-medium text-gray-700 my-6 shadow-xs border-y border-r border-nust-blue/10">
                                        <div className="flex items-start gap-3">
                                            <span className="text-xl">💡</span>
                                            <div className="text-sm sm:text-base leading-relaxed">{children}</div>
                                        </div>
                                    </div>
                                ),
                                table: ({ children }) => (
                                    <div className="my-6 overflow-x-auto rounded-xl border-2 border-nust-blue shadow-[3px_3px_0px_var(--nust-blue)]">
                                        <table className="w-full text-left border-collapse text-sm sm:text-base">
                                            {children}
                                        </table>
                                    </div>
                                ),
                                thead: ({ children }) => (
                                    <thead className="bg-nust-blue text-white font-heading text-lg tracking-wider border-b-2 border-nust-blue">
                                        {children}
                                    </thead>
                                ),
                                th: ({ children }) => (
                                    <th className="p-3.5 font-bold uppercase border-r border-white/20 last:border-r-0">
                                        {children}
                                    </th>
                                ),
                                tbody: ({ children }) => (
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {children}
                                    </tbody>
                                ),
                                tr: ({ children }) => (
                                    <tr className="hover:bg-cream/40 transition-colors">
                                        {children}
                                    </tr>
                                ),
                                td: ({ children }) => (
                                    <td className="p-3.5 text-gray-700 border-r border-gray-200 last:border-r-0 font-sans">
                                        {children}
                                    </td>
                                ),
                                hr: () => (
                                    <hr className="my-8 border-t-2 border-dashed border-nust-blue/15" />
                                ),
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>

                    {/* FAQ Section (Optimized for AI Overviews / Google Snippets) */}
                    {post.faqs && post.faqs.length > 0 && (
                        <div className="mt-12 pt-8 border-t-2 border-nust-blue/15">
                            <div className="flex items-center gap-2 mb-6">
                                <HelpCircle className="w-6 h-6 text-nust-orange" />
                                <h2 className="font-heading text-2xl md:text-3xl text-nust-blue">
                                    FREQUENTLY ASKED QUESTIONS
                                </h2>
                            </div>

                            <div className="space-y-4">
                                {post.faqs.map((faq, i) => (
                                    <div
                                        key={i}
                                        className="bg-[#FCFAF5] border-2 border-nust-blue/30 rounded-xl p-5 shadow-[2px_2px_0px_rgba(27,58,107,0.1)]"
                                    >
                                        <h3 className="font-display font-bold text-base text-nust-blue mb-2 flex items-center gap-2">
                                            <span className="text-nust-orange font-bold">Q:</span>
                                            {faq.question}
                                        </h3>
                                        <p className="font-sans text-sm sm:text-base text-gray-700 leading-relaxed pl-5">
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    <div className="mt-10 pt-6 border-t-2 border-dashed border-gray-200 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-nust-blue uppercase mr-1">Tags:</span>
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="text-xs font-sans font-semibold bg-nust-blue/5 text-nust-blue px-3 py-1 rounded-full border border-nust-blue/15"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Author Bio Box */}
                <div className="bg-white rounded-2xl border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)] p-6 md:p-8 mb-12 flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                    <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-16 h-16 rounded-full border-2 border-nust-blue object-cover bg-white shadow-sm shrink-0"
                    />
                    <div>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                            <h3 className="font-heading text-2xl text-nust-blue leading-none">
                                Written by {post.author.name}
                            </h3>
                            <span className="text-xs font-bold text-nust-orange bg-nust-orange/10 px-2 py-0.5 rounded-full border border-nust-orange/30 flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Verified Contributor
                            </span>
                        </div>
                        <p className="text-xs text-gray-500 font-sans mb-3">{post.author.role}</p>
                        <p className="text-sm text-gray-600 font-sans leading-relaxed">
                            {post.author.bio}
                        </p>
                    </div>
                </div>

                {/* Related Articles */}
                {relatedPosts.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-6 px-1">
                            <h2 className="font-heading text-2xl md:text-3xl text-nust-blue">
                                RELATED GUIDES & ARTICLES
                            </h2>
                            <Link href="/blog" className="text-xs font-bold text-nust-orange hover:underline font-sans">
                                View All Guides →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedPosts.map((rel) => (
                                <Link
                                    key={rel.slug}
                                    href={`/blog/${rel.slug}`}
                                    className="group flex flex-col bg-white rounded-2xl border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)] hover:shadow-[7px_7px_0px_var(--nust-orange)] hover:-translate-y-1 transition-all duration-200 overflow-hidden"
                                >
                                    <div className="h-36 w-full overflow-hidden border-b-2 border-nust-blue bg-gray-50">
                                        <img
                                            src={rel.coverImage}
                                            alt={rel.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <h3 className="font-heading text-lg text-nust-blue mb-2 leading-tight group-hover:text-nust-orange transition-colors line-clamp-2">
                                            {rel.title}
                                        </h3>
                                        <span className="text-xs font-bold text-nust-orange mt-2">
                                            Read Guide →
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </div>
    );
}
