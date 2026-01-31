"use client";

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

// NUST H-12 Campus Center
const CENTER: [number, number] = [33.6425, 72.9905];

const hotspots = [
    { id: "1", name: "SEECS", event: "Tech Fest 2026", people: 234, lat: 33.6455, lng: 72.9915, intensity: "high" },
    { id: "2", name: "Student Center", event: "Cultural Night", people: 189, lat: 33.6420, lng: 72.9880, intensity: "medium" },
    { id: "3", name: "Sports Complex", event: "Football Match", people: 78, lat: 33.6400, lng: 72.9950, intensity: "medium" },
    { id: "4", name: "Central Library", event: "Study Session", people: 45, lat: 33.6440, lng: 72.9930, intensity: "low" },
    { id: "5", name: "NBS", event: "Business Gala", people: 120, lat: 33.6410, lng: 72.9860, intensity: "medium" },
];

const intensityStyles = {
    high: { color: "#004B87", fillColor: "#004B87", fillOpacity: 0.4, radius: 35 },
    medium: { color: "#E59500", fillColor: "#E59500", fillOpacity: 0.3, radius: 28 },
    low: { color: "#004B87", fillColor: "#004B87", fillOpacity: 0.15, radius: 22 },
};

export default function LeafletMap() {
    return (
        <div className="h-full w-full rounded-2xl overflow-hidden border-2 border-nust-blue/20 shadow-lg z-0 relative bg-gray-100">
            <MapContainer
                center={CENTER}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
                zoomControl={false}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                {hotspots.map((spot) => {
                    const style = intensityStyles[spot.intensity as keyof typeof intensityStyles];
                    return (
                        <CircleMarker
                            key={spot.id}
                            center={[spot.lat, spot.lng]}
                            radius={style.radius}
                            pathOptions={{
                                color: style.color,
                                fillColor: style.fillColor,
                                fillOpacity: style.fillOpacity,
                                weight: 2,
                                opacity: 0.8,
                            }}
                        >
                            <Tooltip
                                direction="top"
                                offset={[0, -style.radius]}
                                opacity={1}
                                permanent
                                className="!bg-transparent !border-0 !shadow-none !p-0"
                            >
                                <div className="text-center">
                                    <span className="font-heading text-sm text-nust-blue drop-shadow-sm">
                                        {spot.name}
                                    </span>
                                </div>
                            </Tooltip>

                            <Popup className="minimal-popup">
                                <div className="p-2 text-center">
                                    <h3 className="font-heading text-xl text-nust-blue mb-1">{spot.name}</h3>
                                    <p className="text-nust-orange font-bold text-sm mb-2">{spot.event}</p>
                                    <div className="text-sm text-nust-blue/70 mb-3">
                                        👥 {spot.people} people here
                                    </div>
                                    <a
                                        href={`/events/${spot.id}`}
                                        className="inline-block bg-nust-blue text-white text-xs font-bold px-4 py-2 rounded-full"
                                    >
                                        View Event
                                    </a>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>

            <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-sm border border-gray-200 p-3 rounded-xl shadow-sm">
                <h4 className="font-heading text-nust-blue text-xs mb-2 uppercase tracking-wider">Activity</h4>
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-nust-blue/40 border border-nust-blue"></div>
                        <span className="text-xs text-gray-600">High</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-nust-orange/30 border border-nust-orange"></div>
                        <span className="text-xs text-gray-600">Medium</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-nust-blue/15 border border-nust-blue/50"></div>
                        <span className="text-xs text-gray-600">Low</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
