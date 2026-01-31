"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
    {
        category: "Getting Started",
        questions: [
            {
                q: "What is What's Up NUST?",
                a: "What's Up NUST is a campus intelligence platform that helps NUST students discover events, see real-time crowd vibes, and never miss what's happening on campus.",
            },
            {
                q: "Who can use this platform?",
                a: "All NUST students, faculty, and staff with a valid @nust.edu.pk email address can create an account and use the platform.",
            },
            {
                q: "Is it free to use?",
                a: "Yes! What's Up NUST is completely free for all NUST community members.",
            },
        ],
    },
    {
        category: "Events",
        questions: [
            {
                q: "How do I RSVP to an event?",
                a: "Simply click on any event card, and on the event detail page, click the 'RSVP' button. You'll receive a confirmation and reminders before the event.",
            },
            {
                q: "Can I post my own event?",
                a: "Absolutely! Click 'Post Event' in the navigation bar, fill out the event details, add media, and submit. Your event will be reviewed and published within 24 hours.",
            },
            {
                q: "How long does event approval take?",
                a: "Most events are reviewed and approved within 24 hours. You'll receive a notification once your event is live.",
            },
            {
                q: "What types of events can I post?",
                a: "You can post academic events, society activities, sports, cultural events, workshops, study groups, and more. As long as it's relevant to the NUST community!",
            },
        ],
    },
    {
        category: "Features",
        questions: [
            {
                q: "What is the Campus Heatmap?",
                a: "The Campus Heatmap shows real-time activity across NUST campus. You can see which locations have events happening right now and how crowded they are.",
            },
            {
                q: "What are 'Crowd Vibes'?",
                a: "Crowd Vibes show the real-time sentiment of people at events — whether attendees are enjoying it, if it's boring, or if something exciting is happening.",
            },
            {
                q: "How do I check in to an event?",
                a: "When you're physically at the event location (verified by GPS), you can check in on the event page. This helps with crowd tracking and earning badges.",
            },
        ],
    },
    {
        category: "Account",
        questions: [
            {
                q: "How do I sign up?",
                a: "Click 'Get Started', enter your NUST email and create a password. You'll receive a verification email to confirm your account.",
            },
            {
                q: "Can I change my display name?",
                a: "Yes! Go to your Profile → Settings to update your display name, school/department, and notification preferences.",
            },
            {
                q: "I forgot my password. What do I do?",
                a: "On the login page, click 'Forgot password?' and enter your NUST email. You'll receive a link to reset your password.",
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
                backgroundColor: "var(--cream)",
                backgroundImage: `linear-gradient(var(--nust-blue) 1px, transparent 1px), linear-gradient(90deg, var(--nust-blue) 1px, transparent 1px)`,
                backgroundSize: "100px 100px",
            }}
        >
            {/* Hero */}
            <section className="py-12 bg-nust-blue">
                <div className="container">
                    <h1 className="text-4xl md:text-6xl text-white drop-shadow-[4px_4px_0px_var(--nust-orange)]">
                        FREQUENTLY ASKED
                    </h1>
                    <p className="font-display text-white/70 text-lg mt-2">
                        Got questions? We&apos;ve got answers.
                    </p>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="py-8 border-b-2 border-nust-blue bg-white">
                <div className="container">
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href="/post-event" className="btn btn-primary">
                            📝 Post an Event
                        </Link>
                        <Link href="/events" className="btn btn-outline">
                            🎯 Explore Events
                        </Link>
                        <Link href="/calendar" className="btn btn-outline">
                            📅 View Calendar
                        </Link>
                        <Link href="/profile" className="btn btn-outline">
                            👤 My Profile
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-12">
                <div className="container max-w-3xl">
                    {faqs.map((section, sectionIndex) => (
                        <div key={section.category} className="mb-8">
                            <h2 className="font-heading text-2xl text-nust-blue mb-4 border-b-2 border-nust-orange pb-2">
                                {section.category.toUpperCase()}
                            </h2>

                            <div className="space-y-3">
                                {section.questions.map((item, qIndex) => {
                                    const id = `${sectionIndex}-${qIndex}`;
                                    const isOpen = openIndex === id;

                                    return (
                                        <div
                                            key={id}
                                            className="bg-white border-2 border-nust-blue rounded-lg overflow-hidden"
                                        >
                                            <button
                                                onClick={() => toggleQuestion(id)}
                                                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-nust-blue/5 transition-colors"
                                            >
                                                <span className="font-display font-bold text-nust-blue pr-4">{item.q}</span>
                                                <span className={`text-nust-orange font-heading text-xl transition-transform ${isOpen ? 'rotate-45' : ''}`}>
                                                    +
                                                </span>
                                            </button>

                                            {isOpen && (
                                                <div className="px-5 pb-4 border-t border-gray-100">
                                                    <p className="font-display text-nust-blue/70 pt-3">{item.a}</p>
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
            <section className="py-12 bg-nust-blue">
                <div className="container text-center">
                    <h2 className="font-heading text-3xl text-white mb-4">STILL HAVE QUESTIONS?</h2>
                    <p className="font-display text-white/70 mb-6">
                        Can&apos;t find what you&apos;re looking for? Reach out to us!
                    </p>
                    <Link href="mailto:support@whatsupnust.com" className="btn bg-nust-orange text-nust-blue font-bold">
                        Contact Support
                    </Link>
                </div>
            </section>
        </div>
    );
}
