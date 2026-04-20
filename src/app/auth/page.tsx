"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";

// ─── Google icon SVG ─────────────────────────────────────────────────────────
function GoogleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}

function AuthForm() {
    const searchParams = useSearchParams();
    const errorParam = searchParams.get("error");

    // Map raw error codes/messages to friendly display type and text
    const getErrorDisplay = (raw: string | null) => {
        if (!raw) return null;
        const msg = decodeURIComponent(raw).toLowerCase();
        if (msg.includes("access denied") || msg.includes("only @nust") || msg.includes("nust.edu.pk")) {
            return { type: "info" as const, text: "NUST/School emails (@nust.edu.pk, @seecs.edu.pk, etc.) only." };
        }
        if (msg.includes("invalid_callback") || msg.includes("invalid callback")) {
            return { type: "info" as const, text: "NUST/School emails (@nust.edu.pk, @seecs.edu.pk, etc.) only." };
        }
        return { type: "error" as const, text: decodeURIComponent(raw) };
    };

    const errorDisplay = getErrorDisplay(errorParam);

    const [loading, setLoading] = useState(false);
    const [runtimeError, setRuntimeError] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const setError = setRuntimeError; // kept for compat

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        const supabase = createClient();

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                queryParams: {
                    // Show the account picker every time (don't auto-select)
                    prompt: "select_account",
                },
            },
        });

        if (error) {
            setRuntimeError(error.message);
            setLoading(false);
        }
        // On success, Google redirects the browser — no need to handle here
    };

    return (
        <div className="min-h-screen bg-cream flex">
            {/* Left Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <Link href="/" className="flex items-center mb-10">
                        <img
                            src="/android-chrome-192x192.png"
                            alt="NUST Nama"
                            className="h-24 w-24"
                            style={{ objectFit: "contain" }}
                        />
                    </Link>

                    <h1 className="font-heading text-4xl text-nust-blue mb-2">
                        WELCOME BACK
                    </h1>
                    <p className="font-display text-nust-blue/60 mb-10">
                        Sign in with your official NUST Google account to continue.
                    </p>

                    {/* Access denied / cancelled — friendly instruction box */}
                    {errorDisplay?.type === "info" && (
                        <div className="mb-6 p-4 bg-nust-orange/10 border-2 border-nust-orange rounded-xl text-nust-blue text-sm font-display">
                            🎓 <strong>NUST accounts only.</strong> {errorDisplay.text}
                        </div>
                    )}

                    {/* Unexpected technical error */}
                    {(errorDisplay?.type === "error" || runtimeError) && (
                        <div className="mb-6 p-3 bg-red-50 border-2 border-red-300 rounded-xl text-red-600 text-xs font-display">
                            ❌ {runtimeError ?? errorDisplay?.text}
                        </div>
                    )}

                    {/* Google Sign In Button */}
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-4 py-4 px-6 rounded-xl border-2 border-nust-blue bg-white hover:bg-nust-blue/5 transition-all shadow-[4px_4px_0px_var(--nust-blue)] hover:shadow-[2px_2px_0px_var(--nust-blue)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-nust-blue/30 border-t-nust-blue rounded-full animate-spin" />
                        ) : (
                            <GoogleIcon />
                        )}
                        <span className="font-heading text-lg text-nust-blue tracking-wide">
                            {loading ? "Redirecting..." : "Continue with Google"}
                        </span>
                    </button>

                    {/* Domain restriction notice */}
                    <div className="mt-6 p-4 bg-nust-orange/10 border-2 border-nust-orange/40 rounded-xl">
                        <p className="text-sm text-nust-blue/70 font-display text-center leading-relaxed">
                            🔒 Only <strong>@nust.edu.pk</strong> and NUST school emails<br />
                            (e.g. <strong>@seecs.edu.pk</strong>) are allowed.
                        </p>
                    </div>

                    {/* Terms */}
                    <p className="text-center text-nust-blue/40 text-xs mt-8 font-display">
                        By signing in, you agree to our{" "}
                        <Link href="/terms" className="text-nust-orange hover:underline">Terms</Link>
                        {" "}and{" "}
                        <Link href="/privacy" className="text-nust-orange hover:underline">Privacy Policy</Link>.
                    </p>
                </div>
            </div>

            {/* Right Panel - Visual (Hidden on mobile) */}
            <div
                className="hidden lg:flex flex-1 items-center justify-center relative overflow-hidden"
                style={{
                    backgroundColor: "var(--nust-blue)",
                    backgroundImage: `linear-gradient(var(--nust-orange) 1px, transparent 1px), linear-gradient(90deg, var(--nust-orange) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            >
                <div className="text-center p-12 relative z-10">
                    <h2 className="text-5xl text-white mb-4 drop-shadow-[4px_4px_0px_var(--nust-orange)]">
                        NEVER MISS<br />A MOMENT
                    </h2>
                    <p className="text-white/80 text-lg max-w-md font-display">
                        Join the community of NUST students who stay connected to everything happening on campus.
                    </p>

                    {/* Floating stickers */}
                    <div className="absolute top-20 right-20 w-20 h-20 bg-nust-orange rounded-full flex items-center justify-center rotate-12 shadow-lg animate-float">
                        <span className="text-3xl">🎉</span>
                    </div>
                    <div className="absolute bottom-32 left-20 w-16 h-16 bg-white rounded-full flex items-center justify-center -rotate-6 shadow-lg animate-float" style={{ animationDelay: "0.5s" }}>
                        <span className="text-2xl">🔥</span>
                    </div>
                    <div className="absolute top-1/2 left-10 w-12 h-12 bg-nust-orange/60 rounded-full flex items-center justify-center rotate-3 shadow-lg animate-float" style={{ animationDelay: "1s" }}>
                        <span className="text-xl">🎓</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center font-heading text-nust-blue">Loading...</div>}>
            <AuthForm />
        </Suspense>
    );
}
