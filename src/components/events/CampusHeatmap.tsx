"use client";

import { useState } from "react";

// Mock hotspots on NUST campus
const hotspots = [
    { id: "1", name: "SEECS Auditorium", event: "Tech Fest 2026", people: 234, x: 65, y: 35, intensity: "high" },
    { id: "2", name: "Student Center", event: "Cultural Night", people: 189, x: 45, y: 55, intensity: "medium" },
    { id: "3", name: "Sports Complex", event: "Football Match", people: 78, x: 25, y: 70, intensity: "medium" },
    { id: "4", name: "Library", event: "Study Session", people: 45, x: 55, y: 45, intensity: "low" },
    { id: "5", name: "Cafe 101", event: "Open Mic Night", people: 67, x: 40, y: 35, intensity: "medium" },
];

const intensityColors = {
    high: "bg-red-500",
    medium: "bg-orange-400",
    low: "bg-yellow-400",
};

const intensityGlow = {
    high: "shadow-[0_0_30px_rgba(239,68,68,0.6)]",
    medium: "shadow-[0_0_20px_rgba(251,146,60,0.5)]",
    low: "shadow-[0_0_15px_rgba(250,204,21,0.4)]",
};

export function CampusHeatmap() {
    const [selectedSpot, setSelectedSpot] = useState<string | null>(null);

    const selectedHotspot = hotspots.find(h => h.id === selectedSpot);

    return (
        <div className="relative">
            {/* Map Container */}
            <div className="relative bg-white border-2 border-nust-blue rounded-xl overflow-hidden shadow-[8px_8px_0px_var(--nust-blue)]">
                {/* Map Background - Simplified NUST layout */}
                <div
                    className="relative w-full aspect-[16/9] min-h-[400px]"
                    style={{
                        background: `
              linear-gradient(135deg, #e8f4e8 0%, #d4e4d4 100%)
            `,
                    }}
                >
                    {/* Roads */}
                    <div className="absolute inset-0">
                        {/* Main Road */}
                        <div className="absolute top-1/2 left-0 right-0 h-3 bg-gray-400 -translate-y-1/2" />
                        <div className="absolute top-0 bottom-0 left-1/2 w-3 bg-gray-400 -translate-x-1/2" />
                        {/* Secondary roads */}
                        <div className="absolute top-1/4 left-1/4 right-1/4 h-2 bg-gray-300" />
                        <div className="absolute top-3/4 left-1/4 right-1/4 h-2 bg-gray-300" />
                    </div>

                    {/* Buildings (simplified blocks) */}
                    <div className="absolute top-[20%] left-[60%] w-16 h-12 bg-nust-blue/30 rounded border border-nust-blue/50" />
                    <div className="absolute top-[50%] left-[40%] w-20 h-14 bg-nust-blue/30 rounded border border-nust-blue/50" />
                    <div className="absolute top-[65%] left-[20%] w-24 h-16 bg-nust-blue/30 rounded border border-nust-blue/50" />
                    <div className="absolute top-[30%] left-[50%] w-14 h-10 bg-nust-blue/30 rounded border border-nust-blue/50" />
                    <div className="absolute top-[25%] left-[35%] w-18 h-12 bg-nust-blue/30 rounded border border-nust-blue/50" />

                    {/* Hotspots */}
                    {hotspots.map((spot) => (
                        <button
                            key={spot.id}
                            onClick={() => setSelectedSpot(spot.id === selectedSpot ? null : spot.id)}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-300 ${selectedSpot === spot.id ? "scale-125" : "hover:scale-110"
                                }`}
                            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                        >
                            <div className={`relative`}>
                                {/* Pulse animation */}
                                <div className={`absolute inset-0 rounded-full ${intensityColors[spot.intensity as keyof typeof intensityColors]} animate-ping opacity-75`}
                                    style={{ width: "40px", height: "40px", marginLeft: "-8px", marginTop: "-8px" }} />

                                {/* Main dot */}
                                <div className={`w-6 h-6 rounded-full ${intensityColors[spot.intensity as keyof typeof intensityColors]} ${intensityGlow[spot.intensity as keyof typeof intensityGlow]} border-2 border-white flex items-center justify-center`}>
                                    <span className="text-white text-xs font-bold">{spot.people > 100 ? "🔥" : ""}</span>
                                </div>
                            </div>
                        </button>
                    ))}

                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 border border-nust-blue/20">
                        <p className="font-display text-xs text-nust-blue font-bold uppercase mb-2">Activity Level</p>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="text-xs text-nust-blue/70">High</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-orange-400" />
                                <span className="text-xs text-nust-blue/70">Medium</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                                <span className="text-xs text-nust-blue/70">Low</span>
                            </div>
                        </div>
                    </div>

                    {/* NUST Label */}
                    <div className="absolute top-4 right-4 font-heading text-2xl text-nust-blue/30">
                        NUST CAMPUS
                    </div>
                </div>
            </div>

            {/* Selected Hotspot Details */}
            {selectedHotspot && (
                <div className="mt-6 bg-white border-2 border-nust-blue rounded-xl p-6 shadow-[4px_4px_0px_var(--nust-blue)] animate-slide-up">
                    <div className="flex items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`w-4 h-4 rounded-full ${intensityColors[selectedHotspot.intensity as keyof typeof intensityColors]}`} />
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
