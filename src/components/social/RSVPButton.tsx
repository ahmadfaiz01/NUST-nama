"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { usePostHog } from "posthog-js/react";

interface RSVPButtonProps {
    eventId: string;
    eventTitle?: string;
    initialCount?: number;
}

export default function RSVPButton({ eventId, eventTitle, initialCount = 0 }: RSVPButtonProps) {
    const [isGoing, setIsGoing] = useState(false);
    const [count, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const posthog = usePostHog();

    const supabase = createClient();

    useEffect(() => {
        checkStatus();
    }, [eventId]);

    const checkStatus = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }
            setUserId(user.id);

            // Check if user has rsvped
            const { data, error } = await supabase
                .from("rsvps")
                .select("id")
                .eq("event_id", eventId)
                .eq("user_id", user.id)
                .single();

            if (data) setIsGoing(true);

            // Re-fetch count to be sure
            const { count: actualCount } = await supabase
                .from("rsvps")
                .select("*", { count: 'exact', head: true })
                .eq("event_id", eventId);

            if (actualCount !== null) setCount(actualCount);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const toggleRSVP = async () => {
        if (!userId) {
            alert("Please login to RSVP!");
            return;
        }

        setLoading(true);
        // Optimistic update
        const prevIsGoing = isGoing;
        const prevCount = count;

        setIsGoing(!prevIsGoing);
        setCount(prevIsGoing ? count - 1 : count + 1);

        try {
            if (prevIsGoing) {
                posthog?.capture('event_unrsvp', { event_id: eventId, event_title: eventTitle });
                // Delete (Un-RSVP)
                const { error } = await supabase
                    .from("rsvps")
                    .delete()
                    .eq("event_id", eventId)
                    .eq("user_id", userId);
                if (error) throw error;
            } else {
                posthog?.capture('event_rsvp', { event_id: eventId, event_title: eventTitle });
                // Insert (RSVP)
                const { error } = await supabase
                    .from("rsvps")
                    .insert({
                        event_id: eventId,
                        user_id: userId,
                        status: 'going'
                    });
                if (error) throw error;
            }
        } catch (err: any) {
            // Revert on error
            console.error(err);
            setIsGoing(prevIsGoing);
            setCount(prevCount);
            alert("Failed to update RSVP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleRSVP}
            disabled={loading}
            className={`w-full justify-center btn transition-all ${isGoing
                    ? "bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700"
                    : "btn-outline"
                }`}
        >
            {loading ? (
                <span className="opacity-50">...</span>
            ) : isGoing ? (
                <span>✅ I'm Going ({count})</span>
            ) : (
                <span>Mark as Going ({count})</span>
            )}
        </button>
    );
}
