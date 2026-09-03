import React from "react";

export function UrgentBannerTape() {
    const alertMessage = (
        <div className="flex items-center gap-8 shrink-0">
            <span className="bg-white text-red-700 text-[11px] font-mono font-black px-2 py-0.5 uppercase tracking-wider border border-red-900">
                CAMPUS NOTICE
            </span>
            <span className="text-white font-sans font-bold text-xs sm:text-sm tracking-wide uppercase">
                MESS FEE CHALLAN IS OUT <span className="text-yellow-300 font-mono font-extrabold">[DEADLINE: 09 SEP]</span>
            </span>
            <span className="text-white/40 font-mono text-sm">//</span>
            <span className="text-white font-sans font-bold text-xs sm:text-sm tracking-wide uppercase">
                INTERNSHIP EVALUATION & SUBMISSION DEADLINE EXTENDED TO <span className="text-yellow-300 font-mono font-extrabold">[10 SEP]</span>
            </span>
            <span className="text-white/40 font-mono text-sm">//</span>
            <span className="text-white font-sans font-bold text-xs sm:text-sm tracking-wide uppercase">
                CLASSES COMMENCING ON <span className="text-yellow-300 font-mono font-extrabold">[07 SEP]</span>
            </span>
            <span className="text-white/40 font-mono text-sm">//</span>
        </div>
    );

    return (
        <div className="relative z-30 w-full bg-[#B91C1C] border-b-2 border-nust-blue py-2 overflow-hidden shadow-xs select-none">
            <div className="animate-marquee flex gap-8 whitespace-nowrap hover:[animation-play-state:paused] cursor-default">
                {alertMessage}
                {alertMessage}
            </div>
        </div>
    );
}
