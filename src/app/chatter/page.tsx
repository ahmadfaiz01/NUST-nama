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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {threads.map((thread) => (
                            <Link href={`/chatter/${thread.id}`} key={thread.id} className="group">
                                <div className={`h-full bg-white rounded-2xl p-6 border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)] hover:shadow-[6px_6px_0px_var(--nust-blue)] hover:-translate-y-1 transition-all duration-200 relative overflow-hidden`}>

                                    {/* Color Accent */}
                                    <div className={`absolute top-0 right-0 w-24 h-24 ${thread.color_theme || 'bg-gray-200'} opacity-20 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500`}></div>

                                    <div className="relative z-10">
                                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left duration-300">
                                            {thread.emoji}
                                        </div>
                                        <h3 className="font-heading text-2xl text-nust-blue mb-2">
                                            {thread.title}
                                        </h3>
                                        <p className="text-gray-600 font-medium leading-relaxed">
                                            {thread.description}
                                        </p>
                                    </div>

                                    <div className="mt-6 flex items-center text-xs font-bold text-nust-blue/40 uppercase tracking-widest group-hover:text-nust-blue transition-colors">
                                        Join Thread →
                                    </div>
                                </div>
                            </Link>
                        ))}

                        {/* Request Card */}
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-trasparent border-2 border-dashed border-nust-blue/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-nust-blue/5 hover:border-nust-blue/50 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-full bg-nust-blue/10 text-nust-blue flex items-center justify-center text-2xl mb-4 group-hover:bg-nust-blue group-hover:text-white transition-colors">
                                +
                            </div>
                            <h3 className="font-heading text-lg text-nust-blue/70 mb-1">Missing something?</h3>
                            <p className="text-sm text-gray-500">Request a new topic.</p>
                        </button>
                    </div>
                )}
            </div>

            <TopicRequestModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
