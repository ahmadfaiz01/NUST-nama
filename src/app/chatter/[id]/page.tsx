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
                    const { data: profile } = await supabase.from("profiles").select("name, avatar_url, role").eq("id", newMsg.user_id).single();

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
            return;
        }
        if (!newMessage.trim()) return;

        const content = newMessage.trim();
        setNewMessage("");

        const { error } = await supabase.from("messages").insert({
            thread_id: id,
            user_id: userId,
            content: content
        });

        if (error) {
            console.error("Error sending:", error);
            alert("Failed to send: " + error.message);
            setNewMessage(content);
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
        <div className="h-[100dvh] bg-cream flex flex-col items-center">
            {/* Main Chat Container - Compact & Discord Style */}
            <div className="w-full max-w-4xl h-full flex flex-col bg-white border-x-2 border-nust-blue/10 shadow-xl overflow-hidden">

                {/* Header */}
                <div className="px-6 py-4 flex items-center gap-4 border-b-2 border-gray-100 bg-white z-10 shrink-0">
                    <Link href="/chatter" className="text-gray-400 hover:text-nust-blue hover:bg-gray-100 p-2 rounded-full transition-colors">
                        ←
                    </Link>
                    <div className={`w-10 h-10 flex items-center justify-center rounded-full text-xl ${thread.color_theme} bg-opacity-20 text-nust-blue`}>
                        {thread.emoji}
                    </div>
                    <div>
                        <h1 className="font-heading text-xl text-nust-blue leading-none">#{thread.title.toLowerCase().replace(/\s+/g, '-')}</h1>
                        <span className="text-xs text-green-600 font-bold flex items-center gap-1 mt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            Online
                        </span>
                    </div>
                </div>

                {/* Messages List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 sm:p-6 bg-gray-50/50">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <span className="text-5xl mb-4 opacity-20">💬</span>
                            <p className="font-medium">Welcome to the beginning of #{thread.title}!</p>
                        </div>
                    ) : (
                        messages.map((msg, index) => {
                            const isMe = msg.user_id === userId;
                            const isAdmin = msg.profiles?.role === 'admin';
                            const showAvatar = index === 0 || messages[index - 1].user_id !== msg.user_id || (new Date(msg.created_at).getTime() - new Date(messages[index - 1].created_at).getTime() > 60000);

                            return (
                                <div key={msg.id} className={`flex gap-3 group ${isMe ? "justify-end" : "justify-start"} ${showAvatar ? "mt-4" : "mt-1"}`}>
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

                                    <div className={`flex flex-col max-w-[75%] sm:max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
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
                                                <span className="text-[10px] text-gray-400">
                                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        )}

                                        {/* Bubble */}
                                        <div className={`relative px-4 py-2 text-[15px] shadow-sm rounded-2xl leading-relaxed ${isAdmin
                                                ? "bg-nust-orange/10 border border-nust-orange/30 text-gray-800 rounded-tl-none"
                                                : isMe
                                                    ? "bg-nust-blue text-white rounded-tr-none"
                                                    : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                                            }`}>
                                            {msg.content}
                                        </div>

                                        {/* Delete Action */}
                                        {userRole === 'admin' && (
                                            <button
                                                onClick={() => handleDelete(msg.id)}
                                                className="text-[10px] text-red-500 hover:text-red-700 font-bold mt-1 opacity-0 group-hover:opacity-100 transition-opacity px-1"
                                            >
                                                DELETE MESSAGE
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100 shrink-0">
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
                            className="absolute right-2 p-2 bg-nust-blue text-white rounded-lg hover:bg-opacity-90 disabled:opacity-0 transition-opacity"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </form>
                    <div className="text-center mt-2">
                        <p className="text-[10px] text-gray-400">
                            NUST-Nama v1.0 • Use /report to flag content
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
