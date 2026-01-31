"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamic import to avoid SSR issues with Leaflet
const MapContainer = dynamic(() => import("react-leaflet").then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(m => m.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(m => m.Popup), { ssr: false });

// Fix Leaflet's default icon issue in Next.js
const fixLeafletIcon = async () => {
    const L = (await import("leaflet")).default;
    // @ts-ignore
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
};

interface EventMapProps {
    lat: number;
    lng: number;
    venueName: string;
}

export default function EventMap({ lat, lng, venueName }: EventMapProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        fixLeafletIcon();
    }, []);

    if (!isClient) {
        return <div className="h-64 w-full bg-gray-100 animate-pulse rounded-lg border-2 border-nust-blue" />;
    }

    return (
        <div className="h-64 w-full rounded-lg overflow-hidden border-2 border-nust-blue relative z-0">
            {/* @ts-ignore */}
            <MapContainer center={[lat, lng]} zoom={16} scrollWheelZoom={false} className="h-full w-full">
                {/* @ts-ignore */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* @ts-ignore */}
                <Marker position={[lat, lng]}>
                    {/* @ts-ignore */}
                    <Popup>
                        <span className="font-bold">{venueName}</span>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
