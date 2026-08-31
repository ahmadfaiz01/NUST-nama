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

    const tapeRotations = ["-rotate-1", "rotate-1", "-rotate-2", "rotate-2"];
    const tapeAngle = tapeRotations[index % tapeRotations.length];

    return (
        <Link
            href={`/events/${event.id}`}
            className="block h-full group pt-3"
        >
            <div className="relative h-full flex flex-col bg-white rounded-2xl border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)] group-hover:shadow-[6px_6px_0px_var(--nust-orange)] group-hover:-translate-y-1 transition-all duration-200">

                {/* Masking Tape Strip */}
                <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-[#F3DEAB]/90 backdrop-blur-[1px] border-y border-black/10 shadow-sm z-20 pointer-events-none ${tapeAngle}`}
                />

                {/* Poster Image (if available) */}
                {event.poster_url && (
                    <div className="h-48 w-full overflow-hidden rounded-t-[14px] border-b-2 border-nust-blue relative bg-gray-50">
                        <img
                            src={event.poster_url}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                )}

                {/* Date & Badge Header Row */}
                <div className={`flex justify-between items-start mb-3 relative z-10 ${event.poster_url ? "p-4 pb-0" : "p-4 pt-5 pb-0"}`}>
                    <div className="bg-nust-orange text-white rounded-2xl p-2 text-center border-2 border-nust-blue min-w-[56px] shadow-[2px_2px_0px_var(--nust-blue)]">
                        <span className="block font-heading text-2xl leading-none">{day}</span>
                        <span className="block font-display text-[11px] font-bold uppercase">{month}</span>
                    </div>

                    {event.is_official && (
                        <span className="bg-nust-blue/10 text-nust-blue border border-nust-blue/20 text-xs font-bold px-2.5 py-1 rounded-full">
                            Official
                        </span>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 px-4 flex flex-col">
                    <h3 className="font-heading text-2xl text-nust-blue mb-2 leading-tight group-hover:text-nust-orange transition-colors">
                        {event.title}
                    </h3>

                    <div className="flex items-center gap-1.5 text-sm text-foreground-muted mb-3 font-medium">
                        <svg className="w-4 h-4 text-nust-blue/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>@{time}</span>
                    </div>

                    {event.venue_name && (
                        <div className="inline-flex items-center gap-1.5 bg-nust-blue/5 text-nust-blue text-xs font-bold px-2.5 py-1 rounded-lg border border-nust-blue/15 mb-3 w-fit">
                            <span>📍</span>
                            <span className="truncate max-w-[200px]">{event.venue_name}</span>
                        </div>
                    )}

                    {event.description && (
                        <p className="text-sm text-foreground-muted line-clamp-2 leading-relaxed mb-4">
                            {event.description}
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-auto mx-4 mb-4 pt-3 border-t-2 border-dashed border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-nust-blue">
                        <span>👥</span>
                        <span>{event.rsvp_count} going</span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-nust-orange text-white flex items-center justify-center border-2 border-nust-blue shadow-sm group-hover:bg-white group-hover:text-nust-orange transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                </div>

            </div>
        </Link>
    );
}

