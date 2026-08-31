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
    sentiment?: "pos" | "neu" | "neg" | null;
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

    const now = new Date();
    const hoursUntil = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    const isHappeningSoon = hoursUntil > 0 && hoursUntil <= 2;
    const isLive = hoursUntil <= 0 && event.end_time ? new Date(event.end_time) > now : false;

    return (
        <Link
            href={`/events/${event.id}`}
            className="block h-full group"
        >
            <div className="h-full flex flex-col bg-white rounded-2xl border-2 border-nust-blue shadow-[4px_4px_0px_var(--nust-blue)] group-hover:shadow-[6px_6px_0px_var(--nust-orange)] group-hover:-translate-y-1 transition-all duration-200 overflow-hidden">

                {/* Poster Image (if available) */}
                {event.poster_url && (
                    <div className="h-44 w-full overflow-hidden border-b-2 border-nust-blue relative bg-cream">
                        <img
                            src={event.poster_url}
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                )}

                <div className="p-5 flex flex-col flex-1">
                    {/* Header Row: Date Badge + Meta */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                            <div className="bg-nust-blue/10 border border-nust-blue/20 rounded-xl p-2 text-center min-w-[54px]">
                                <span className="block font-heading text-2xl text-nust-blue leading-none">{day}</span>
                                <span className="block font-sans text-xs text-nust-blue font-bold uppercase">{month}</span>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-nust-blue/70 flex items-center gap-1">
                                    <span>🕐</span>
                                    <span>{time}</span>
                                </div>
                                {event.venue_name && (
                                    <div className="text-xs font-medium text-nust-blue/90 truncate max-w-[130px] mt-0.5">
                                        📍 {event.venue_name}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status / Official Badge */}
                        {isLive ? (
                            <span className="bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-nust-blue shadow-sm animate-pulse">
                                LIVE 🔥
                            </span>
                        ) : isHappeningSoon ? (
                            <span className="bg-nust-orange text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-nust-blue shadow-sm">
                                Soon ⚡
                            </span>
                        ) : event.is_official ? (
                            <span className="bg-nust-blue/5 text-nust-blue text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-nust-blue/20">
                                Official
                            </span>
                        ) : null}
                    </div>

                    {/* Event Title */}
                    <h3 className="font-sans font-bold text-base md:text-lg text-nust-blue group-hover:text-nust-orange transition-colors leading-snug line-clamp-2 mb-2">
                        {event.title}
                    </h3>

                    {/* Description */}
                    {event.description && (
                        <p className="text-xs md:text-sm text-nust-blue/70 line-clamp-2 mb-4 leading-relaxed flex-1">
                            {event.description}
                        </p>
                    )}

                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                            {event.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-cream text-nust-blue/80 border border-nust-blue/15"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Footer */}
                    <div className="pt-3 mt-auto border-t border-nust-blue/10 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-nust-blue">
                            <span>👥</span>
                            <span>{event.rsvp_count} going</span>
                        </div>

                        <div className="w-7 h-7 rounded-full bg-nust-blue/10 group-hover:bg-nust-orange text-nust-blue group-hover:text-white flex items-center justify-center transition-colors border border-nust-blue/20">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </div>
                    </div>
                </div>

            </div>
        </Link>
    );
}
