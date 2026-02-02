"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface Message {
    id: string;
    content: string;
    created_at: string;
    user_id: string;
    profiles?: {
        name: string;
        avatar_url: string;
        role?: string; // Added role
    };
}

interface Thread {
    id: string;
    title: string;
    emoji: string;
    color_theme: string;
}

export default function ChatRoom() {
    const { id } = useParams();
    const [thread, setThread] = useState<Thread | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [userId, setUserId] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null); // Track current user role
    const [loading, setLoading] = useState(true);

    // Auto-scroll ref
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    // Scroll to bottom helper
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            // 1. Get User & Role
            const { data: { user } = {} } = await supabase.auth.getUser(); // Destructure with default empty object
            setUserId(user?.id || null);

            if (user) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", user.id)
                    .single();
                setUserRole(profile?.role || null);
            }

            // 2. Get Thread Info
            const { data: threadData } = await supabase
                .from("threads")
                .select("*")
                .eq("id", id)
                .single();

            if (threadData) setThread(threadData);

            // 3. Get Messages
            const { data: msgs } = await supabase
                .from("messages")
                .select("*, profiles:user_id(name, avatar_url, role)") // Fetch role
                .eq("thread_id", id)
                .order("created_at", { ascending: true });

            if (msgs) setMessages(msgs);
            setLoading(false);
        };

        fetchData();

        // 4. Realtime Subscription
        const channel = supabase
            .channel(`thread-${id}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `thread_id=eq.${id}` },
                async (payload) => {
                    const newMsg = payload.new as Message;

                    // Fetch profile for the new message author
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("name, avatar_url, role")
                        .eq("id", newMsg.user_id)
                        .single();

                    const msgWithProfile = {
                        ...newMsg,
                        profiles: profile || { name: 'Anonymous', avatar_url: '' }
                    };

                    setMessages((prev) => [...prev, msgWithProfile]);
                }
            )
            .on(
                'postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'messages', filter: `thread_id=eq.${id}` },
                (payload) => {
                    setMessages((prev) => prev.filter(msg => msg.id !== payload.old.id));
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };

    }, [id]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId) {
            alert("🔒 Please Log In to chat!");
            // Optional: Redirect to login
            // window.location.href = "/auth?mode=login&next=" + window.location.pathname;
            return;
        }

        if (!newMessage.trim()) return;

        const content = newMessage.trim();
        setNewMessage(""); // Optimistic clear

        const { error } = await supabase
            .from("messages")
            .insert({
                thread_id: id,
                user_id: userId,
                content: content
            });

        if (error) {
            console.error("Error sending:", error);
            alert("Failed to send: " + error.message);
            setNewMessage(content); // Restore message on error
        }
    };

    const handleDelete = async (messageId: string) => {
        if (!confirm("Delete this message?")) return;
        const { error } = await supabase.from("messages").delete().eq("id", messageId);
        if (error) alert("Failed to delete: " + error.message);
    };

    if (loading) return (
        <div className="min-h-screen bg-cream flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nust-blue"></div>
        </div>
    );

    if (!thread) return (
        <div className="min-h-screen bg-cream flex items-center justify-center text-nust-blue font-heading text-2xl">
            💔 Thread Not Found
        </div>
    );

    return (
        <div className="flex flex-col h-[100dvh] bg-cream overflow-hidden">
            {/* Header */}
            <div className={`px-4 py-3 flex items-center gap-3 border-b-2 border-nust-blue/10 bg-white shadow-sm z-10 shrink-0`}>
                <Link href="/chatter" className="text-nust-blue hover:bg-nust-blue/10 p-2 rounded-full transition-colors">
                    ←
                </Link>
                <div className={`w-10 h-10 flex items-center justify-center rounded-full text-xl ${thread.color_theme} bg-opacity-20 text-nust-blue`}>
                    {thread.emoji}
                </div>
                <div>
                    <h1 className="font-heading text-xl text-nust-blue leading-none">#{thread.title.toLowerCase().replace(/\s+/g, '-')}</h1>
                    <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Live
                    </span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <span className="text-4xl mb-2 opacity-30">🦗</span>
                        <p>No messages yet. Start the vibe!</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.user_id === userId;
                        const isAdmin = msg.profiles?.role === 'admin';

                        return (
                            <div key={msg.id} className={`flex gap-2 group ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                                {/* Avatar */}
                                <div className="flex-shrink-0">
                                    {msg.profiles?.avatar_url ? (
                                        <img src={msg.profiles.avatar_url} className="w-8 h-8 rounded-full border border-gray-200 object-cover" alt="avatar" />
                                    ) : (
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${isAdmin ? "bg-nust-orange text-white border-nust-orange" : isMe ? "bg-nust-blue text-white border-nust-blue" : "bg-white text-nust-blue border-gray-200"}`}>
                                            {isAdmin ? "🛡️" : (msg.profiles?.name?.[0] || "?")}
                                        </div>
                                    )}
                                </div>

                                {/* Bubble Container */}
                                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[80%]`}>
                                    {/* Name / Role Label */}
                                    {!isMe && (
                                        <div className="flex items-center gap-2 mb-0.5">
                                            {isAdmin ? (
                                                <span className="bg-nust-orange text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                                    ADMIN
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-bold opacity-50 uppercase tracking-wide">
                                                    {msg.profiles?.name || "Anon"}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Bubble */}
                                    <div className={`relative px-4 py-2 text-sm shadow-sm rounded-2xl ${isAdmin
                                            ? "bg-nust-orange/10 border-2 border-nust-orange text-nust-blue rounded-tl-none"
                                            : isMe
                                                ? "bg-nust-blue text-white rounded-tr-none"
                                                : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                                        }`}>
                                        <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                        <p className={`text-[9px] mt-1 text-right ${isMe ? "text-white/50" : "text-gray-400"}`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>

                                    {/* Admin Controls */}
                                    {userRole === 'admin' && (
                                        <button
                                            onClick={() => handleDelete(msg.id)}
                                            className="text-[10px] text-red-400 hover:text-red-600 font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            [DELETE]
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                {/* Invisible element to scroll to */}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                <form onSubmit={handleSend} className="flex gap-2 max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={userId ? `Message #${thread.title.toLowerCase().replace(/\s+/g, '-')}...` : "🔒 Log in to chat..."}
                        disabled={!userId}
                        className="flex-1 bg-gray-100 border-transparent focus:bg-white focus:border-nust-blue border-2 rounded-xl px-4 py-3 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || !userId}
                        className="bg-nust-blue text-white p-3 rounded-xl hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all aspect-square flex items-center justify-center"
                    >
                        ➤
                    </button>
                </form>
            </div>
        </div>
    );
}
