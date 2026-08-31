"use client";

import { useState } from "react";
import Link from "next/link";
import { GUPSHUP_ENABLED } from "@/lib/flags";

const faqs = [
    {
        q: "Who can sign in?",
        a: "Anyone with an official NUST Google account — @nust.edu.pk, @seecs.edu.pk, @smme.edu.pk, and all other NUST school domains. Personal Gmail accounts won't work.",
    },
    {
        q: "How do I post an event?",
        a: "Click 'Post Event' in the navbar, fill in the details and upload a poster. Admins will review and approve it within 24 hours.",
    },
    {
        q: "What is the Campus Heatmap?",
        a: "It shows real-time activity across NUST H-12 — which buildings and spots have events right now and how active they are.",
    },
    // Gupshup is behind GUPSHUP_ENABLED until it has moderation. Answering a
    // question about a feature nobody can open just reads as a broken link.
    ...(GUPSHUP_ENABLED
        ? [
            {
                q: "What is Gupshup?",
                a: "Gupshup is NUST's live campus chat. Join topic or event rooms and chat with other students in real time.",
            },
        ]
        : []),
    {
        q: "What are Crowd Vibes?",
        a: "When you check in at an event (GPS-verified), you submit a vibe — positive, neutral, or negative. Crowd Vibes show the live sentiment of everyone there.",
    },
    {
        q: "Do old events disappear?",
        a: "Yes. Events are automatically removed 7 days after they end to keep things fast and relevant.",
    },
    {
        q: "Is it free?",
        a: "Yes. Completely free for all NUST community members.",
    },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: "var(--cream)",
                backgroundImage: `linear-gradient(var(--nust-blue) 1px, transparent 1px), linear-gradient(90deg, var(--nust-blue) 1px, transparent 1px)`,
                backgroundSize: "100px 100px",
            }}
        >
            {/* Hero */}
            <section className="py-10 bg-nust-blue">
                <div className="container">
                    <h1 className="text-5xl md:text-6xl text-white mb-2 drop-shadow-[4px_4px_0px_var(--nust-orange)] font-heading leading-tight">
                        FREQUENTLY ASKED
                    </h1>
                    <p className="font-display text-white/70 text-lg md:text-xl max-w-2xl leading-normal">
                        Got questions? We&apos;ve got answers about campus rules, events, and features.
                    </p>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="py-6 border-b-2 border-nust-blue bg-white">
                <div className="container">
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/post-event" className="btn btn-primary">Post an Event</Link>
                        <Link href="/events" className="btn btn-outline">Explore Events</Link>
                        {GUPSHUP_ENABLED && <Link href="/chatter" className="btn btn-outline">Gupshup</Link>}
                        <Link href="/profile" className="btn btn-outline">My Profile</Link>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-12">
                <div className="container max-w-3xl">
                    <div className="space-y-4">
                        {faqs.map((item, i) => {
                            const isOpen = openIndex === i;
                            return (
                                <div
                                    key={i}
                                    className="bg-white border-2 border-nust-blue rounded-2xl overflow-hidden shadow-[4px_4px_0px_var(--nust-blue)] transition-all"
                                >
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? null : i)}
                                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-cream/40 transition-colors cursor-pointer"
                                    >
                                        <span className="font-heading text-lg md:text-xl text-nust-blue pr-4">{item.q}</span>
                                        <span className={`w-8 h-8 rounded-full border-2 border-nust-blue flex items-center justify-center text-nust-blue font-heading text-lg transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-45 bg-nust-orange text-nust-blue" : "bg-cream"}`}>
                                            +
                                        </span>
                                    </button>
                                    {isOpen && (
                                        <div className="px-6 pb-6 border-t-2 border-nust-blue/10 bg-cream/20">
                                            <p className="font-display text-nust-blue/80 pt-4 leading-relaxed">{item.a}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Still need help? */}
            <section className="py-12">
                <div className="container text-center">
                    <div className="bg-nust-blue border-2 border-nust-blue rounded-2xl p-8 md:p-12 shadow-[8px_8px_0px_var(--nust-orange)] text-white max-w-3xl mx-auto">
                        <h2 className="font-heading text-3xl md:text-5xl mb-3">STILL HAVE QUESTIONS?</h2>
                        <p className="font-display text-white/70 text-lg mb-6 max-w-md mx-auto">Can&apos;t find what you&apos;re looking for? Reach out to support or ask our AI guide.</p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link href="/ask" className="btn bg-nust-orange text-nust-blue font-bold">
                                Ask NUST Nama AI
                            </Link>
                            <Link href="mailto:support@nustnama.com" className="btn bg-white text-nust-blue font-bold hover:bg-cream">
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
