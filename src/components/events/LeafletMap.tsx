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

const CENTER: [number, number] = [33.6425, 72.9905];

const hotspots = [
    { id: "1", name: "SEECS", event: "Tech Fest '26", people: 234, lat: 33.6455, lng: 72.9915, intensity: "high" },
    { id: "2", name: "Student Center", event: "Cultural Night", people: 189, lat: 33.6420, lng: 72.9880, intensity: "medium" },
    { id: "3", name: "Sports Complex", event: "Football Final", people: 78, lat: 33.6400, lng: 72.9950, intensity: "medium" },
    { id: "4", name: "Central Library", event: "Quiet Study", people: 45, lat: 33.6440, lng: 72.9930, intensity: "low" },
    { id: "5", name: "NBS", event: "Business Gala", people: 120, lat: 33.6410, lng: 72.9860, intensity: "medium" },
];

// Single Color (Orange) with varying Opacity
const intensityStyles = {
    high: { opacity: 0.9, radius: 25, label: "High Hype" },
    medium: { opacity: 0.6, radius: 20, label: "Medium Vibes" },
    low: { opacity: 0.3, radius: 15, label: "Lowkey" },
};

export default function LeafletMap() {
    return (
        <div className="h-full w-full rounded-2xl overflow-hidden border-2 border-nust-blue shadow-lg z-0 relative bg-cream group">

            {/* 
        Emoji Background Pattern - High Contrast 
        Using repeated SVG background
      */}
            <div className="absolute inset-0 z-[1] pointer-events-none opacity-10"
                style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ctext x='25' y='25' font-size='30' text-anchor='middle'%3E🔥%3C/text%3E%3Ctext x='75' y='75' font-size='30' text-anchor='middle'%3E💯%3C/text%3E%3C/svg%3E\")",
                    backgroundSize: "60px 60px"
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
                    className="opacity-80 mix-blend-multiply" // Blend with emoji bg
                />

                {hotspots.map((spot) => {
                    const style = intensityStyles[spot.intensity as keyof typeof intensityStyles];
                    return (
                        <CircleMarker
                            key={spot.id}
                            center={[spot.lat, spot.lng]}
                            radius={style.radius}
                            pathOptions={{
                                color: "#E59500", // Outline same color
                                weight: 2,
                                fillColor: "#E59500", // NUST Orange
                                fillOpacity: style.opacity,
                            }}
                        >
                            <Tooltip
                                direction="top"
                                offset={[0, -style.radius - 5]}
                                opacity={1}
                                permanent
                                className="!bg-white !border-2 !border-nust-orange !text-nust-blue !font-bold !rounded-md !px-2 !py-0.5 !shadow-md !text-xs !font-display uppercase tracking-widest"
                            >
                                {spot.event}
                            </Tooltip>

                            <Popup className="minimal-popup">
                                <div className="text-center min-w-[120px]">
                                    <h3 className="font-heading text-lg text-nust-blue leading-none mb-1">{spot.name}</h3>
                                    <div className="flex items-center justify-center gap-1 text-xs font-bold text-nust-orange mb-2">
                                        <span>🔥</span>
                                        <span>{spot.people} here</span>
                                    </div>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>

            {/* Opacity Legend */}
            <div className="absolute bottom-4 right-4 z-[400] bg-white/90 backdrop-blur border border-nust-orange p-3 rounded-xl shadow-lg">
                <h4 className="font-heading text-nust-blue text-xs mb-2">HYPE LEVEL</h4>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-nust-orange opacity-90 border border-nust-orange"></div>
                        <span className="text-xs font-bold text-nust-blue">High Hype</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-nust-orange opacity-60 border border-nust-orange"></div>
                        <span className="text-xs font-bold text-nust-blue">Mid Vibes</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-nust-orange opacity-30 border border-nust-orange"></div>
                        <span className="text-xs font-bold text-nust-blue">Chill</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
