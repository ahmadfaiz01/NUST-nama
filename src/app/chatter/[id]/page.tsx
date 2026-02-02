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
        role?: string;
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
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const supabase = createClient();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            const { data: { user } = {} } = await supabase.auth.getUser();
            setUserId(user?.id || null);

            if (user) {
                const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
                setUserRole(profile?.role || null);
            }

            const { data: threadData } = await supabase.from("threads").select("*").eq("id", id).single();
            if (threadData) setThread(threadData);

            const { data: msgs } = await supabase
                .from("messages")
                .select("*, profiles:user_id(name, avatar_url, role)")
                .eq("thread_id", id)
                .order("created_at", { ascending: true });

            if (msgs) setMessages(msgs);
            setLoading(false);
        };

        fetchData();

        const channel = supabase
            .channel(`thread-${id}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `thread_id=eq.${id}` },
                async (payload) => {
                    const newMsg = payload.new as Message;
                    // Skip if we already have this message (optimistic update)
                    setMessages((prev) => {
                        if (prev.some(m => m.id === newMsg.id)) return prev;
                        return [...prev, newMsg]; // This still needs profile data...
                    });

                    // Re-fetch to get profile data correctly strictly for incoming (if not optimistic) 
                    // But simplified logic: Just fetch profile
                    const { data: profile } = await supabase.from("profiles").select("name, avatar_url, role").eq("id", newMsg.user_id).single();
                    const msgWithProfile = {
                        ...newMsg,
                        profiles: profile || { name: 'Anonymous', avatar_url: '' }
                    };

                    setMessages((prev) => {
                        // Check if we have a temporary message for this user with same content? Hard to link.
                        // For simplicity, just append. If optimistic logic works, we replace temp with real ID.
                        // To avoid duplicates, check ID.
                        if (prev.some(m => m.id === newMsg.id)) return prev;
                        return [...prev, msgWithProfile];
                    });
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
            return;
        }
        if (!newMessage.trim()) return;

        const content = newMessage.trim();
        const optimisticId = "temp-" + Date.now();
        setNewMessage("");

        // Optimistic UI Update
        const optimisticMessage: Message = {
            id: optimisticId,
            content: content,
            created_at: new Date().toISOString(),
            user_id: userId,
            profiles: {
                name: "You", // Temporary
                avatar_url: "",
                role: userRole || undefined
            }
        };
        setMessages((prev) => [...prev, optimisticMessage]);

        const { data, error } = await supabase.from("messages").insert({
            thread_id: id,
            user_id: userId,
            content: content
        }).select().single();

        if (error) {
            console.error("Error sending:", error);
            alert("Failed to send: " + error.message);
            // Revert optimistic update
            setMessages(prev => prev.filter(m => m.id !== optimisticId));
            setNewMessage(content);
        } else if (data) {
            // Replace optimistic with real
            setMessages(prev => prev.map(m => m.id === optimisticId ? { ...m, ...data } : m));
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
        <div className="min-h-screen bg-cream flex items-center justify-center">
            💔 Thread Not Found
        </div>
    );

    return (
        // Height adjusted for Navbar (approx 64px-80px depending on screen). 
        // Using calc(100dvh - 80px) ensures it fits exactly without double scrollbars on mobile.
        // Also added pt-2 to separate from Navbar slightly.
        <div className="h-[calc(100dvh-80px)] bg-cream flex flex-col items-center mb-10"> {/* Added mb-10 for Footer Tape clearance */}
            {/* Main Chat Container - Compact & Discord Style */}
            <div className="w-full max-w-2xl h-full flex flex-col bg-white border-x-2 border-nust-blue/10 shadow-xl overflow-hidden rounded-t-xl mx-auto">

                {/* Header */}
                <div className="px-4 py-3 flex items-center gap-3 border-b-2 border-gray-100 bg-white z-10 shrink-0 shadow-sm">
                    <Link href="/chatter" className="text-gray-400 hover:text-nust-blue hover:bg-gray-100 p-2 rounded-full transition-colors">
                        ←
                    </Link>
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full text-lg ${thread.color_theme} bg-opacity-20 text-nust-blue`}>
                        {thread.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="font-heading text-lg text-nust-blue leading-none truncate">#{thread.title.toLowerCase().replace(/\s+/g, '-')}</h1>
                    </div>
                    <div className="text-xs text-green-600 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        Live
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 sm:p-5 bg-gray-50/50">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <span className="text-4xl mb-3 opacity-20">💬</span>
                            <p className="font-medium text-sm">Welcome to #{thread.title}!</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const isMe = msg.user_id === userId;
                            const isOptimistic = msg.id.startsWith("temp-");
                            const isAdmin = msg.profiles?.role === 'admin';
                            const showAvatar = index === 0 || messages[index - 1].user_id !== msg.user_id || (new Date(msg.created_at).getTime() - new Date(messages[index - 1].created_at).getTime() > 60000);

                            return (
                                <div key={msg.id} className={`flex gap-2 group ${isMe ? "justify-end" : "justify-start"} ${showAvatar ? "mt-3" : "mt-0.5"} ${isOptimistic ? "opacity-50" : "opacity-100"}`}>
                                    {/* Avatar (Left) */}
                                    {!isMe && (
                                        <div className="w-8 flex-shrink-0 flex flex-col justify-end">
                                            {showAvatar && (
                                                msg.profiles?.avatar_url ? (
                                                    <img src={msg.profiles.avatar_url} className="w-8 h-8 rounded-full bg-gray-200 object-cover" alt="avatar" />
                                                ) : (
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isAdmin ? "bg-nust-orange text-white" : "bg-nust-blue text-white"}`}>
                                                        {isAdmin ? "🛡️" : (msg.profiles?.name?.[0] || "?")}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    )}

                                    <div className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
                                        {/* Name Label (Only show for others, once) */}
                                        {!isMe && showAvatar && (
                                            <div className="flex items-center gap-2 mb-1 ml-1">
                                                {isAdmin ? (
                                                    <span className="bg-nust-orange text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                                        <span className="text-[8px]">★</span> ADMIN
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-bold text-gray-600">
                                                        {msg.profiles?.name || "Anonymous"}
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {/* Bubble */}
                                        <div className={`relative px-3 py-2 text-[14px] shadow-sm rounded-2xl leading-relaxed break-words ${isAdmin
                                            ? "bg-nust-orange/10 border border-nust-orange/30 text-gray-800 rounded-tl-none"
                                            : isMe
                                                ? "bg-nust-blue text-white rounded-tr-none"
                                                : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                                            }`}>
                                            {msg.content}
                                        </div>

                                        {/* Timestamp & Delete */}
                                        <div className="flex items-center gap-2 mt-0.5 px-1">
                                            <span className="text-[9px] text-gray-400">
                                                {isOptimistic ? "Sending..." : new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {userRole === 'admin' && !isOptimistic && (
                                                <button
                                                    onClick={() => handleDelete(msg.id)}
                                                    className="text-[9px] text-red-500 hover:text-red-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    DEL
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-t border-gray-100 shrink-0">
                    <form onSubmit={handleSend} className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder={userId ? `Message #${thread.title.toLowerCase().replace(/\s+/g, '-')}...` : "🔒 Log in to chat..."}
                            disabled={!userId}
                            className="w-full bg-gray-100 text-gray-800 placeholder:text-gray-400 border-0 focus:ring-2 focus:ring-nust-blue/20 rounded-xl px-4 py-3.5 pr-12 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim() || !userId}
                            className="absolute right-2 p-2 bg-nust-blue text-white rounded-lg hover:bg-opacity-90 disabled:opacity-0 transition-opacity flex items-center justify-center w-8 h-8"
                        >
                            ➤
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
