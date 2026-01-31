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

const intensityStyles = {
    high: { color: "#004B87", fillColor: "#004B87", fillOpacity: 0.8, radius: 20 },
    medium: { color: "#E59500", fillColor: "#E59500", fillOpacity: 0.8, radius: 18 },
    low: { color: "#004B87", fillColor: "#004B87", fillOpacity: 0.5, radius: 15 },
};

export default function LeafletMap() {
    return (
        <div className="h-full w-full rounded-2xl overflow-hidden border-2 border-nust-blue/20 shadow-lg z-0 relative bg-gray-50 group">

            {/* Emoji Background Pattern Overlay */}
            <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03] overflow-hidden select-none"
                style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 100 100'%3E%3Ctext x='50%%' y='50%%' font-size='40' text-anchor='middle' dominant-baseline='middle'%3E🔥%3C/text%3E%3C/svg%3E\")",
                    backgroundSize: "60px 60px"
                }}>
            </div>
            <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.03] overflow-hidden select-none translate-x-8 translate-y-8"
                style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 100 100'%3E%3Ctext x='50%%' y='50%%' font-size='40' text-anchor='middle' dominant-baseline='middle'%3E💯%3C/text%3E%3C/svg%3E\")",
                    backgroundSize: "60px 60px"
                }}>
            </div>

            <MapContainer
                center={CENTER}
                zoom={15}
                style={{ height: "100%", width: "100%", zIndex: 10 }} // zIndex needed to be above background but below overlays
                scrollWheelZoom={true} // Enable zoom
                zoomControl={true}
                className="z-10 bg-transparent" // Transparent to show pattern? No, Leaflet adds its own bg. pattern must be on top?
            >
                <TileLayer
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    className="opacity-90" // Slight transparency for texture to show through
                />

                {hotspots.map((spot) => {
                    const style = intensityStyles[spot.intensity as keyof typeof intensityStyles];
                    return (
                        <CircleMarker
                            key={spot.id}
                            center={[spot.lat, spot.lng]}
                            radius={style.radius}
                            pathOptions={{
                                color: "white",
                                weight: 2,
                                fillColor: style.fillColor,
                                fillOpacity: 1,
                            }}
                        >
                            {/* Event Name Minimal Box */}
                            <Tooltip
                                direction="top"
                                offset={[0, -style.radius - 5]}
                                opacity={1}
                                permanent
                                className="!bg-white !border-2 !border-nust-blue !text-nust-blue !font-bold !rounded-md !px-2 !py-0.5 !shadow-md !text-xs !font-display"
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
                                    <a
                                        href={`/events/${spot.id}`}
                                        className="block w-full bg-nust-blue text-white text-[10px] font-bold py-1.5 rounded hover:bg-nust-blue/90"
                                    >
                                        CHECK IN
                                    </a>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>
        </div>
    );
}
