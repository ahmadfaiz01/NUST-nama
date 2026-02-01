/**
 * Supabase Database Type Definitions
 * These types are generated from your Supabase schema
 * Run `npx supabase gen types typescript` to regenerate
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string;
                    name: string | null;
                    avatar_url: string | null;
                    faculty: string | null;
                    interests: string[] | null;
                    role: "student" | "admin" | "moderator";
                    push_subscription: Json | null;
                    is_banned: boolean;
                    created_at: string;
                };
                Insert: {
                    id: string;
                    name?: string | null;
                    avatar_url?: string | null;
                    faculty?: string | null;
                    interests?: string[] | null;
                    role?: "student" | "admin" | "moderator";
                    push_subscription?: Json | null;
                    is_banned?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string | null;
                    avatar_url?: string | null;
                    faculty?: string | null;
                    interests?: string[] | null;
                    role?: "student" | "admin" | "moderator";
                    push_subscription?: Json | null;
                    is_banned?: boolean;
                    created_at?: string;
                };
            };
            events: {
                Row: {
                    id: string;
                    title: string;
                    description: string | null;
                    start_time: string;
                    end_time: string | null;
                    venue_name: string | null;
                    venue_lat: number | null;
                    venue_lng: number | null;
                    radius_meters: number;
                    price: string | null;
                    registration_url: string | null;
                    allow_guests: boolean;
                    tags: string[] | null;
                    is_official: boolean;
                    external_id: string | null;
                    status: "pending" | "approved" | "rejected";
                    created_by: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    description?: string | null;
                    start_time: string;
                    end_time?: string | null;
                    venue_name?: string | null;
                    venue_lat?: number | null;
                    venue_lng?: number | null;
                    radius_meters?: number;
                    price?: string | null;
                    registration_url?: string | null;
                    allow_guests?: boolean;
                    tags?: string[] | null;
                    is_official?: boolean;
                    external_id?: string | null;
                    status?: "pending" | "approved" | "rejected";
                    created_by?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    description?: string | null;
                    start_time?: string;
                    end_time?: string | null;
                    venue_name?: string | null;
                    venue_lat?: number | null;
                    venue_lng?: number | null;
                    radius_meters?: number;
                    price?: string | null;
                    registration_url?: string | null;
                    allow_guests?: boolean;
                    tags?: string[] | null;
                    is_official?: boolean;
                    external_id?: string | null;
                    status?: "pending" | "approved" | "rejected";
                    created_by?: string | null;
                    created_at?: string;
                };
            };
            rsvps: {
                Row: {
                    id: string;
                    event_id: string;
                    user_id: string;
                    status: "going" | "interested";
                    guests_count: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    event_id: string;
                    user_id: string;
                    status: "going" | "interested";
                    guests_count?: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    event_id?: string;
                    user_id?: string;
                    status?: "going" | "interested";
                    guests_count?: number;
                    created_at?: string;
                };
            };
            checkins: {
                Row: {
                    id: string;
                    event_id: string;
                    user_id: string;
                    lat: number | null;
                    lng: number | null;
                    sentiment: "pos" | "neu" | "neg" | null;
                    message: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    event_id: string;
                    user_id: string;
                    lat?: number | null;
                    lng?: number | null;
                    sentiment?: "pos" | "neu" | "neg" | null;
                    message?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    event_id?: string;
                    user_id?: string;
                    lat?: number | null;
                    lng?: number | null;
                    sentiment?: "pos" | "neu" | "neg" | null;
                    message?: string | null;
                    created_at?: string;
                };
            };
            news_items: {
                Row: {
                    id: string;
                    source: string | null;
                    title: string;
                    summary: string | null;
                    url: string | null;
                    published_at: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    source?: string | null;
                    title: string;
                    summary?: string | null;
                    url?: string | null;
                    published_at?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    source?: string | null;
                    title?: string;
                    summary?: string | null;
                    url?: string | null;
                    published_at?: string | null;
                    created_at?: string;
                };
            };
            threads: {
                Row: {
                    id: string;
                    title: string;
                    description: string | null;
                    emoji: string;
                    color_theme: string;
                    is_active: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    description?: string | null;
                    emoji?: string;
                    color_theme?: string;
                    is_active?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    description?: string | null;
                    emoji?: string;
                    color_theme?: string;
                    is_active?: boolean;
                    created_at?: string;
                };
            };
            topic_requests: {
                Row: {
                    id: string;
                    user_id: string;
                    topic_title: string;
                    reason: string | null;
                    status: "pending" | "approved" | "rejected";
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    topic_title: string;
                    reason?: string | null;
                    status?: "pending" | "approved" | "rejected";
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    topic_title?: string;
                    reason?: string | null;
                    status?: "pending" | "approved" | "rejected";
                    created_at?: string;
                };
            };
            messages: {
                Row: {
                    id: string;
                    thread_id: string;
                    user_id: string;
                    content: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    thread_id: string;
                    user_id: string;
                    content: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    thread_id?: string;
                    user_id?: string;
                    content?: string;
                    created_at?: string;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
    };
}

// Convenience types
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Event = Database["public"]["Tables"]["events"]["Row"];
export type RSVP = Database["public"]["Tables"]["rsvps"]["Row"];
export type Checkin = Database["public"]["Tables"]["checkins"]["Row"];
export type NewsItem = Database["public"]["Tables"]["news_items"]["Row"];
export type Thread = Database["public"]["Tables"]["threads"]["Row"];
export type TopicRequest = Database["public"]["Tables"]["topic_requests"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
