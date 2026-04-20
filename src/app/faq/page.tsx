"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
    {
        category: "Getting Started",
        questions: [
            {
                q: "What is NUST Nama?",
                a: "NUST Nama is your campus intelligence platform — discover events, see real-time crowd vibes, chat with fellow students in Gupshup, and never miss what's happening at NUST.",
            },
            {
                q: "Who can use this platform?",
                a: "Any NUST student with an official NUST or school Google account (@nust.edu.pk, @seecs.edu.pk, @smme.edu.pk, etc.) can sign in and use the platform for free.",
            },
            {
                q: "How do I sign in?",
                a: "Click 'Get Started' and sign in with your official NUST Google account. No password needed — just one tap with Google.",
            },
            {
                q: "Is it free?",
                a: "100% free for all NUST community members. Always.",
            },
        ],
    },
    {
        category: "Events",
        questions: [
            {
                q: "How do I RSVP to an event?",
                a: "Click any event card, then tap the 'Mark as Going' button on the event detail page. Your RSVP is saved instantly.",
            },
            {
                q: "Can I post my own event?",
                a: "Yes! Click 'Post Event' in the navbar, fill in the details and upload a poster. Our admins review and approve it — usually within 24 hours.",
            },
            {
                q: "How long does event approval take?",
                a: "Most events are reviewed and approved within 24 hours. If it's urgent, reach out to us.",
            },
            {
                q: "What types of events can I post?",
                a: "Anything relevant to NUST — tech talks, society events, sports, cultural nights, workshops, study sessions. If it's for the NUST community, it belongs here.",
            },
            {
                q: "Do old events get deleted?",
                a: "Yes. Events are automatically cleaned up 7 days after they end to keep the platform fast and storage lean.",
            },
        ],
    },
    {
        category: "Features",
        questions: [
            {
                q: "What is the Campus Heatmap?",
                a: "The heatmap shows real-time activity across NUST H-12 campus — you can see which buildings and locations have events happening right now and how active they are.",
            },
            {
                q: "What is Gupshup?",
                a: "Gupshup is the campus chat — live chat rooms for different topics and events. Think of it as the NUST student lounge, but online.",
            },
            {
                q: "What are Crowd Vibes?",
                a: "When you check in at an event, you submit a vibe — positive, neutral, or negative. Crowd Vibes show the real-time sentiment of everyone at the event.",
            },
            {
                q: "How do I check in to an event?",
                a: "When you're physically at the event location (verified by GPS), tap 'Check In' on the event page. This feeds into the live heatmap and vibe data.",
            },
        ],
    },
    {
        category: "Account",
        questions: [
            {
                q: "Can I change my display name or school?",
                a: "Yes — go to Profile → Settings to update your display name, school/department, and preferences.",
            },
            {
                q: "My Google account was rejected. Why?",
                a: "Only official NUST Google accounts are allowed (@nust.edu.pk, @seecs.edu.pk, @smme.edu.pk, and other school domains). Personal Gmail accounts won't work.",
            },
            {
                q: "How do I report a problem?",
                a: "Use the Contact Support button below or reach out via the Gupshup chat. We're students too — we respond fast.",
            },
        ],
    },
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<string | null>(null);

    const toggleQuestion = (id: string) => {
        setOpenIndex(openIndex === id ? null : id);
    };

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: "var(--nust-blue)",
                backgroundImage: `linear-gradient(var(--nust-orange) 1px, transparent 1px), linear-gradient(90deg, var(--nust-orange) 1px, transparent 1px)`,
                backgroundSize: "80px 80px",
            }}
        >
            {/* Hero */}
            <section className="py-16 relative z-10">
                <div className="container">
                    <h1 className="text-5xl md:text-7xl text-white drop-shadow-[4px_4px_0px_var(--nust-orange)] mb-3">
                        GOT QUESTIONS?
                    </h1>
                    <p className="font-display text-white/70 text-xl">
                        We&apos;ve got answers. No cap.
                    </p>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="py-4 border-y-2 border-nust-orange/40 bg-nust-blue/80 backdrop-blur-sm relative z-10">
                <div className="container">
                    <div className="flex flex-wrap gap-3 justify-center">
                        <Link href="/post-event" className="btn bg-nust-orange text-nust-blue font-bold border-nust-orange hover:bg-nust-orange/90">
                            📝 Post an Event
                        </Link>
                        <Link href="/events" className="btn bg-white/10 text-white border-white/30 hover:bg-white/20">
                            🎯 Explore Events
                        </Link>
                        <Link href="/chatter" className="btn bg-white/10 text-white border-white/30 hover:bg-white/20">
                            💬 Open Gupshup
                        </Link>
                        <Link href="/profile" className="btn bg-white/10 text-white border-white/30 hover:bg-white/20">
                            👤 My Profile
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-12 relative z-10">
                <div className="container max-w-3xl">
                    {faqs.map((section, sectionIndex) => (
                        <div key={section.category} className="mb-10">
                            <h2 className="font-heading text-2xl text-nust-orange mb-4 border-b-2 border-nust-orange/40 pb-2 tracking-wider">
                                {section.category.toUpperCase()}
                            </h2>

                            <div className="space-y-3">
                                {section.questions.map((item, qIndex) => {
                                    const id = `${sectionIndex}-${qIndex}`;
                                    const isOpen = openIndex === id;

                                    return (
                                        <div
                                            key={id}
                                            className="border-2 border-white/20 rounded-xl overflow-hidden bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors"
                                        >
                                            <button
                                                onClick={() => toggleQuestion(id)}
                                                className="w-full px-5 py-4 flex items-center justify-between text-left"
                                            >
                                                <span className="font-display font-bold text-white pr-4">{item.q}</span>
                                                <span className={`text-nust-orange font-heading text-2xl transition-transform duration-200 flex-shrink-0 ${isOpen ? "rotate-45" : ""}`}>
                                                    +
                                                </span>
                                            </button>

                                            {isOpen && (
                                                <div className="px-5 pb-5 border-t border-white/10">
                                                    <p className="font-display text-white/80 pt-4 leading-relaxed">{item.a}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Still need help? */}
            <section className="py-12 border-t-2 border-nust-orange/30 relative z-10">
                <div className="container text-center">
                    <h2 className="font-heading text-3xl text-white mb-3 drop-shadow-[2px_2px_0px_var(--nust-orange)]">
                        STILL HAVE QUESTIONS?
                    </h2>
                    <p className="font-display text-white/60 mb-6">
                        Can&apos;t find what you&apos;re looking for? We&apos;re just a message away.
                    </p>
                    <Link
                        href="mailto:support@nustnama.com"
                        className="btn bg-nust-orange text-nust-blue font-bold shadow-[4px_4px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                        Contact Support
                    </Link>
                </div>
            </section>
        </div>
    );
}
