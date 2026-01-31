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
    { id: "2", name: "C1 Student Center", event: "Cultural Night", people: 189, lat: 33.6420, lng: 72.9880, intensity: "medium" },
    { id: "3", name: "Sports Complex", event: "Football Match", people: 78, lat: 33.6400, lng: 72.9950, intensity: "medium" },
    { id: "4", name: "Central Library", event: "Study Session", people: 45, lat: 33.6440, lng: 72.9930, intensity: "low" },
    { id: "5", name: "NBS", event: "Business Gala", people: 120, lat: 33.6410, lng: 72.9860, intensity: "medium" },
];

const intensityColors = {
    high: "#EF4444",   // Red
    medium: "#F97316", // Orange
    low: "#EAB308",    // Yellow
};

export default function LeafletMap() {
    return (
        <div className="h-full w-full rounded-xl overflow-hidden border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)] z-0 relative">
            <MapContainer
                center={CENTER}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {hotspots.map((spot) => (
                    <CircleMarker
                        key={spot.id}
                        center={[spot.lat, spot.lng]}
                        radius={20}
                        pathOptions={{
                            color: intensityColors[spot.intensity as keyof typeof intensityColors],
                            fillColor: intensityColors[spot.intensity as keyof typeof intensityColors],
                            fillOpacity: 0.6,
                            weight: 2
                        }}
                    >
                        <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={true} className="font-heading">
                            <span className="font-bold text-nust-blue">🔥 {spot.event}</span>
                        </Tooltip>
                        <Popup className="font-sans">
                            <div className="p-1">
                                <h3 className="font-heading text-lg text-nust-blue m-0">{spot.name}</h3>
                                <p className="text-secondary text-xs font-bold uppercase tracking-wide mb-1">{spot.event}</p>
                                <div className="text-sm font-bold text-nust-orange">
                                    👥 {spot.people} people here
                                </div>
                                <div className="mt-2">
                                    <a href={`/events/${spot.id}`} className="btn bg-nust-blue text-white text-xs px-2 py-1 rounded shadow-sm inline-block">
                                        Check In
                                    </a>
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                ))}
            </MapContainer>

            {/* Overlay Legend */}
            <div className="absolute bottom-4 left-4 z-[400] bg-white/90 backdrop-blur border-2 border-nust-blue p-3 rounded-lg shadow-md">
                <h4 className="font-heading text-nust-blue text-sm mb-2">LIVE HEATMAP</h4>
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-nust-blue">High Activity</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-xs font-bold text-nust-blue">Medium Activity</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-xs font-bold text-nust-blue">Low Activity</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
