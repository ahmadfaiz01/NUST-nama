"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const CENTER: [number, number] = [33.6425, 72.9905];

const intensityStyles = {
    high: { color: "#EF4444", fillColor: "#EF4444", fillOpacity: 0.8, radius: 25, label: "LIT 🔥" },
    medium: { color: "#F97316", fillColor: "#F97316", fillOpacity: 0.6, radius: 20, label: "VIBING 😎" },
    low: { color: "#EAB308", fillColor: "#EAB308", fillOpacity: 0.4, radius: 15, label: "CHILL ☕" },
    // Sentiment Overrides
    lit: { color: "#EF4444", fillColor: "#EF4444", fillOpacity: 0.9, radius: 28, label: "LIT 🔥" },
    vibing: { color: "#3B82F6", fillColor: "#3B82F6", fillOpacity: 0.7, radius: 22, label: "VIBING 😎" },
    meh: { color: "#9CA3AF", fillColor: "#9CA3AF", fillOpacity: 0.5, radius: 15, label: "MEH 😐" },
    dead: { color: "#4B5563", fillColor: "#4B5563", fillOpacity: 0.4, radius: 12, label: "DEAD 😴" },
};

export default function LeafletMap() {
    const [hotspots, setHotspots] = useState<any[]>([]);

    useEffect(() => {
        const fetchMapData = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from("events")
                .select("id, title, venue_name, venue_lat, venue_lng, rsvps(count), checkins(sentiment)")
                .not("venue_lat", "is", null)
                .gte("start_time", new Date().toISOString());

            if (data) {
                const mapped = data.map(e => {
                    const rsvpCount = e.rsvps?.[0]?.count || 0;
                    const checkins = e.checkins || [];

                    // Determine Sentiment Logic
                    // 1. Calculate dominant sentiment if checkins exist
                    let dominantSentiment = "low"; // default fallback
                    if (checkins.length > 0) {
                        const sentiments = checkins.map((c: any) => c.sentiment).filter(Boolean);
                        if (sentiments.length > 0) {
                            // Simple mode (most frequent)
                            const counts: Record<string, number> = {};
                            sentiments.forEach((s: string) => counts[s] = (counts[s] || 0) + 1);
                            dominantSentiment = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
                        }
                    } else {
                        // Fallback to RSVP counts if no checkins yet
                        if (rsvpCount > 50) dominantSentiment = "high";
                        else if (rsvpCount > 20) dominantSentiment = "medium";
                    }

                    return {
                        id: e.id,
                        name: e.venue_name,
                        event: e.title,
                        people: rsvpCount,
                        lat: e.venue_lat,
                        lng: e.venue_lng,
                        intensity: dominantSentiment
                    };
                });
                setHotspots(mapped);
            }
        };
        fetchMapData();
    }, []);

    return (
        <div className="h-full w-full rounded-2xl overflow-hidden border-2 border-nust-blue shadow-lg z-0 relative bg-cream group">

            {/* Emoji Background Pattern */}
            <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.06] overflow-hidden select-none"
                style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ctext x='25' y='25' font-size='35' text-anchor='middle'%3E🔥%3C/text%3E%3Ctext x='75' y='75' font-size='35' text-anchor='middle'%3E💯%3C/text%3E%3C/svg%3E\")",
                    backgroundSize: "80px 80px"
                }}>
            </div>

            <MapContainer
                center={CENTER}
                zoom={15}
                style={{ height: "100%", width: "100%", zIndex: 10 }}
                scrollWheelZoom={true}
                zoomControl={true}
                className="z-10 bg-transparent"
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    className="opacity-90 mix-blend-multiply"
                />

                {hotspots.map((spot) => {
                    const style = intensityStyles[spot.intensity as keyof typeof intensityStyles];
                    // Fallback style if undefined
                    const finalStyle = style || intensityStyles.low;

                    return (
                        <CircleMarker
                            key={spot.id}
                            center={[spot.lat, spot.lng]}
                            radius={finalStyle.radius}
                            pathOptions={{
                                color: "white",
                                weight: 2,
                                fillColor: finalStyle.fillColor,
                                fillOpacity: finalStyle.fillOpacity,
                            }}
                        >
                            {/* Event Label */}
                            <Tooltip
                                direction="top"
                                offset={[0, -finalStyle.radius - 5]}
                                opacity={1}
                                permanent={false}
                                className="!bg-white !border-2 !border-nust-blue !text-nust-blue !font-bold !rounded-md !px-2 !py-0.5 !shadow-md !text-xs !font-display uppercase tracking-widest"
                            >
                                {spot.event}
                            </Tooltip>

                            <Popup className="minimal-popup">
                                <div className="text-center min-w-[120px]">
                                    <h3 className="font-heading text-lg text-nust-blue leading-none mb-1">{spot.name}</h3>
                                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-nust-orange mb-2">
                                        <span>{finalStyle.label.split(' ')[1]}</span>
                                        <span>{spot.people} here</span>
                                    </div>
                                    <Link
                                        href={`/events/${spot.id}`}
                                        className="block w-full bg-nust-blue text-white text-[10px] font-bold py-1.5 rounded hover:bg-nust-blue/90"
                                    >
                                        CHECK IN / VIEW
                                    </Link>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>

            {/* Legend - Updated dynamically? For now static but improved */}
            <div className="absolute bottom-4 right-4 z-[400] bg-white/95 backdrop-blur border border-nust-orange/30 p-3 rounded-xl shadow-lg">
                <h4 className="font-heading text-nust-blue text-xs mb-2">VIBE RADAR</h4>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-500 opacity-80 border border-red-600"></div>
                        <span className="text-xs font-bold text-nust-blue">Lit 🔥</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-blue-500 opacity-60 border border-blue-600"></div>
                        <span className="text-xs font-bold text-nust-blue">Vibing 😎</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-yellow-500 opacity-40 border border-yellow-600"></div>
                        <span className="text-xs font-bold text-nust-blue">Avg / Chill ☕</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
