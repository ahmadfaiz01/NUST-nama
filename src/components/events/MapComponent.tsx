"use client";

import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

interface Hotspot {
    id: string;
    name: string;
    event: string;
    people: number;
    lat: number;
    lng: number;
    intensity: string;
}

interface MapComponentProps {
    hotspots: Hotspot[];
    selectedSpot: string | null;
    onSelectSpot: (id: string | null) => void;
    intensityColors: Record<string, string>;
}

// NUST H-12 Campus center coordinates
const NUST_CENTER: [number, number] = [33.6410, 72.9890];
const ZOOM_LEVEL = 16;

function MapEvents({ selectedSpot, hotspots }: { selectedSpot: string | null; hotspots: Hotspot[] }) {
    const map = useMap();

    useEffect(() => {
        if (selectedSpot) {
            const spot = hotspots.find(h => h.id === selectedSpot);
            if (spot) {
                map.flyTo([spot.lat, spot.lng], 17, { duration: 0.5 });
            }
        }
    }, [selectedSpot, hotspots, map]);

    return null;
}

export default function MapComponent({ hotspots, selectedSpot, onSelectSpot, intensityColors }: MapComponentProps) {
    const getRadius = (intensity: string) => {
        switch (intensity) {
            case "high": return 35;
            case "medium": return 25;
            case "low": return 18;
            default: return 20;
        }
    };

    return (
        <MapContainer
            center={NUST_CENTER}
            zoom={ZOOM_LEVEL}
            style={{ height: "450px", width: "100%", zIndex: 1 }}
            zoomControl={false}
            attributionControl={false}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />

            <MapEvents selectedSpot={selectedSpot} hotspots={hotspots} />

            {hotspots.map((spot) => (
                <CircleMarker
                    key={spot.id}
                    center={[spot.lat, spot.lng]}
                    radius={getRadius(spot.intensity)}
                    pathOptions={{
                        color: intensityColors[spot.intensity] || "#f97316",
                        fillColor: intensityColors[spot.intensity] || "#f97316",
                        fillOpacity: 0.6,
                        weight: 3,
                    }}
                    eventHandlers={{
                        click: () => onSelectSpot(spot.id === selectedSpot ? null : spot.id),
                    }}
                >
                    <Popup>
                        <div className="text-center min-w-[150px]">
                            <p className="font-bold text-nust-blue text-sm">{spot.name}</p>
                            <p className="text-xs text-gray-600">{spot.event}</p>
                            <p className="text-sm font-bold mt-1" style={{ color: intensityColors[spot.intensity] }}>
                                🔥 {spot.people} people
                            </p>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
    );
}
