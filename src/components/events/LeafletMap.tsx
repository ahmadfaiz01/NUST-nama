"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
    CAMPUS_CENTER,
    CAMPUS_ZOOM,
    CAMPUS_MIN_ZOOM,
    CAMPUS_MAX_ZOOM,
    CAMPUS_BOUNDS,
} from "@/lib/campus_places";

// Fix for default marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const intensityStyles = {
    high: { color: "#1B3A6B", fillColor: "#EF4444", fillOpacity: 0.9, radius: 22, label: "LIT 🔥" },
    medium: { color: "#1B3A6B", fillColor: "#F97316", fillOpacity: 0.8, radius: 18, label: "VIBING 😎" },
    low: { color: "#1B3A6B", fillColor: "#EAB308", fillOpacity: 0.7, radius: 14, label: "CHILL ☕" },
    lit: { color: "#1B3A6B", fillColor: "#EF4444", fillOpacity: 0.9, radius: 22, label: "LIT 🔥" },
    vibing: { color: "#1B3A6B", fillColor: "#3B82F6", fillOpacity: 0.8, radius: 18, label: "VIBING 😎" },
    meh: { color: "#1B3A6B", fillColor: "#9CA3AF", fillOpacity: 0.6, radius: 14, label: "MEH 😐" },
    dead: { color: "#1B3A6B", fillColor: "#4B5563", fillOpacity: 0.5, radius: 12, label: "DEAD 😴" },
};

function MapResizer() {
    const map = useMap();
    useEffect(() => {
        map.setMinZoom(CAMPUS_MIN_ZOOM);
        map.setMaxZoom(CAMPUS_MAX_ZOOM);
        map.setMaxBounds(CAMPUS_BOUNDS);
        map.options.maxBoundsViscosity = 1.0;
        const t = setTimeout(() => {
            map.invalidateSize();
        }, 200);
        return () => clearTimeout(t);
    }, [map]);
    return null;
}

function RecenterButton() {
    const map = useMap();
    return (
        <button
            type="button"
            onClick={() => map.setView(CAMPUS_CENTER, CAMPUS_ZOOM)}
            className="absolute bottom-4 right-4 z-[400] bg-white border-2 border-nust-blue text-nust-blue font-heading text-xs uppercase tracking-widest px-3 py-2 rounded-xl shadow-[3px_3px_0px_var(--nust-blue)] hover:bg-nust-orange hover:text-nust-blue transition-all cursor-pointer"
        >
            🎯 Recenter
        </button>
    );
}

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
                const mapped = data.map((e) => {
                    const rsvpCount = e.rsvps?.[0]?.count || 0;
                    const checkins = e.checkins || [];

                    let dominantSentiment = "low";
                    if (checkins.length > 0) {
                        const sentiments = checkins.map((c: any) => c.sentiment).filter(Boolean);
                        if (sentiments.length > 0) {
                            const counts: Record<string, number> = {};
                            sentiments.forEach((s: string) => (counts[s] = (counts[s] || 0) + 1));
                            dominantSentiment = Object.keys(counts).reduce((a, b) =>
                                counts[a] > counts[b] ? a : b
                            );
                        }
                    } else {
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
                        intensity: dominantSentiment,
                    };
                });
                setHotspots(mapped);
            }
        };
        fetchMapData();
    }, []);

    return (
        <div className="w-full h-full min-h-[480px] rounded-2xl overflow-hidden border-2 border-nust-blue shadow-[6px_6px_0px_var(--nust-blue)] relative bg-cream group z-0">
            <MapContainer
                center={CAMPUS_CENTER}
                zoom={CAMPUS_ZOOM}
                minZoom={CAMPUS_MIN_ZOOM}
                maxZoom={CAMPUS_MAX_ZOOM}
                maxBounds={CAMPUS_BOUNDS}
                maxBoundsViscosity={1.0}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
                zoomControl={true}
                className="z-10"
            >
                <MapResizer />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {hotspots.map((spot) => {
                    const style = intensityStyles[spot.intensity as keyof typeof intensityStyles];
                    const finalStyle = style || intensityStyles.low;

                    return (
                        <CircleMarker
                            key={spot.id}
                            center={[spot.lat, spot.lng]}
                            radius={finalStyle.radius}
                            pathOptions={{
                                color: "#1B3A6B",
                                weight: 2.5,
                                fillColor: finalStyle.fillColor,
                                fillOpacity: finalStyle.fillOpacity,
                            }}
                        >
                            {/* Hover Tooltip */}
                            <Tooltip
                                direction="top"
                                offset={[0, -finalStyle.radius - 4]}
                                opacity={1}
                                permanent={false}
                                className="!bg-white !border-2 !border-nust-blue !text-nust-blue !font-bold !rounded-xl !px-3 !py-1 !shadow-[3px_3px_0px_var(--nust-blue)] !text-xs !font-display uppercase tracking-wider"
                            >
                                <div className="flex items-center gap-1.5">
                                    <span>🔥</span>
                                    <span>{spot.event}</span>
                                </div>
                            </Tooltip>

                            <Popup className="minimal-popup">
                                <div className="text-center min-w-[140px] p-1">
                                    <h3 className="font-heading text-base text-nust-blue leading-tight mb-1">
                                        {spot.name}
                                    </h3>
                                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-nust-orange mb-2">
                                        <span>{finalStyle.label}</span>
                                        <span>• {spot.people} attending</span>
                                    </div>
                                    <Link
                                        href={`/events/${spot.id}`}
                                        className="block w-full bg-nust-blue text-white font-heading text-xs py-1.5 rounded-lg hover:bg-nust-orange hover:text-nust-blue transition-all"
                                    >
                                        CHECK IN / VIEW
                                    </Link>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}

                <RecenterButton />
            </MapContainer>

            {/* Grain Noise Overlay */}
            <div className="map-grain-overlay" aria-hidden="true" />

            <style jsx global>{`
                .map-grain-overlay {
                    position: absolute;
                    inset: 0;
                    pointer-events: none;
                    z-index: 390;
                    opacity: 0.16;
                    mix-blend-mode: multiply;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                }
                .leaflet-tile-pane {
                    filter: contrast(0.92) saturate(0.82) brightness(1.02);
                }
            `}</style>

            {/* Vibe Radar Legend */}
            <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur border-2 border-nust-blue p-3 rounded-xl shadow-[3px_3px_0px_var(--nust-blue)]">
                <h4 className="font-heading text-nust-blue text-xs mb-2">VIBE RADAR</h4>
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-red-500 border border-nust-blue" />
                        <span className="text-xs font-bold text-nust-blue font-display">Lit 🔥</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-orange-500 border border-nust-blue" />
                        <span className="text-xs font-bold text-nust-blue font-display">Vibing 😎</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3.5 h-3.5 rounded-full bg-yellow-500 border border-nust-blue" />
                        <span className="text-xs font-bold text-nust-blue font-display">Chill ☕</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
