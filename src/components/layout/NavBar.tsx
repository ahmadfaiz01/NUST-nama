"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export function NavBar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkUserStatus = useCallback(async () => {
        try {
            const supabase = createClient();
            const { data: { user }, error } = await supabase.auth.getUser();
            
            if (error || !user) {
                setIsLoggedIn(false);
                setIsAdmin(false);
                setIsLoading(false);
                return;
            }

            setIsLoggedIn(true);
            
            // Check admin status
            const { data: profile } = await supabase
                .from("profiles")
                .select("role")
                .eq("id", user.id)
                .single();
            
            if (profile && ["admin", "moderator"].includes(profile.role)) {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        } catch (err) {
            console.error("Auth check error:", err);
            setIsLoggedIn(false);
            setIsAdmin(false);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const supabase = createClient();
        
        // Check initial status
        checkUserStatus();

        // Subscribe to auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
                checkUserStatus();
            } else if (event === 'SIGNED_OUT') {
                setIsLoggedIn(false);
                setIsAdmin(false);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [checkUserStatus]);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const supabase = createClient();
            await supabase.auth.signOut({ scope: 'global' });
            setIsLoggedIn(false);
            setIsAdmin(false);
            // Force a hard reload to clear all state
            window.location.href = "/";
        } catch (error) {
            console.error("Logout error:", error);
            setIsLoggingOut(false);
        }
    };

    const navLinks = [
        { href: "/events", label: "Events" },
        { href: "/calendar", label: "Calendar" },
        { href: "/news", label: "News" },
        { href: "/chatter", label: "Gupshup" },
        { href: "/about", label: "About" },
    ];

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-nust-blue border-b-2 border-nust-orange py-2">
            <nav className="container flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center group">
                    <img 
                        src="/android-chrome-192x192.png" 
                        alt="NUST Nama" 
                        className="h-40 w-40 min-h-[160px] min-w-[160px] max-h-[200px] max-w-[200px] transform group-hover:scale-105 transition-transform"
                        style={{ objectFit: "contain" }}
                    />
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

                    {/* Admin Link - Only visible for admins/moderators */}
                    {isAdmin && (
                        <Link
                            href="/admin"
                            className="font-heading text-lg text-nust-orange hover:text-white transition-colors uppercase tracking-wide flex items-center gap-1"
                        >
                            <span>👮</span> Admin
                        </Link>
                    )}

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
                    {isLoading ? (
                        <div className="w-20 h-10 bg-white/10 rounded animate-pulse"></div>
                    ) : isLoggedIn ? (
                        <>
                            <Link
                                href="/profile"
                                className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-white/50 text-white hover:bg-white hover:text-nust-blue transition-all"
                                aria-label="Profile"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </Link>
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="btn bg-white/10 border-2 border-white/50 text-white font-bold text-sm py-2 px-4 hover:bg-white hover:text-nust-blue transition-all disabled:opacity-50"
                            >
                                {isLoggingOut ? "..." : "Logout"}
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/auth?mode=signup"
                            className="btn bg-white text-nust-blue font-bold text-base py-2 px-6 shadow-[4px_4px_0px_var(--nust-orange)] hover:shadow-[2px_2px_0px_var(--nust-orange)] hover:translate-y-[2px] transition-all"
                        >
                            Get Started
                        </Link>
                    )}
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
                        {/* Admin Link for Mobile */}
                        {isAdmin && (
                            <Link
                                href="/admin"
                                className="font-heading text-xl text-nust-orange text-center py-2 flex items-center justify-center gap-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                👮 Admin Dashboard
                            </Link>
                        )}
                        <Link
                            href="/post-event"
                            className="font-heading text-xl text-nust-orange text-center py-2"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            + Post Event
                        </Link>
                        <div className="flex flex-col gap-3 mt-2">
                            {isLoading ? (
                                <div className="w-full h-12 bg-white/10 rounded animate-pulse"></div>
                            ) : isLoggedIn ? (
                                <>
                                    <Link
                                        href="/profile"
                                        className="btn border-2 border-white text-white w-full justify-center hover:bg-white hover:text-nust-blue"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        My Profile
                                    </Link>
                                    <button
                                        onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                        disabled={isLoggingOut}
                                        className="btn bg-red-500 text-white w-full justify-center hover:bg-red-600 disabled:opacity-50"
                                    >
                                        {isLoggingOut ? "Logging out..." : "Logout"}
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/auth?mode=signup"
                                    className="btn bg-nust-orange text-nust-blue w-full justify-center"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
