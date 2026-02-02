"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import AdminNotifications from "@/components/admin/AdminNotifications";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const sidebarLinks = [
    { href: "/admin", label: "Dashboard", icon: "📊" },
    { href: "/admin/events", label: "Events", icon: "📅" },
    { href: "/admin/users", label: "Users", icon: "👥" },
    { href: "/admin/gupshup", label: "Gupshup Requests", icon: "💬" },
    { href: "/admin/stats", label: "Stats", icon: "📈" },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(true); // Default open on desktop
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // For desktop collapse
    const [userName, setUserName] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string>("");

    useEffect(() => {
        const checkAdminAccess = async () => {
            const supabase = createClient();

            // Check if user is logged in
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) {
                router.push("/auth?redirect=/admin");
                return;
            }

            // Check if user has admin role
            const { data: profile, error: profileError } = await supabase
                .from("profiles")
                .select("role, name")
                .eq("id", user.id)
                .single();

            if (profileError || !profile || !["admin", "moderator"].includes(profile.role)) {
                // Redirect non-admins to home
                router.push("/?error=unauthorized");
                return;
            }

            setUserName(profile.name || "Admin");
            setUserEmail(user.email || "");
            setIsAuthorized(true);
            setLoading(false);
        };

        checkAdminAccess();
    }, [router]);

    const handleLogout = async () => {
        try {
            const supabase = createClient();
            await supabase.auth.signOut();
            // Force a hard reload to clear all state
            window.location.href = "/";
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-nust-blue mx-auto mb-4"></div>
                    <p className="font-heading text-xl text-nust-blue">Verifying Access...</p>
                </div>
            </div>
        );
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile Menu Button - only visible when sidebar is closed on mobile */}
            {!sidebarOpen && (
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden fixed top-28 left-4 z-50 bg-nust-blue text-white p-2 rounded-lg shadow-lg"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            )}

            {/* Desktop Expand Button - only visible when sidebar is collapsed */}
            {sidebarCollapsed && (
                <button
                    onClick={() => setSidebarCollapsed(false)}
                    className="hidden lg:flex fixed top-28 left-4 z-50 bg-nust-blue text-white p-2 rounded-lg shadow-lg"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            )}

            {/* Sidebar */}
            <aside className={`
                fixed left-0 top-24 bottom-0 bg-nust-blue text-white z-40
                transform transition-all duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                ${sidebarCollapsed ? 'lg:w-0 lg:-translate-x-full' : 'lg:w-64 lg:translate-x-0'}
                w-64
            `}>
                {/* Admin Header */}
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-nust-orange rounded-lg flex items-center justify-center">
                                <span className="text-xl">👮</span>
                            </div>
                            <div>
                                <h2 className="font-heading text-xl">ADMIN</h2>
                                <p className="text-white/60 text-xs">Control Panel</p>
                            </div>
                        </div>
                        {/* Notifications & Close/Collapse buttons */}
                        <div className="flex items-center gap-1">
                            {/* Notifications Bell */}
                            <AdminNotifications />
                            {/* Mobile close button */}
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            {/* Desktop collapse button */}
                            <button
                                onClick={() => setSidebarCollapsed(true)}
                                className="hidden lg:flex p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Collapse sidebar"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href || 
                            (link.href !== "/admin" && pathname.startsWith(link.href));
                        
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                                    ${isActive 
                                        ? 'bg-white text-nust-blue font-bold shadow-md' 
                                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                                    }
                                `}
                            >
                                <span className="text-xl">{link.icon}</span>
                                <span className="font-display">{link.label}</span>
                                {isActive && (
                                    <span className="ml-auto w-2 h-2 bg-nust-orange rounded-full"></span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 space-y-2">
                    {/* Admin Info */}
                    <div className="px-4 py-2 bg-white/5 rounded-lg">
                        <p className="text-white text-sm font-bold truncate">{userName}</p>
                        <p className="text-white/50 text-xs truncate">{userEmail}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-nust-orange text-white text-xs font-bold rounded-full">
                            ADMIN
                        </span>
                    </div>
                    
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-4 py-2 text-white/60 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="font-display text-sm">Back to Site</span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 w-full text-red-300 hover:text-red-100 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="font-display text-sm font-bold">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`min-h-screen transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-64'}`}>
                {/* Backdrop for mobile */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
                
                {children}
            </main>
        </div>
    );
}
