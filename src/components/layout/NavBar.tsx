"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function NavBar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { href: "/events", label: "Events" },
        { href: "/news", label: "News" },
        { href: "/about", label: "About" },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? "glass shadow-lg"
                    : "bg-transparent"
                }`}
        >
            <nav className="container flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nust-blue to-ceramic flex items-center justify-center">
                            <span className="font-heading text-xl text-white">W</span>
                        </div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-nust-orange rounded-full animate-pulse-glow" />
                    </div>
                    <div className="hidden sm:block">
                        <span className="font-heading text-xl text-foreground group-hover:text-primary transition-colors">
                            WHAT&apos;S UP
                        </span>
                        <span className="font-heading text-xl text-nust-orange ml-1">
                            NUST
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="font-display text-sm font-medium text-foreground-muted hover:text-primary uppercase tracking-wide transition-colors relative group"
                        >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-nust-orange transition-all duration-300 group-hover:w-full" />
                        </Link>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    <Link
                        href="/auth"
                        className="btn btn-outline text-sm py-2 px-4"
                    >
                        Sign In
                    </Link>
                    <Link
                        href="/auth?mode=signup"
                        className="btn btn-primary text-sm py-2 px-4"
                    >
                        Get Started
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg hover:bg-card transition-colors"
                    aria-label="Toggle menu"
                >
                    <div className="w-6 h-5 relative flex flex-col justify-between">
                        <span
                            className={`w-full h-0.5 bg-foreground transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                                }`}
                        />
                        <span
                            className={`w-full h-0.5 bg-foreground transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""
                                }`}
                        />
                        <span
                            className={`w-full h-0.5 bg-foreground transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                                }`}
                        />
                    </div>
                </button>
            </nav>

            {/* Mobile Menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-64" : "max-h-0"
                    }`}
            >
                <div className="container py-4 space-y-4 glass">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="block font-display text-sm font-medium text-foreground-muted hover:text-primary uppercase tracking-wide transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flex gap-3 pt-2">
                        <Link
                            href="/auth"
                            className="btn btn-outline text-sm py-2 px-4 flex-1 text-center"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/auth?mode=signup"
                            className="btn btn-primary text-sm py-2 px-4 flex-1 text-center"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
