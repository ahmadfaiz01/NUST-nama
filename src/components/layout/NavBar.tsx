"use client";

import Link from "next/link";
import { useState } from "react";

export function NavBar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { href: "/events", label: "Events" },
        { href: "/calendar", label: "Calendar" },
        { href: "/news", label: "News" },
        { href: "/about", label: "About" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-nust-blue border-b-2 border-nust-orange py-2">
            <nav className="container flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-1 group">
                    <div className="relative transform group-hover:rotate-12 transition-transform">
                        <div className="w-10 h-10 bg-cream rounded-full border-2 border-nust-orange flex items-center justify-center shadow-[2px_2px_0px_var(--nust-orange)]">
                            <span className="font-heading text-xl text-nust-blue">W</span>
                        </div>
                    </div>
                    <div className="flex flex-col leading-none ml-1">
                        <span className="font-heading text-2xl text-white tracking-wider">
                            WHAT&apos;S UP
                        </span>
                        <span className="font-display text-xs font-bold text-nust-orange tracking-widest uppercase">
                            NUST
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="font-heading text-lg text-white/80 hover:text-nust-orange transition-colors uppercase tracking-wide"
                        >
                            {link.label}
                        </Link>
                    ))}

                    {/* Post Event Button */}
                    <Link
                        href="/post-event"
                        className="btn bg-nust-orange text-nust-blue font-bold text-sm py-2 px-4 shadow-[2px_2px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-y-[2px] transition-all flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Post Event
                    </Link>
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        href="/profile"
                        className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-white/50 text-white hover:bg-white hover:text-nust-blue transition-all"
                        aria-label="Profile"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </Link>
                    <Link
                        href="/auth?mode=signup"
                        className="btn bg-white text-nust-blue font-bold text-base py-2 px-6 shadow-[4px_4px_0px_var(--nust-orange)] hover:shadow-[2px_2px_0px_var(--nust-orange)] hover:translate-y-[2px] transition-all"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 text-white"
                    aria-label="Toggle menu"
                >
                    <div className="space-y-1.5">
                        <span className={`block w-8 h-0.5 bg-current transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                        <span className={`block w-8 h-0.5 bg-current transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                        <span className={`block w-8 h-0.5 bg-current transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                    </div>
                </button>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-nust-blue-dark border-b-2 border-nust-orange p-4 shadow-lg md:hidden">
                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="font-heading text-xl text-white text-center py-2 hover:text-nust-orange transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <Link
                            href="/post-event"
                            className="font-heading text-xl text-nust-orange text-center py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            + Post Event
                        </Link>
                        <div className="flex flex-col gap-3 mt-2">
                            <Link
                                href="/profile"
                                className="btn border-2 border-white text-white w-full justify-center hover:bg-white hover:text-nust-blue"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                My Profile
                            </Link>
                            <Link
                                href="/auth?mode=signup"
                                className="btn bg-nust-orange text-nust-blue w-full justify-center"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
