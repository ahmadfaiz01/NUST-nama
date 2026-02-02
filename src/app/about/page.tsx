import Link from "next/link";

export default function AboutPage() {
    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: "var(--cream)",
                backgroundImage: `linear-gradient(var(--nust-blue) 1px, transparent 1px), linear-gradient(90deg, var(--nust-blue) 1px, transparent 1px)`,
                backgroundSize: "100px 100px",
            }}
        >
            {/* Hero */}
            <section className="py-20 bg-nust-blue">
                <div className="container">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-7xl text-white mb-3 drop-shadow-[4px_4px_0px_var(--nust-orange)]">
                            ABOUT US
                        </h1>
                        <div className="mb-4">
                            <img 
                                src="/android-chrome-192x192.png" 
                                alt="NUST Nama" 
                                className="h-32 w-32 md:h-48 md:w-48 mx-auto" 
                                style={{ objectFit: "contain", boxShadow: "none", filter: "none" }}
                            />
                        </div>
                        <p className="font-display text-white/80 text-xl leading-relaxed">
                            Born out of frustration with missing events and FOMO, we built the campus intelligence platform we wished we had as students.
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="py-16 bg-white border-b-2 border-nust-blue">
                <div className="container">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-4xl md:text-5xl text-nust-blue mb-6">OUR MISSION</h2>
                            <p className="text-nust-blue/70 text-lg mb-4">
                                We believe every NUST student deserves to know what&apos;s happening on campus — from official announcements to the spontaneous cricket match at the ground.
                            </p>
                            <p className="text-nust-blue/70 text-lg">
                                What&apos;s Up NUST aggregates events from all sources, provides real-time crowd sentiment, and helps you coordinate with friends — all in one beautiful, Gen-Z friendly app.
                            </p>
                        </div>
                        <div className="bg-nust-orange/10 rounded-xl p-8 border-2 border-nust-orange shadow-[8px_8px_0px_var(--nust-blue)]">
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-nust-blue flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-heading text-xl">1</span>
                                    </div>
                                    <div>
                                        <h4 className="font-heading text-xl text-nust-blue">Discover</h4>
                                        <p className="text-nust-blue/60">Find events from all societies, schools, and official sources</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-nust-orange flex items-center justify-center flex-shrink-0">
                                        <span className="text-nust-blue font-heading text-xl">2</span>
                                    </div>
                                    <div>
                                        <h4 className="font-heading text-xl text-nust-blue">Feel the Vibe</h4>
                                        <p className="text-nust-blue/60">See real-time sentiment from people actually at events</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-full bg-nust-blue flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-heading text-xl">3</span>
                                    </div>
                                    <div>
                                        <h4 className="font-heading text-xl text-nust-blue">Squad Up</h4>
                                        <p className="text-nust-blue/60">Coordinate with friends and never show up alone</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-cream">
                <div className="container">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <div className="font-heading text-5xl md:text-6xl text-nust-blue">50+</div>
                            <div className="text-nust-blue/60 font-display uppercase tracking-widest text-sm mt-2">Events/Month</div>
                        </div>
                        <div className="text-center">
                            <div className="font-heading text-5xl md:text-6xl text-nust-orange">2.5K</div>
                            <div className="text-nust-blue/60 font-display uppercase tracking-widest text-sm mt-2">Active Users</div>
                        </div>
                        <div className="text-center">
                            <div className="font-heading text-5xl md:text-6xl text-nust-blue">15</div>
                            <div className="text-nust-blue/60 font-display uppercase tracking-widest text-sm mt-2">Schools Covered</div>
                        </div>
                        <div className="text-center">
                            <div className="font-heading text-5xl md:text-6xl text-nust-orange">Live</div>
                            <div className="text-nust-blue/60 font-display uppercase tracking-widest text-sm mt-2">Crowd Vibes</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-16 bg-white border-y-2 border-nust-blue">
                <div className="container">
                    <h2 className="text-4xl md:text-5xl text-nust-blue mb-12 text-center">THE TEAM</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[
                            { name: "Student Developer", role: "Founder & Lead", emoji: "👨‍💻" },
                            { name: "Design Enthusiast", role: "UI/UX Lead", emoji: "🎨" },
                            { name: "Backend Wizard", role: "Infrastructure", emoji: "⚙️" },
                        ].map((member) => (
                            <div key={member.name} className="text-center">
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-nust-blue/10 border-2 border-nust-blue flex items-center justify-center text-4xl shadow-[4px_4px_0px_var(--nust-orange)]">
                                    {member.emoji}
                                </div>
                                <h4 className="font-heading text-xl text-nust-blue">{member.name}</h4>
                                <p className="text-nust-blue/60 text-sm">{member.role}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-center mt-12 text-nust-blue/60">
                        Built with 💙 by NUST students, for NUST students.
                    </p>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-16 bg-nust-orange">
                <div className="container text-center">
                    <h2 className="text-4xl md:text-5xl text-nust-blue mb-4">WANT TO CONTRIBUTE?</h2>
                    <p className="text-nust-blue/80 mb-8 max-w-xl mx-auto">
                        We&apos;re always looking for passionate students to help improve the platform. Whether you&apos;re a developer, designer, or just have great ideas — reach out!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="mailto:hello@whatsupnust.com" className="btn bg-nust-blue text-white text-lg px-8 py-4 shadow-[4px_4px_0px_rgba(0,0,0,0.2)]">
                            Contact Us
                        </Link>
                        <Link href="https://github.com" className="btn border-2 border-nust-blue text-nust-blue text-lg px-8 py-4 bg-white hover:bg-nust-blue hover:text-white transition-all">
                            GitHub
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
