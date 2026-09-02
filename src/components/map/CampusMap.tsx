"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapContainer, TileLayer, Marker, CircleMarker, Popup, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { createClient } from "@/lib/supabase/client";
import {
    DoorClosed,
    GraduationCap,
    Building2,
    Coffee,
    Trophy,
    Landmark,
    Building,
    Wrench,
    MapPin,
    Target,
    Flame,
    Compass,
    Calendar,
    Users,
} from "lucide-react";

import {
    CAMPUS_CENTER,
    CAMPUS_PLACES,
    CAMPUS_ZOOM,
    CAMPUS_MIN_ZOOM,
    CAMPUS_MAX_ZOOM,
    CAMPUS_BOUNDS,
    CATEGORIES,
    CATEGORY_COLOURS,
    CATEGORY_ICON_COLOURS,
    CATEGORY_SVG_STRINGS,
    type Category,
} from "@/lib/campus_places";

// Lucide icon component map for React UI
const CATEGORY_LUCIDE_ICONS: Record<Category, React.ElementType> = {
    Gates: DoorClosed,
    Schools: GraduationCap,
    Hostels: Building2,
    Cafes: Coffee,
    Sports: Trophy,
    Mosques: Landmark,
    Banks: Building,
    Facilities: Wrench,
};

const intensityStyles: Record<string, { color: string; fillColor: string; fillOpacity: number; radius: number; label: string; badgeBg: string }> = {
    high: { color: "#1B3A6B", fillColor: "#EF4444", fillOpacity: 0.85, radius: 24, label: "LIT 🔥", badgeBg: "bg-red-500" },
    lit: { color: "#1B3A6B", fillColor: "#EF4444", fillOpacity: 0.85, radius: 24, label: "LIT 🔥", badgeBg: "bg-red-500" },
    medium: { color: "#1B3A6B", fillColor: "#F97316", fillOpacity: 0.8, radius: 20, label: "VIBING 😎", badgeBg: "bg-orange-500" },
    vibing: { color: "#1B3A6B", fillColor: "#F97316", fillOpacity: 0.8, radius: 20, label: "VIBING 😎", badgeBg: "bg-orange-500" },
    low: { color: "#1B3A6B", fillColor: "#EAB308", fillOpacity: 0.75, radius: 16, label: "CHILL ☕", badgeBg: "bg-amber-500" },
    chill: { color: "#1B3A6B", fillColor: "#EAB308", fillOpacity: 0.75, radius: 16, label: "CHILL ☕", badgeBg: "bg-amber-500" },
    meh: { color: "#1B3A6B", fillColor: "#9CA3AF", fillOpacity: 0.65, radius: 14, label: "MEH 😐", badgeBg: "bg-gray-400" },
    dead: { color: "#1B3A6B", fillColor: "#4B5563", fillOpacity: 0.5, radius: 12, label: "DEAD 😴", badgeBg: "bg-gray-600" },
};

/**
 * Creates completely rounded circular markers with high-contrast icons inside them.
 */
const createCategoryCircularIcon = (category: Category) => {
    const color = CATEGORY_COLOURS[category];
    const svgIcon = CATEGORY_SVG_STRINGS[category];

    return L.divIcon({
        className: "custom-leaflet-marker-wrapper",
        html: `
            <div class="custom-circle-pin" style="background-color: ${color};">
                ${svgIcon}
            </div>
        `,
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -14],
        tooltipAnchor: [0, -14],
    });
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
            className="absolute bottom-4 right-4 z-[400] bg-white border-2 border-nust-blue text-nust-blue font-heading text-xs uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-[3px_3px_0px_var(--nust-blue)] hover:bg-nust-orange hover:text-nust-blue hover:translate-y-[-1px] transition-all cursor-pointer flex items-center gap-1.5"
        >
            <Target className="w-4 h-4 text-nust-blue" />
            <span>Recenter</span>
        </button>
    );
}

interface Hotspot {
    id: string;
    name: string;
    event: string;
    people: number;
    intensity: string;
    lat: number;
    lng: number;
    date: string;
}

