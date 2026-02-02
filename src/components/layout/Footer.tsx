import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-nust-blue border-t-0 relative pt-12 pb-6 z-0 mt-8">

            {/* Top Tape - Moved from Page to Footer for fixed positioning */}
            <div className="absolute -top-5 left-0 right-0 z-[60] bg-nust-orange py-2 border-y-2 border-nust-blue overflow-hidden transform rotate-1 scale-110 origin-right shadow-md pointer-events-none">
                <div className="animate-marquee flex gap-12 whitespace-nowrap">
                    <span className="font-heading text-lg text-nust-blue tracking-widest">
                        • DONT MISS OUT • JOIN THE COMMUNITY • RSVP NOW • DONT MISS OUT • JOIN THE COMMUNITY •
                    </span>
                    <span className="font-heading text-lg text-nust-blue tracking-widest">
                        • DONT MISS OUT • JOIN THE COMMUNITY • RSVP NOW • DONT MISS OUT • JOIN THE COMMUNITY •
                    </span>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #E59500 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
            </div>

            <div className="container relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6">

                    {/* Brand Vibe */}
                    <div className="max-w-md">
                        <Link href="/" className="inline-flex items-center transform hover:scale-105 transition-transform duration-300">
                            {/* Drastically reduced logo size from h-48 to h-24/32 */}
                            <img src="/android-chrome-192x192.png" alt="NUST Nama" className="h-28 w-28 rounded-xl object-contain" />
                        </Link>
                        <p className="font-display text-white/80 text-sm mt-3 leading-relaxed max-w-xs mx-auto md:mx-0">
                            Your realtime guide to campus life. Find events, check crowd vibes, and never miss a moment.<br />
                            <span className="text-xs opacity-60 italic">Because FOMO is real.</span>
                        </p>
                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                            <Link href="/events" className="text-white font-bold hover:text-nust-orange transition-colors">
                                Events
                            </Link>
                            <Link href="/calendar" className="text-white font-bold hover:text-nust-orange transition-colors">
                                Calendar
                            </Link>
                            <Link href="/faq" className="text-white font-bold hover:text-nust-orange transition-colors">
                                FAQ
                            </Link>
                        </div>
                    </div>

                    {/* Social / Credits Vibe */}
                    <div className="flex flex-col items-center md:items-end gap-3">
                        <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-3 rotate-1 hover:rotate-0 transition-transform cursor-default shadow-lg">
                            <p className="font-heading text-white text-lg tracking-wide">
                                BUILT BY STUDENTS 💙
                            </p>
                            <p className="font-display text-[10px] text-white/70 text-center mt-0.5">
                                For the NUST Community
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <a href="#" className="w-8 h-8 rounded-full bg-white text-nust-blue flex items-center justify-center hover:-translate-y-1 transition-transform shadow-[2px_2px_0px_rgba(0,0,0,0.2)] text-xs">
                                📸
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white text-nust-blue flex items-center justify-center hover:-translate-y-1 transition-transform shadow-[2px_2px_0px_rgba(0,0,0,0.2)] text-xs">
                                ✖️
                            </a>
                            <a href="#" className="w-8 h-8 rounded-full bg-white text-nust-blue flex items-center justify-center hover:-translate-y-1 transition-transform shadow-[2px_2px_0px_rgba(0,0,0,0.2)] text-xs">
                                💬
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-4 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] font-display text-white/40">
                    <p>© 2026 NUST Nama. Open source & proud.</p>
                    <p>Made with ☕ at H-12 Islamabad</p>
                </div>
            </div>
        </footer>
    );
}
