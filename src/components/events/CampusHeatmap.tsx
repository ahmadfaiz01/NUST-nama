"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Mock hotspots on NUST campus (real coordinates)
const hotspots = [
    { id: "1", name: "SEECS", event: "Tech Fest 2026", people: 234, lat: 33.6426, lng: 72.9903, intensity: "high" },
    { id: "2", name: "Student Center", event: "Cultural Night", people: 189, lat: 33.6415, lng: 72.9885, intensity: "medium" },
    { id: "3", name: "Sports Complex", event: "Football Match", people: 78, lat: 33.6380, lng: 72.9870, intensity: "medium" },
    { id: "4", name: "Library", event: "Study Session", people: 45, lat: 33.6435, lng: 72.9875, intensity: "low" },
    { id: "5", name: "Cafe 101", event: "Open Mic Night", people: 67, lat: 33.6422, lng: 72.9890, intensity: "medium" },
    { id: "6", name: "Convention Center", event: "Career Fair", people: 156, lat: 33.6395, lng: 72.9910, intensity: "high" },
];

const intensityColors = {
    high: "#ef4444",
    medium: "#f97316",
    low: "#eab308",
};

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("./MapComponent"), {
    ssr: false,
    loading: () => (
        <div className="w-full aspect-[16/9] min-h-[400px] bg-nust-blue/10 rounded-xl border-2 border-nust-blue flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin w-10 h-10 border-4 border-nust-blue border-t-transparent rounded-full mx-auto mb-4" />
                <p className="font-display text-nust-blue">Loading NUST Campus Map...</p>
            </div>
        </div>
    ),
});

export function CampusHeatmap() {
    const [selectedSpot, setSelectedSpot] = useState<string | null>(null);
    const selectedHotspot = hotspots.find(h => h.id === selectedSpot);

    return (
        <div className="relative">
            {/* Map Container */}
            <div className="relative bg-white border-2 border-nust-blue rounded-xl overflow-hidden shadow-[8px_8px_0px_var(--nust-blue)]">
                <MapComponent
                    hotspots={hotspots}
                    selectedSpot={selectedSpot}
                    onSelectSpot={setSelectedSpot}
                    intensityColors={intensityColors}
                />

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 border-2 border-nust-blue shadow-md z-[1000]">
                    <p className="font-display text-xs text-nust-blue font-bold uppercase mb-2">Activity Level</p>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-xs text-nust-blue/70 font-display">High</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-orange-500" />
                            <span className="text-xs text-nust-blue/70 font-display">Medium</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-yellow-500" />
                            <span className="text-xs text-nust-blue/70 font-display">Low</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Selected Hotspot Details */}
            {selectedHotspot && (
                <div className="mt-6 bg-white border-2 border-nust-blue rounded-xl p-6 shadow-[4px_4px_0px_var(--nust-blue)]">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: intensityColors[selectedHotspot.intensity as keyof typeof intensityColors] }}
                                />
                                <span className="font-display text-sm text-nust-blue/60 uppercase tracking-wide">{selectedHotspot.name}</span>
                            </div>
                            <h3 className="font-heading text-3xl text-nust-blue mb-2">{selectedHotspot.event}</h3>
                            <p className="font-display text-lg text-nust-orange font-bold">
                                👥 {selectedHotspot.people} people here right now
                            </p>
                        </div>
                        <button className="btn btn-primary text-sm">
                            View Event
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
