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
                        <p className="font-display text-white/80 text-lg mt-2">
                            Campus life. No cap. 🧢 <br />
                            <span className="text-sm opacity-60">The only intelligence platform you actually need.</span>
                        </p>
                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
                            <Link href="/events" className="text-nust-orange font-bold hover:underline decoration-2 underline-offset-4">
                                Events
                            </Link>
                            <Link href="/calendar" className="text-nust-orange font-bold hover:underline decoration-2 underline-offset-4">
                                Calendar
                            </Link>
                            <Link href="/faq" className="text-nust-orange font-bold hover:underline decoration-2 underline-offset-4">
                                FAQ
                            </Link>
                        </div>
                    </div>

                    {/* Social / Credits Vibe */}
                    <div className="flex flex-col items-center md:items-end gap-3">
                        <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-4 rotate-1 hover:rotate-0 transition-transform cursor-default">
                            <p className="font-heading text-white text-xl">
                                BUILT BY STUDENTS 💙 FOR STUDENTS
                            </p>
                            <p className="font-display text-xs text-white/60 text-center">
                                (we barely slept making this)
                            </p>
                        </div>

                        <div className="flex gap-4 mt-2">
                            <a href="#" className="w-10 h-10 rounded-full bg-nust-orange border-2 border-white flex items-center justify-center hover:-translate-y-1 transition-transform">
                                📸
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-nust-orange border-2 border-white flex items-center justify-center hover:-translate-y-1 transition-transform">
                                🐦
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-nust-orange border-2 border-white flex items-center justify-center hover:-translate-y-1 transition-transform">
                                💬
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-display text-white/40">
                    <p>© 2026 What&apos;s Up NUST. Don&apos;t copy us pls.</p>
                    <p>Made with ☕ + 💙 at H-12 Islamabad</p>
                </div>
            </div>
        </footer>
    );
}
