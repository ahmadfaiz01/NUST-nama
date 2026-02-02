"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { AdminNotification } from "@/types/database";

interface AdminNotificationsProps {
    className?: string;
}

export default function AdminNotifications({ className = "" }: AdminNotificationsProps) {
    const [notifications, setNotifications] = useState<AdminNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = useCallback(async () => {
        const supabase = createClient();
        
        const { data, error } = await supabase
            .from("admin_notifications")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(20);

        if (!error && data) {
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.is_read).length);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        // Fetch initial notifications
        const loadInitialData = async () => {
            await fetchNotifications();
        };
        loadInitialData();
        
        // Set up real-time subscription
        const supabase = createClient();
        const channel = supabase
            .channel('admin_notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'admin_notifications'
                },
                (payload) => {
                    // Add new notification to the top
                    setNotifications(prev => [payload.new as AdminNotification, ...prev]);
                    setUnreadCount(prev => prev + 1);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchNotifications]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAsRead = async (id: string) => {
        const supabase = createClient();
        
        const { error } = await supabase
            .from("admin_notifications")
            .update({ is_read: true })
            .eq("id", id);

        if (!error) {
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        }
    };

    const markAllAsRead = async () => {
        const supabase = createClient();
        
        const { error } = await supabase
            .from("admin_notifications")
            .update({ is_read: true })
            .eq("is_read", false);

        if (!error) {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        }
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "event_request": return "📅";
            case "news_request": return "📰";
            case "topic_request": return "💬";
            case "user_report": return "⚠️";
            case "system": return "🔔";
            default: return "📣";
        }
    };

    const getNotificationLink = (notification: AdminNotification) => {
        switch (notification.type) {
            case "event_request":
                return `/admin/events/${notification.reference_id}`;
            case "news_request":
                return `/admin?tab=news`;
            case "topic_request":
                return `/admin/gupshup`;
            default:
                return `/admin`;
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            {/* Notification Bell Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 rounded-lg transition-colors cursor-pointer ${
                    unreadCount > 0 
                        ? "text-red-500 hover:bg-red-50" 
                        : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
                title="View Notifications"
            >
                <svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                    />
                </svg>
                
                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown - Fixed positioning to appear on top of everything */}
            {isOpen && (
                <div 
                    className="fixed bg-white rounded-xl shadow-2xl border border-gray-200 overflow-visible z-[9999]"
                    style={{ 
                        top: "100px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "240px",
                        maxHeight: "calc(100vh - 150px)",
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    {/* Header */}
                    <div className="px-3 py-2 bg-gradient-to-r from-nust-blue to-nust-blue/90 border-b border-nust-blue/20 flex items-center justify-between flex-shrink-0 rounded-t-xl">
                        <h3 className="font-heading text-sm font-bold text-white">NOTIFICATIONS</h3>
                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    markAllAsRead();
                                }}
                                className="text-xs text-nust-orange hover:text-white transition-colors font-semibold"
                            >
                                Mark all
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="overflow-y-auto flex-1">
                        {loading ? (
                            <div className="p-4 text-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-nust-blue mx-auto"></div>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <span className="text-3xl block mb-2">🔔</span>
                                <p className="text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <Link
                                    key={notification.id}
                                    href={getNotificationLink(notification)}
                                    onClick={() => {
                                        if (!notification.is_read) markAsRead(notification.id);
                                        setIsOpen(false);
                                    }}
                                    className={`block px-2 py-2 border-b border-gray-100 hover:bg-nust-blue/5 transition-colors ${
                                        !notification.is_read ? "bg-nust-orange/10 border-l-4 border-l-nust-orange" : ""
                                    }`}
                                >
                                    <div className="space-y-0.5">
                                        {/* Type Label */}
                                        <p className={`text-xs font-bold uppercase tracking-wider ${!notification.is_read ? "text-nust-orange" : "text-gray-500"}`}>
                                            {notification.type === "event_request" && "Event Request:"}
                                            {notification.type === "news_request" && "News Request:"}
                                            {notification.type === "topic_request" && "Topic Request:"}
                                            {notification.type === "user_report" && "User Report:"}
                                            {notification.type === "system" && "System:"}
                                        </p>
                                        
                                        {/* Event Name */}
                                        <p className={`text-xs font-semibold truncate ${!notification.is_read ? "text-nust-blue" : "text-gray-700"}`}>
                                            {notification.title}
                                        </p>
                                        
                                        {/* Who Requested */}
                                        {notification.message && (
                                            <p className="text-xs text-gray-600 truncate">
                                                {notification.message}
                                            </p>
                                        )}
                                        
                                        {/* Time */}
                                        <p className="text-xs text-gray-400">
                                            {formatTime(notification.created_at)}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <Link
                            href="/admin"
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-2 text-center text-xs font-bold text-nust-orange hover:bg-nust-blue hover:text-white border-t border-gray-100 transition-colors rounded-b-xl"
                        >
                            View Dashboard →
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}
