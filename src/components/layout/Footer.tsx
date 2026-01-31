import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-nust-blue border-t-4 border-nust-orange relative pt-16 pb-12 overflow-hidden">

            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #E59500 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
            </div>

            <div className="container relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-8">

                    {/* Brand Vibe */}
                    <div className="max-w-md">
                        <Link href="/" className="inline-block transform hover:rotate-2 transition-transform duration-300">
                            <h2 className="font-heading text-4xl text-white drop-shadow-[2px_2px_0px_var(--nust-orange)]">
                                WHAT&apos;S UP NUST
                            </h2>
                        </Link>
                        <p className="font-display text-white/80 text-lg mt-3 leading-relaxed">
                            Your realtime guide to campus life. Find events, check crowd vibes, and never miss a moment.<br />
                            <span className="text-sm opacity-60 italic">Because FOMO is real.</span>
                        </p>
                        <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-6">
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
                    <div className="flex flex-col items-center md:items-end gap-4">
                        <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-4 rotate-1 hover:rotate-0 transition-transform cursor-default shadow-lg">
                            <p className="font-heading text-white text-xl tracking-wide">
                                BUILT BY STUDENTS 💙
                            </p>
                            <p className="font-display text-xs text-white/70 text-center mt-1">
                                For the NUST Community
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white text-nust-blue flex items-center justify-center hover:-translate-y-1 transition-transform shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                                📸
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white text-nust-blue flex items-center justify-center hover:-translate-y-1 transition-transform shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                                ✖️
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white text-nust-blue flex items-center justify-center hover:-translate-y-1 transition-transform shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                                💬
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-display text-white/40">
                    <p>© 2026 What&apos;s Up NUST. Open source & proud.</p>
                    <p>Made with ☕ at H-12 Islamabad</p>
                </div>
            </div>
        </footer>
    );
}