export default function CampusMap() {
    const [viewMode, setViewMode] = useState<"guide" | "heatmap">("guide");
    const [activeCategory, setActiveCategory] = useState<Category | null>(null);
    const [hotspots, setHotspots] = useState<Hotspot[]>([]);
    const [loadingHotspots, setLoadingHotspots] = useState(false);

    // Fetch live heatmap event data
    useEffect(() => {
        const fetchHeatmapData = async () => {
            setLoadingHotspots(true);
            try {
                const supabase = createClient();
                const { data } = await supabase
                    .from("events")
                    .select("id, title, venue_name, venue_lat, venue_lng, start_time, rsvps(count), checkins(sentiment)")
                    .not("venue_lat", "is", null);

                if (data) {
                    const mapped: Hotspot[] = data.map((e) => {
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
                            else dominantSentiment = "low";
                        }

                        return {
                            id: e.id,
                            name: e.venue_name || "Campus Venue",
                            event: e.title,
                            people: rsvpCount,
                            intensity: dominantSentiment,
                            lat: e.venue_lat,
                            lng: e.venue_lng,
                            date: new Date(e.start_time).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            }),
                        };
                    });
                    setHotspots(mapped);
                }
            } catch (err) {
                console.error("Error fetching map hotspots:", err);
            } finally {
                setLoadingHotspots(false);
            }
        };

        fetchHeatmapData();
    }, []);

    const places = activeCategory
        ? CAMPUS_PLACES.filter((p) => p.category === activeCategory)
        : CAMPUS_PLACES;

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Custom CSS for Map Pins and Animations */}
            <style jsx global>{`
                .custom-leaflet-marker-wrapper {
                    background: transparent !important;
                    border: none !important;
                }
                .custom-circle-pin {
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    border: 2px solid #1B3A6B;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                    transform-origin: center center;
                }
                .custom-circle-pin:hover {
                    transform: scale(1.35);
                    z-index: 500;
                }
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
                @keyframes pulse-heat {
                    0%, 100% { transform: scale(1); opacity: 0.85; }
                    50% { transform: scale(1.08); opacity: 1; }
                }
            `}</style>

            {/* Top View Mode Switcher - Clean, Center-aligned without heavy card container */}
            <div className="flex flex-col items-center justify-center gap-2 w-full my-1">
                <div className="inline-flex items-center bg-white p-1.5 rounded-2xl border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)]">
                    <button
                        type="button"
                        onClick={() => setViewMode("guide")}
                        className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold font-sans transition-all cursor-pointer ${
                            viewMode === "guide"
                                ? "bg-nust-blue text-white shadow-xs"
                                : "text-nust-blue hover:text-nust-orange hover:bg-cream"
                        }`}
                    >
                        <Compass className="w-4 h-4" />
                        <span>Campus Guide (77 Places)</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setViewMode("heatmap")}
                        className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-bold font-sans transition-all cursor-pointer ${
                            viewMode === "heatmap"
                                ? "bg-nust-orange text-white shadow-xs"
                                : "text-nust-blue hover:text-nust-orange hover:bg-cream"
                        }`}
                    >
                        <Flame className="w-4 h-4" />
                        <span>Live Vibe Heatmap</span>
                        {hotspots.length > 0 && (
                            <span
                                className={`px-2 py-0.5 text-[11px] rounded-full font-bold ${
                                    viewMode === "heatmap"
                                        ? "bg-white text-nust-orange"
                                        : "bg-nust-orange/15 text-nust-orange"
                                }`}
                            >
                                {hotspots.length}
                            </span>
                        )}
                    </button>
                </div>

                <div className="text-xs text-nust-blue/70 font-sans font-medium text-center">
                    {viewMode === "guide" ? (
                        <span>Showing verified landmarks, schools, cafes & facilities</span>
                    ) : (
                        <div className="flex items-center justify-center gap-3">
                            <span className="flex items-center gap-1 text-red-600 font-bold">● LIT 🔥</span>
                            <span className="flex items-center gap-1 text-orange-600 font-bold">● VIBING 😎</span>
                            <span className="flex items-center gap-1 text-amber-600 font-bold">● CHILL ☕</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Guide Mode Category Filter Pills */}
            {viewMode === "guide" && (
                <div className="bg-white p-4 md:p-5 rounded-2xl border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)]">
                    <div className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3 p-1">
                        <FilterPill
                            label="All"
                            LucideIcon={MapPin}
                            count={CAMPUS_PLACES.length}
                            active={activeCategory === null}
                            onClick={() => setActiveCategory(null)}
                        />
                        {CATEGORIES.map((c) => (
                            <FilterPill
                                key={c}
                                label={c}
                                LucideIcon={CATEGORY_LUCIDE_ICONS[c]}
                                colour={CATEGORY_COLOURS[c]}
                                count={CAMPUS_PLACES.filter((p) => p.category === c).length}
                                active={activeCategory === c}
                                onClick={() => setActiveCategory(activeCategory === c ? null : c)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Map Canvas */}
            <div className="w-full h-[600px] md:h-[650px] relative rounded-2xl border-2 border-nust-blue shadow-[6px_6px_0px_var(--nust-blue)] overflow-hidden bg-cream z-0">
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

                    {/* GUIDE MODE: Render 77 categorized circular pins */}
                    {viewMode === "guide" &&
                        places.map((p) => {
                            const circleIcon = createCategoryCircularIcon(p.category);

                            return (
                                <Marker
                                    key={p.id}
                                    position={[p.lat, p.lng]}
                                    icon={circleIcon}
                                >
                                    <Tooltip direction="top" offset={[0, -12]} opacity={1}>
                                        <div className="font-heading text-xs tracking-wide text-nust-blue font-bold">
                                            {p.name}
                                        </div>
                                    </Tooltip>
                                    <Popup>
                                        <div className="p-1 space-y-1">
                                            <h3 className="font-heading text-base font-bold text-nust-blue m-0">
                                                {p.name}
                                            </h3>
                                            <span
                                                className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1"
                                                style={{
                                                    backgroundColor: CATEGORY_COLOURS[p.category],
                                                    color: CATEGORY_ICON_COLOURS[p.category],
                                                }}
                                            >
                                                {p.category}
                                            </span>
                                            <p className="text-xs text-nust-blue/80 leading-snug m-0 font-display">
                                                {p.blurb}
                                            </p>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}

                    {/* HEATMAP MODE: Render dynamic event crowd circles */}
                    {viewMode === "heatmap" &&
                        hotspots.map((spot) => {
                            const style = intensityStyles[spot.intensity] || intensityStyles.low;

                            return (
                                <CircleMarker
                                    key={spot.id}
                                    center={[spot.lat, spot.lng]}
                                    radius={style.radius}
                                    pathOptions={{
                                        color: style.color,
                                        fillColor: style.fillColor,
                                        fillOpacity: style.fillOpacity,
                                        weight: 2.5,
                                    }}
                                >
                                    <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                                        <div className="text-xs font-bold font-sans text-nust-blue">
                                            {spot.name}: <span className="text-red-600">{style.label}</span>
                                        </div>
                                    </Tooltip>
                                    <Popup>
                                        <div className="p-2 space-y-2 min-w-[200px]">
                                            <div className="flex items-center justify-between gap-2 border-b pb-1">
                                                <span className="font-heading text-base text-nust-blue">
                                                    {spot.name}
                                                </span>
                                                <span className="bg-nust-orange text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                    {style.label}
                                                </span>
                                            </div>

                                            <div>
                                                <p className="font-display font-bold text-sm text-nust-blue leading-tight mb-1">
                                                    {spot.event}
                                                </p>
                                                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{spot.date}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-nust-blue font-medium">
                                                    <Users className="w-3 h-3 text-nust-orange" />
                                                    <span>{spot.people} RSVPs</span>
                                                </div>
                                            </div>

                                            <Link
                                                href={`/events/${spot.id}`}
                                                className="btn btn-primary text-xs w-full text-center block py-1.5 mt-2"
                                            >
                                                View Event Details →
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

                {/* Bottom Status Badge */}
                <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur border-2 border-nust-blue px-3.5 py-1.5 rounded-xl shadow-[3px_3px_0px_var(--nust-blue)] text-xs font-heading text-nust-blue flex items-center gap-1.5">
                    {viewMode === "guide" ? (
                        <>
                            <span>{places.length} {places.length === 1 ? "LOCATION" : "LOCATIONS"}</span>
                            {activeCategory && <span className="text-nust-orange font-bold">• {activeCategory.toUpperCase()}</span>}
                        </>
                    ) : (
                        <>
                            <span>{hotspots.length} ACTIVE EVENT HOTSPOTS</span>
                            <span className="text-red-500 font-bold">• LIVE VIBES</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function FilterPill({
    label,
    LucideIcon,
    colour,
    count,
    active,
    onClick,
}: {
    label: string;
    LucideIcon: React.ElementType;
    colour?: string;
    count?: number;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`flex items-center gap-2 rounded-full border-2 border-nust-blue px-3.5 py-1.5 font-sans font-medium text-sm transition-all shadow-[2px_2px_0px_var(--nust-blue)] hover:translate-y-[-1px] cursor-pointer ${
                active
                    ? "bg-nust-blue text-white shadow-[3px_3px_0px_var(--nust-orange)] font-semibold"
                    : "bg-white text-nust-blue hover:bg-cream"
            }`}
        >
            <LucideIcon className="w-4 h-4 stroke-[2.25]" style={{ color: active ? "#FFFFFF" : colour || "#004B87" }} />
            <span>{label}</span>
            {count !== undefined && (
                <span
                    className={`px-1.5 py-0.2 text-xs rounded-full font-bold font-sans ${
                        active ? "bg-nust-orange text-nust-blue" : "bg-nust-blue/10 text-nust-blue"
                    }`}
                >
                    {count}
                </span>
            )}
        </button>
    );
}
