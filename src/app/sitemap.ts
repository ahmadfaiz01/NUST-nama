import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blogs/blogData";

const BASE_URL = "https://nustnama.life";

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: `${BASE_URL}`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/events`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.95,
        },
        {
            url: `${BASE_URL}/map`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/blog`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${BASE_URL}/ask`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.85,
        },
        {
            url: `${BASE_URL}/news`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/faq`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${BASE_URL}/post-event`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
        },
    ];

    const blogRoutes: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
        url: `${BASE_URL}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.publishedAt),
        changeFrequency: "weekly",
        priority: 0.85,
    }));

    return [...staticRoutes, ...blogRoutes];
}
