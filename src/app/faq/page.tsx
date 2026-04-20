"use client";

import { useState } from "react";
import Link from "next/link";

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
    {
        q: "What is Gupshup?",
        a: "Gupshup is NUST's live campus chat. Join topic or event rooms and chat with other students in real time.",
    },
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
            <section className="py-12 bg-nust-blue">
                <div className="container">
                    <h1 className="text-4xl md:text-6xl text-white drop-shadow-[4px_4px_0px_var(--nust-orange)] mb-2">
                        FREQUENTLY ASKED
                    </h1>
                    <p className="font-display text-white/70 text-lg">
                        Got questions? We&apos;ve got answers.
                    </p>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="py-6 border-b-2 border-nust-blue bg-white">
                <div className="container">
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/post-event" className="btn btn-primary">📝 Post an Event</Link>
                        <Link href="/events" className="btn btn-outline">🎯 Explore Events</Link>
                        <Link href="/chatter" className="btn btn-outline">💬 Gupshup</Link>
                        <Link href="/profile" className="btn btn-outline">👤 My Profile</Link>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-12">
                <div className="container max-w-3xl">
                    <div className="space-y-3">
                        {faqs.map((item, i) => {
                            const isOpen = openIndex === i;
                            return (
                                <div
                                    key={i}
                                    className="bg-nust-blue border-2 border-nust-blue rounded-xl overflow-hidden shadow-[4px_4px_0px_var(--nust-orange)]"
                                >
                                    <button
                                        onClick={() => setOpenIndex(isOpen ? null : i)}
                                        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                                    >
                                        <span className="font-display font-bold text-white pr-4">{item.q}</span>
                                        <span className={`text-nust-orange font-heading text-2xl transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-45" : ""}`}>
                                            +
                                        </span>
                                    </button>
                                    {isOpen && (
                                        <div className="px-5 pb-5 border-t border-white/10">
                                            <p className="font-display text-white/80 pt-3 leading-relaxed">{item.a}</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Still need help? */}
            <section className="py-12 bg-nust-blue">
                <div className="container text-center">
                    <h2 className="font-heading text-3xl text-white mb-3">STILL HAVE QUESTIONS?</h2>
                    <p className="font-display text-white/70 mb-6">Can&apos;t find what you&apos;re looking for? Reach out.</p>
                    <Link href="mailto:support@nustnama.com" className="btn bg-nust-orange text-nust-blue font-bold">
                        Contact Support
                    </Link>
                </div>
            </section>
        </div>
    );
}
