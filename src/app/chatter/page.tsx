"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import TopicRequestModal from "@/components/chatter/TopicRequestModal";

interface Thread {
    id: string;
    title: string;
    description: string;
    emoji: string;
    color_theme: string;
}

export default function ChatterLobby() {
    const [threads, setThreads] = useState<Thread[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchThreads = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from("threads")
                .select("*")
                .eq("is_active", true)
                .order("created_at", { ascending: true });

            if (data) setThreads(data);
            setLoading(false);
        };
        fetchThreads();
    }, []);

    return (
        <div className="min-h-screen bg-cream pb-20">
            {/* Header */}
            <div className="bg-nust-blue text-white py-16 relative overflow-hidden">
                <div className="container relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-heading mb-2 drop-shadow-[4px_4px_0px_var(--nust-orange)]">
                        CAMPUS CHATTER
                    </h1>
                    <p className="font-display text-lg opacity-80 max-w-xl mx-auto">
                        Pick a room. Talk trash. Find your people.<br />
                        <span className="text-sm opacity-60 italic">(Keep it generally civil, yeah?)</span>
                    </p>
                </div>
                {/* Bg pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10"
                    style={{ backgroundImage: 'radial-gradient(#E59500 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
                </div>
            </div>

            <div className="container -mt-8 relative z-20">
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nust-blue"></div>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto bg-white rounded-2xl border-2 border-nust-blue overflow-hidden shadow-[4px_4px_0px_var(--nust-blue)]">
                        {/* Header Row */}
                        <div className="bg-nust-blue/5 p-4 border-b-2 border-nust-blue flex justify-between items-center">
                            <span className="font-heading text-xl text-nust-blue">CHANNELS ({threads.length})</span>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="text-xs font-bold uppercase tracking-wider text-nust-blue hover:text-nust-orange transition-colors"
                            >
                                + Request Topic
                            </button>
                        </div>

                        <div className="divide-y-2 divide-nust-blue/10">
                            {threads.map((thread) => (
                                <Link href={`/chatter/${thread.id}`} key={thread.id} className="block group hover:bg-nust-blue/5 transition-colors">
                                    <div className="flex items-center gap-4 p-4">
                                        {/* Icon */}
                                        <div className="w-10 h-10 flex items-center justify-center text-2xl bg-cream rounded-full border-2 border-transparent group-hover:border-nust-blue transition-all">
                                            {thread.emoji}
                                        </div>

                                        {/* Text */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <h3 className="font-bold text-nust-blue truncate">#{thread.title.toLowerCase().replace(/\s+/g, '-')}</h3>
                                                {/* Optional: Add a 'Live' indicator if needed later */}
                                            </div>
                                            <p className="text-xs text-gray-500 truncate font-medium">
                                                {thread.description}
                                            </p>
                                        </div>

                                        {/* Action */}
                                        <div className="text-nust-blue/30 group-hover:text-nust-blue transition-colors">
                                            →
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <TopicRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
