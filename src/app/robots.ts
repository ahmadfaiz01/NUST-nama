import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/admin/", "/api/", "/profile"],
            },
            {
                userAgent: ["Googlebot", "Bingbot", "DuckDuckBot", "Baiduspider", "YandexBot"],
                allow: "/",
                disallow: ["/admin/", "/api/"],
            },
            {
                // Allow AI Crawlers for GEO (Generative Engine Optimization)
                userAgent: ["GPTBot", "PerplexityBot", "ClaudeBot", "Google-Extended", "Applebot-Extended"],
                allow: ["/", "/blog/", "/events/", "/map/", "/faq/", "/news/"],
                disallow: ["/admin/", "/api/"],
            },
        ],
        sitemap: "https://nustnama.life/sitemap.xml",
        host: "https://nustnama.life",
    };
}
