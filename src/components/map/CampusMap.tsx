"use client";

import { useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
    CAMPUS_CENTER,
    CAMPUS_PLACES,
    CAMPUS_ZOOM,
    CATEGORIES,
    CATEGORY_COLOURS,
    type Category,
} from "@/lib/campus_places";

/**
 * Leaflet gives no imperative handle from outside MapContainer, so the recenter
 * button has to live inside it as a child that can call useMap().
 */
function RecenterButton() {
    const map = useMap();
    return (
        <button
            type="button"
            onClick={() => map.setView(CAMPUS_CENTER, CAMPUS_ZOOM)}
            className="absolute bottom-4 right-4 z-[400] bg-white border-2 border-nust-blue text-nust-blue font-display text-xs font-bold uppercase tracking-widest px-3 py-2 shadow-[3px_3px_0px_var(--nust-blue)] hover:bg-cream"
        >
            Recenter
        </button>
    );
}

export default function CampusMap() {
    const [active, setActive] = useState<Category | null>(null);

    const places = active ? CAMPUS_PLACES.filter((p) => p.category === active) : CAMPUS_PLACES;

    return (
        <div className="flex flex-col gap-3 h-full min-h-0">
            <div className="flex flex-wrap gap-2 shrink-0">
                <FilterPill label="All" active={active === null} onClick={() => setActive(null)} />
                {CATEGORIES.map((c) => (
                    <FilterPill
                        key={c}
                        label={c}
                        colour={CATEGORY_COLOURS[c]}
                        active={active === c}
                        onClick={() => setActive(active === c ? null : c)}
                    />
                ))}
            </div>

            <div className="relative flex-1 min-h-0 border-2 border-nust-blue shadow-[6px_6px_0px_var(--nust-blue)] overflow-hidden bg-cream">
                <MapContainer
                    center={CAMPUS_CENTER}
                    zoom={CAMPUS_ZOOM}
                    style={{ height: "100%", width: "100%" }}
                    scrollWheelZoom
                    className="z-10"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    />

                    {places.map((p) => (
                        <CircleMarker
                            key={p.id}
                            center={[p.lat, p.lng]}
                            radius={7}
                            pathOptions={{
                                // Pale categories vanish against the basemap without
                                // the dark stroke.
                                color: "var(--nust-blue, #1B3A6B)",
                                weight: 2,
                                fillColor: CATEGORY_COLOURS[p.category],
                                fillOpacity: 1,
                            }}
                        >
                            <Popup className="minimal-popup">
                                <div className="min-w-[160px]">
                                    <h3 className="font-heading text-base text-nust-blue leading-tight mb-1">
                                        {p.name}
                                    </h3>
                                    <p className="text-xs text-nust-blue/80 leading-snug m-0">{p.blurb}</p>
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}

                    <RecenterButton />
                </MapContainer>
            </div>

            <p className="text-xs text-nust-blue/60 shrink-0">
                {places.length} {places.length === 1 ? "place" : "places"}
                {active ? ` in ${active}` : " on campus"}. Pin positions are approximate.
            </p>
        </div>
    );
}

function FilterPill({
    label,
    colour,
    active,
    onClick,
}: {
    label: string;
    colour?: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`flex items-center gap-2 border-2 border-nust-blue px-3 py-1.5 font-display text-xs font-bold uppercase tracking-widest transition-colors ${
                active ? "bg-nust-blue text-white" : "bg-white text-nust-blue hover:bg-cream"
            }`}
        >
            {colour && (
                <span
                    aria-hidden
                    className="w-3 h-3 rounded-full border border-nust-blue"
                    style={{ backgroundColor: colour }}
                />
            )}
            {label}
        </button>
    );
}
