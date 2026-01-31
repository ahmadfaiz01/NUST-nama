"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface CheckInButtonProps {
    eventId: string;
    venueLat?: number | null;
    venueLng?: number | null;
    initialCount?: number;
}

// Helper: Haversine Distance (in meters)
function getDistanceFromLatLonInM(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3; // Earth radius in meters
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export default function CheckInButton({ eventId, venueLat, venueLng, initialCount = 0 }: CheckInButtonProps) {
    const [isCheckedIn, setIsCheckedIn] = useState(false);
    const [count, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [distanceMsg, setDistanceMsg] = useState("");
    const [showSentiment, setShowSentiment] = useState(false);
    const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null);

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

            // Check if user has checked in
            const { data } = await supabase
                .from("checkins")
                .select("id, sentiment")
                .eq("event_id", eventId)
                .eq("user_id", user.id)
                .single();

            if (data) {
                setIsCheckedIn(true);
                setSelectedSentiment(data.sentiment);
            }

            // Re-fetch count
            const { count: actualCount } = await supabase
                .from("checkins")
                .select("*", { count: 'exact', head: true })
                .eq("event_id", eventId);

            if (actualCount !== null) setCount(actualCount);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const verifyLocation = async () => {
        setErrorMsg("");
        setDistanceMsg("");

        if (!venueLat || !venueLng) {
            setErrorMsg("Check-in unavailable for this venue.");
            return;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            alert("Please login to Check In!");
            return;
        }

        setVerifying(true);

        if (!navigator.geolocation) {
            setErrorMsg("Geolocation not supported.");
            setVerifying(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(async (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            const distance = getDistanceFromLatLonInM(userLat, userLng, venueLat, venueLng);
            setDistanceMsg(`Distance: ${Math.round(distance)}m`);

            if (distance > 500) {
                setErrorMsg(`Too far! (${Math.round(distance)}m away).`);
                setVerifying(false);
            } else {
                setVerifying(false);
                setShowSentiment(true);
            }

        }, (err) => {
            console.error(err);
            setErrorMsg("Location access denied.");
            setVerifying(false);
        });
    };

    const submitCheckIn = async (sentiment: string) => {
        setVerifying(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { error } = await supabase
                .from("checkins")
                .insert({
                    event_id: eventId,
                    user_id: user.id,
                    sentiment: sentiment
                });

            if (error) throw error;

            setIsCheckedIn(true);
            setSelectedSentiment(sentiment);
            setCount(count + 1);
            setShowSentiment(false);
        } catch (err: any) {
            console.error(err);
            setErrorMsg("Check-in failed.");
        } finally {
            setVerifying(false);
        }
    };

    if (isCheckedIn) {
        const emoji = {
            'lit': '🔥', 'vibing': '😎', 'chill': '☕', 'meh': '😐', 'dead': '😴'
        }[selectedSentiment || ''] || '📍';

        return (
            <div className="w-full bg-nust-orange/10 border-2 border-nust-orange p-3 rounded-lg text-center animate-pulse">
                <p className="font-heading text-nust-orange text-lg">{emoji} CHECKED IN!</p>
                <p className="text-xs text-nust-blue/60">{count} people here</p>
            </div>
        );
    }

    if (showSentiment) {
        return (
            <div className="bg-white border-2 border-nust-blue p-4 rounded-lg shadow-lg">
                <p className="font-heading text-nust-blue text-center mb-3">How's the vibe?</p>
                <div className="grid grid-cols-4 gap-2">
                    {[
                        { id: 'lit', emoji: '🔥', label: 'LIT' },
                        { id: 'vibing', emoji: '😎', label: 'VIBING' },
                        { id: 'meh', emoji: '😐', label: 'MEH' },
                        { id: 'dead', emoji: '😴', label: 'DEAD' }
                    ].map((opt) => (
                        <button
                            key={opt.id}
                            onClick={() => submitCheckIn(opt.id)}
                            className="flex flex-col items-center justify-center p-2 rounded hover:bg-nust-blue/5 transition-colors border border-transparent hover:border-nust-blue/20"
                        >
                            <span className="text-2xl mb-1">{opt.emoji}</span>
                            <span className="text-[10px] font-bold text-nust-blue uppercase">{opt.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-2">
            <button
                onClick={verifyLocation}
                disabled={loading || verifying || !venueLat}
                className={`w-full justify-center btn ${verifying ? 'btn-disabled opacity-70' : 'bg-nust-orange text-nust-blue border-nust-blue hover:bg-white'}`}
            >
                {verifying ? (
                    <span className="flex items-center gap-2">
                        <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                        Locating...
                    </span>
                ) : (
                    <span>📍 Check In Now ({count})</span>
                )}
            </button>

            {/* Feedback Messages */}
            {distanceMsg && !errorMsg && (
                <p className="text-xs text-center text-green-600 font-bold">{distanceMsg}</p>
            )}

            {errorMsg && (
                <div className="text-xs text-center text-red-500 bg-red-50 p-2 rounded border border-red-200">
                    {errorMsg}
                </div>
            )}

            {!venueLat && !loading && (
                <p className="text-xs text-center text-gray-400 italic">Location verification unavailable for this event.</p>
            )}
        </div>
    );
}
