"use client";

import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Next.js
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// NUST H-12 Campus Center
const CENTER: [number, number] = [33.6425, 72.9905];

const hotspots = [
    { id: "1", name: "SEECS", event: "Tech Fest 2026", people: 234, lat: 33.6455, lng: 72.9915, intensity: "high" },
    { id: "2", name: "Student Center", event: "Cultural Night", people: 189, lat: 33.6420, lng: 72.9880, intensity: "medium" },
    { id: "3", name: "Sports Complex", event: "Football Match", people: 78, lat: 33.6400, lng: 72.9950, intensity: "medium" },
    { id: "4", name: "Library", event: "Study Session", people: 45, lat: 33.6440, lng: 72.9930, intensity: "low" },
    { id: "5", name: "NBS", event: "Business Gala", people: 120, lat: 33.6410, lng: 72.9860, intensity: "medium" },
];

const intensityColors = {
    high: "#E59500",    // NUST Orange for high
    medium: "#004B87",  // NUST Blue for medium
    low: "#6B7280",     // Gray for low
};

export default function LeafletMap() {
    return (
        <div className="h-full w-full rounded-2xl overflow-hidden border-2 border-nust-blue/20 shadow-xl relative bg-white">
            <MapContainer
                center={CENTER}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
                zoomControl={false}
                className="z-0"
            >
                {/* Clean, minimal grayscale map tiles */}
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {hotspots.map((spot) => (
                    <CircleMarker
                        key={spot.id}
                        center={[spot.lat, spot.lng]}
                        radius={spot.intensity === "high" ? 25 : spot.intensity === "medium" ? 18 : 12}
                        pathOptions={{
                            color: "white",
                            fillColor: intensityColors[spot.intensity as keyof typeof intensityColors],
                            fillOpacity: 0.85,
                            weight: 3
                        }}
                    >
                        <Tooltip
                            direction="top"
                            offset={[0, -15]}
                            opacity={1}
                            className="!bg-nust-blue !text-white !border-0 !rounded-lg !px-3 !py-1 !font-display !text-sm !shadow-lg"
                        >
                            <span className="font-bold">{spot.event}</span>
                            <br />
                            <span className="text-white/70 text-xs">👥 {spot.people}</span>
                        </Tooltip>
                        <Popup className="font-sans">
                            <div className="p-1 min-w-[150px]">
                                <h3 className="font-heading text-lg text-nust-blue m-0 mb-1">{spot.name}</h3>
                                <p className="text-nust-orange text-sm font-bold uppercase tracking-wide m-0 mb-2">{spot.event}</p>
                                <div className="text-sm text-gray-600 mb-3">
                                    👥 {spot.people} people here now
                                </div>
                                <a href={`/events/${spot.id}`} className="block w-full text-center bg-nust-blue text-white text-sm px-3 py-2 rounded-lg font-bold hover:bg-nust-blue/90 transition-colors">
                                    View Event →
                                </a>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>

            {/* Minimal Legend */}
            <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-sm border border-gray-200 px-3 py-2 rounded-lg shadow-sm">
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-nust-orange"></div>
                        <span className="text-gray-600">Hot</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-nust-blue"></div>
                        <span className="text-gray-600">Active</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                        <span className="text-gray-600">Quiet</span>
                    </div>
                </div>
            </div>

            {/* Badge */}
            <div className="absolute top-3 right-3 z-[400] bg-nust-orange text-nust-blue px-3 py-1 rounded-full font-heading text-sm shadow-md">
                LIVE
            </div>
        </div>
    );
}
