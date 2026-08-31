"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
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

/**
 * Creates completely rounded circular markers with high-contrast icons inside them.
 * No bottom pin triangle / edge.
 * Scales up smoothly when hovered over.
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

export default function CampusMap() {
    const [active, setActive] = useState<Category | null>(null);

    const places = active ? CAMPUS_PLACES.filter((p) => p.category === active) : CAMPUS_PLACES;

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Custom CSS for Complete Round Pins and Hover Zooming */}
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

            {/* Filter Pills Bar */}
            <div className="bg-white p-4 md:p-5 rounded-2xl border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)]">
                <div className="flex flex-wrap items-center justify-center gap-2.5 md:gap-3 p-1">
                    <FilterPill
                        label="All"
                        LucideIcon={MapPin}
                        count={CAMPUS_PLACES.length}
                        active={active === null}
                        onClick={() => setActive(null)}
                    />
                    {CATEGORIES.map((c) => (
                        <FilterPill
                            key={c}
                            label={c}
                            LucideIcon={CATEGORY_LUCIDE_ICONS[c]}
                            colour={CATEGORY_COLOURS[c]}
                            count={CAMPUS_PLACES.filter((p) => p.category === c).length}
                            active={active === c}
                            onClick={() => setActive(active === c ? null : c)}
                        />
                    ))}
                </div>
            </div>

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

                    {places.map((p) => {
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

                    <RecenterButton />
                </MapContainer>

                {/* Grain Noise Overlay */}
                <div className="map-grain-overlay" aria-hidden="true" />

                {/* Bottom Status Badge */}
                <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur border-2 border-nust-blue px-3.5 py-1.5 rounded-xl shadow-[3px_3px_0px_var(--nust-blue)] text-xs font-heading text-nust-blue flex items-center gap-1.5">
                    <span>{places.length} {places.length === 1 ? "LOCATION" : "LOCATIONS"}</span>
                    {active && <span className="text-nust-orange font-bold">• {active.toUpperCase()}</span>}
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
