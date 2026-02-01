"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
// import { X } from "lucide-react"; // unused

export default function TopicRequestModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [title, setTitle] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert("Who are you? Log in first.");
            setLoading(false);
            return;
        }

        const { error } = await supabase.from("topic_requests").insert({
            user_id: user.id,
            topic_title: title,
            reason: reason,
        });

        if (error) {
            console.error(error);
            alert(`Error: ${error.message}`);
        } else {
            setSent(true);
            setTimeout(() => {
                setSent(false);
                setTitle("");
                setReason("");
                onClose();
            }, 2000);
        }
        setLoading(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-nust-blue/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border-2 border-nust-blue animate-in fade-in zoom-in duration-200">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-nust-blue">
                    ✕
                </button>

                {sent ? (
                    <div className="text-center py-8">
                        <div className="text-4xl mb-2">🫡</div>
                        <h3 className="font-heading text-xl text-nust-blue">Request Sent</h3>
                        <p className="text-gray-500">If it's good, we'll add it.</p>
                    </div>
                ) : (
                    <>
                        <h2 className="font-heading text-xl text-nust-blue mb-1">Request a Topic</h2>
                        <p className="text-sm text-gray-500 mb-6">Missing a vibe? Tell us what we should add.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Topic Name</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Gaming, Hostels, CS Tears"
                                    className="w-full bg-cream border-2 border-transparent focus:border-nust-blue rounded-lg px-4 py-2 outline-none transition-colors font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Why?</label>
                                <textarea
                                    required
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Convince us."
                                    rows={3}
                                    className="w-full bg-cream border-2 border-transparent focus:border-nust-blue rounded-lg px-4 py-2 outline-none transition-colors font-medium resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn btn-primary justify-center mt-2"
                            >
                                {loading ? "Sending..." : "Send Request 🚀"}
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
