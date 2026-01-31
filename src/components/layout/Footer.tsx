import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-nust-blue border-t-4 border-nust-orange">
            <div className="container py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="inline-block mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-nust-orange rounded-full border-2 border-white flex items-center justify-center">
                                    <span className="font-heading text-xl text-nust-blue">W</span>
                                </div>
                                <span className="font-heading text-2xl text-white">WHAT&apos;S UP NUST</span>
                            </div>
                        </Link>
                        <p className="font-display text-white/70 text-sm max-w-sm mb-4">
                            Your campus intelligence platform. Real-time events, crowd vibes, and everything happening at NUST.
                        </p>
                        <div className="flex items-center gap-2 text-white/80">
                            <span className="text-2xl">💙</span>
                            <span className="font-display text-sm">Built by students, for students</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-heading text-lg text-nust-orange mb-4">QUICK LINKS</h3>
                        <nav className="space-y-2">
                            <Link href="/events" className="block font-display text-sm text-white/70 hover:text-white transition-colors">
                                Events
                            </Link>
                            <Link href="/calendar" className="block font-display text-sm text-white/70 hover:text-white transition-colors">
                                Calendar
                            </Link>
                            <Link href="/news" className="block font-display text-sm text-white/70 hover:text-white transition-colors">
                                News
                            </Link>
                            <Link href="/post-event" className="block font-display text-sm text-white/70 hover:text-white transition-colors">
                                Post Event
                            </Link>
                        </nav>
                    </div>

                    {/* Help */}
                    <div>
                        <h3 className="font-heading text-lg text-nust-orange mb-4">HELP</h3>
                        <nav className="space-y-2">
                            <Link href="/faq" className="block font-display text-sm text-white/70 hover:text-white transition-colors">
                                FAQ
                            </Link>
                            <Link href="/about" className="block font-display text-sm text-white/70 hover:text-white transition-colors">
                                About Us
                            </Link>
                            <Link href="mailto:support@whatsupnust.com" className="block font-display text-sm text-white/70 hover:text-white transition-colors">
                                Contact
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="font-display text-xs text-white/50">
                        © 2026 What&apos;s Up NUST. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="font-display text-xs text-white/50">Made with 💙 at NUST H-12</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
