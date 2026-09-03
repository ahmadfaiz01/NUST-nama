import React from "react";

export function UrgentBannerTape() {
    const alertMessage = (
        <div className="flex items-center gap-6 shrink-0">
            <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-nust-blue text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-nust-blue shadow-xs uppercase tracking-wider">
                🚨 IMPORTANT
            </span>
            <span className="text-white font-heading text-base tracking-widest uppercase">
                MESS FEE CHALLAN IS OUT <span className="text-yellow-300 font-bold underline decoration-2 underline-offset-2">(DEADLINE: 9 SEP)</span>
            </span>
            <span className="text-white/60">•</span>
            <span className="text-white font-heading text-base tracking-widest uppercase">
                INTERNSHIP EVALUATION & SUBMISSION DEADLINE EXTENDED TO <span className="text-yellow-300 font-bold underline decoration-2 underline-offset-2">10 SEP</span>
            </span>
            <span className="text-white/60">•</span>
            <span className="text-white font-heading text-base tracking-widest uppercase">
                CLASSES COMMENCING ON <span className="text-yellow-300 font-bold underline decoration-2 underline-offset-2">7 SEP</span>
            </span>
            <span className="text-white/60">•</span>
        </div>
    );

    return (
        <div className="relative z-30 w-full bg-red-600 border-b-2 border-nust-blue py-2 overflow-hidden shadow-sm select-none">
            <div className="animate-marquee flex gap-8 whitespace-nowrap hover:[animation-play-state:paused] cursor-default">
                {alertMessage}
                {alertMessage}
            </div>
        </div>
    );
}
