import Link from "next/link";

interface Event {
    id: string;
    title: string;
    description: string | null;
    start_time: string;
    end_time: string | null;
    venue_name: string | null;
    tags: string[] | null;
    is_official: boolean;
    rsvp_count: number;
    checkin_count: number;
    sentiment: "pos" | "neu" | "neg" | null;
    poster_url?: string | null;
}

interface EventCardProps {
    event: Event;
    index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
    const startDate = new Date(event.start_time);
    const month = startDate.toLocaleDateString("en-US", { month: "short" });
    const day = startDate.getDate();
    const time = startDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

    // Realistic slight alternating angles for cards & tape
    const tapeRotations = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];
    const tapeAngle = tapeRotations[index % tapeRotations.length];

    const cardRotations = [
        "-rotate-[0.8deg]",
        "rotate-[0.9deg]",
        "-rotate-[0.6deg]",
        "rotate-[0.7deg]",
    ];
    const cardAngle = cardRotations[index % cardRotations.length];

    return (
        <Link
            href={`/events/${event.id}`}
            className="block h-full group pt-3"
        >
            <div className={`relative h-full flex flex-col bg-[#FCFAF5] rounded-2xl border-2 border-nust-blue shadow-[5px_5px_0px_var(--nust-blue)] group-hover:shadow-[7px_7px_0px_var(--nust-orange)] group-hover:-translate-y-1.5 transition-all duration-200 ${cardAngle} group-hover:rotate-0`}>

                {/* Real-Life Masking Tape Strip (extending outside the card top) */}
                <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-6.5 bg-[#EED8A1]/90 backdrop-blur-[1px] border-y border-black/10 shadow-[0_2px_4px_rgba(0,0,0,0.15)] z-20 pointer-events-none transition-transform duration-200 ${tapeAngle} group-hover:rotate-0 flex items-center justify-center`}
                    style={{
                        backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(0,0,0,0.02) 4px, rgba(0,0,0,0.02) 8px)`,
                    }}
                >
                    <div className="w-full h-full border-x-2 border-dashed border-black/15" />
                </div>

                {/* Poster Image (if available) */}
                {event.poster_url && (
                    <div className="h-48 w-full overflow-hidden rounded-t-[14px] border-b-2 border-nust-blue relative bg-black/5">
                        <img
                            src={event.poster_url}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                )}

                {/* Date & Badge Header Row */}
                <div className={`flex justify-between items-start mb-3 relative z-10 ${event.poster_url ? "p-4 pb-0" : "p-4 pt-5 pb-0"}`}>
                    {/* Tear-Off Calendar Stamp */}
                    <div className="flex flex-col rounded-lg overflow-hidden border-2 border-nust-blue shadow-[2px_2px_0px_var(--nust-blue)] bg-white min-w-[56px]">
                        <span className="bg-nust-blue text-white font-heading text-[11px] tracking-wider uppercase py-0.5 px-2 text-center leading-tight">
                            {month}
                        </span>
                        <span className="font-heading text-2xl text-nust-blue py-1 px-2 text-center leading-none">
                            {day}
                        </span>
                    </div>

                    {/* Official Stamp */}
                    {event.is_official && (
                        <span className="border-2 border-dashed border-red-500/80 text-red-600 bg-red-50/70 font-mono text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded rotate-[-3deg] shadow-sm">
                            Official ✦
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 px-4 pt-2 flex flex-col">
                    <h3 className="font-heading text-2xl text-nust-blue mb-2 leading-tight group-hover:text-nust-orange transition-colors">
                        {event.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-nust-blue/70 mb-3 font-sans font-medium">
                        <svg className="w-3.5 h-3.5 text-nust-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>@{time}</span>
                    </div>

                    {/* Location Label Sticker */}
                    {event.venue_name && (
                        <div className="inline-flex items-center gap-1.5 bg-white text-nust-blue text-xs font-sans font-semibold px-2.5 py-1 rounded-md border border-nust-blue/25 shadow-[1.5px_1.5px_0px_rgba(27,58,107,0.2)] mb-3 w-fit">
                            <span>📍</span>
                            <span className="truncate max-w-[200px]">{event.venue_name}</span>
                        </div>
                    )}

                    {event.description && (
                        <p className="text-xs text-nust-blue/70 line-clamp-2 leading-relaxed font-sans mb-4">
                            {event.description}
                        </p>
                    )}
                </div>

                {/* Perforated Divider & Footer */}
                <div className="mt-auto mx-4 mb-4 pt-3 border-t-2 border-dashed border-nust-blue/15 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-sans font-bold text-nust-blue">
                        <span>👥</span>
                        <span>{event.rsvp_count} going</span>
                    </div>

                    <div className="w-7 h-7 rounded-full bg-nust-orange text-white flex items-center justify-center border-2 border-nust-blue shadow-[1.5px_1.5px_0px_var(--nust-blue)] group-hover:bg-white group-hover:text-nust-blue transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                </div>

            </div>
        </Link>
    );
}

