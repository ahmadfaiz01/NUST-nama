"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/client";

function AuthForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isSignup = searchParams.get("mode") === "signup";
    const errorParam = searchParams.get("error");

    const [mode, setMode] = useState<"login" | "signup">(isSignup ? "signup" : "login");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(
        errorParam ? decodeURIComponent(errorParam) : null
    );
    const [success, setSuccess] = useState<string | null>(null);

    // Form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [school, setSchool] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // Admin emails that bypass NUST email check
    const ADMIN_EMAILS = [
        "itsahmadfaiz@gmail.com",
        "rameenarshad0121@gmail.com"
    ];

    const isAdminEmail = (email: string) => {
        return ADMIN_EMAILS.includes(email.toLowerCase().trim());
    };

    const isValidNustEmail = (email: string) => {
        // Allow admin emails to bypass the check
        if (isAdminEmail(email)) return true;
        return email.endsWith(".nust.edu.pk") || email.endsWith("@nust.edu.pk") || email.endsWith("@seecs.edu.pk") || email.endsWith(".seecs.edu.pk");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Validate NUST email
        if (mode === "signup" && !isValidNustEmail(email)) {
            setError("Please use your official NUST or SEECS email (e.g., xyz.bscs23seecs@seecs.edu.pk)");
            return;
        }

        setLoading(true);
        const supabase = createClient();

        try {
            if (mode === "signup") {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            full_name: name,
                            school: school,
                        },
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });

                if (error) throw error;

                setSuccess("🎉 Check your email! We've sent a confirmation link to verify your account.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    if (error.message.includes("Email not confirmed")) {
                        throw new Error("Please verify your email first. Check your inbox for the confirmation link.");
                    }
                    throw error;
                }

                // Force hard redirect to home on successful login (faster and more reliable)
                window.location.href = "/";
                return;
            }
        } catch (err: any) {
            setError(err.message || "An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-cream flex">
            {/* Left Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <Link href="/" className="flex items-center mb-8">
                        <img 
                            src="/android-chrome-192x192.png" 
                            alt="NUST Nama" 
                            className="h-24 w-24 min-h-[96px] min-w-[96px] max-h-[128px] max-w-[128px]" 
                            style={{ objectFit: "contain" }}
                        />
                    </Link>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-8">
                        <button
                            onClick={() => { setMode("login"); setError(null); setSuccess(null); }}
                            className={`flex-1 py-3 font-heading text-xl rounded-full border-2 transition-all ${mode === "login"
                                ? "bg-nust-blue text-white border-nust-blue"
                                : "bg-white text-nust-blue border-nust-blue hover:bg-nust-blue/5"
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => { setMode("signup"); setError(null); setSuccess(null); }}
                            className={`flex-1 py-3 font-heading text-xl rounded-full border-2 transition-all ${mode === "signup"
                                ? "bg-nust-blue text-white border-nust-blue"
                                : "bg-white text-nust-blue border-nust-blue hover:bg-nust-blue/5"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border-2 border-red-400 rounded-lg text-red-700 text-sm">
                            ❌ {error}
                        </div>
                    )}

                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-100 border-2 border-green-400 rounded-lg text-green-700 text-sm">
                            {success}
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {mode === "signup" && (
                            <div>
                                <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase tracking-wide">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Ahmed Khan"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue placeholder:text-nust-blue/40 focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase tracking-wide">
                                NUST Email
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="xyz.bscs23seecs@seecs.edu.pk"
                                required
                                className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue placeholder:text-nust-blue/40 focus:outline-none focus:ring-2 focus:ring-nust-orange"
                            />
                            {mode === "signup" && (
                                <p className="text-xs text-nust-blue/60 mt-1">
                                    Only <strong>@*.nust.edu.pk</strong> and <strong>@seecs.edu.pk</strong> allowed.
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase tracking-wide">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 pr-12 rounded-lg border-2 border-nust-blue bg-white text-nust-blue placeholder:text-nust-blue/40 focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-nust-blue/60 hover:text-nust-blue transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {mode === "signup" && (
                            <div>
                                <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase tracking-wide">
                                    School/Department
                                </label>
                                <select
                                    value={school}
                                    onChange={(e) => setSchool(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                >
                                    <option value="">Select your school</option>
                                    <option value="SEECS">SEECS</option>
                                    <option value="SMME">SMME</option>
                                    <option value="SCME">SCME</option>
                                    <option value="SADA">SADA</option>
                                    <option value="NBS">NBS</option>
                                    <option value="S3H">S3H</option>
                                    <option value="NICE">NICE</option>
                                    <option value="RCMS">RCMS</option>
                                    <option value="ASAB">ASAB</option>
                                    <option value="SNS">SNS</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        )}

                        {mode === "login" && (
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 rounded border-nust-blue" />
                                    <span className="text-sm text-nust-blue/70">Remember me</span>
                                </label>
                                <Link href="/auth/forgot" className="text-sm text-nust-orange hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn bg-nust-blue text-white text-lg py-4 shadow-[4px_4px_0px_var(--nust-orange)] hover:shadow-[2px_2px_0px_var(--nust-orange)] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
                        </button>
                    </form>

                    {/* Email confirmation notice */}
                    {mode === "signup" && !success && (
                        <div className="mt-6 p-4 bg-nust-orange/10 border-2 border-nust-orange rounded-lg">
                            <p className="text-sm text-nust-blue text-center">
                                📧 <strong>You&apos;ll receive a confirmation email</strong> to verify your NUST address before logging in.
                            </p>
                        </div>
                    )}

                    {/* Terms */}
                    {mode === "signup" && (
                        <p className="text-center text-nust-blue/50 text-sm mt-6">
                            By creating an account, you agree to our{" "}
                            <Link href="/terms" className="text-nust-orange hover:underline">Terms</Link>
                            {" "}and{" "}
                            <Link href="/privacy" className="text-nust-orange hover:underline">Privacy Policy</Link>
                        </p>
                    )}
                </div>
            </div>

            {/* Right Panel - Visual (Hidden on mobile) */}
            <div
                className="hidden lg:flex flex-1 items-center justify-center relative"
                style={{
                    backgroundColor: "var(--nust-blue)",
                    backgroundImage: `linear-gradient(var(--nust-orange) 1px, transparent 1px), linear-gradient(90deg, var(--nust-orange) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            >
                <div className="text-center p-12">
                    <h2 className="text-5xl text-white mb-4 drop-shadow-[4px_4px_0px_var(--nust-orange)]">
                        NEVER MISS<br />A MOMENT
                    </h2>
                    <p className="text-white/80 text-lg max-w-md">
                        Join the community of NUST students who stay connected to everything happening on campus.
                    </p>

                    {/* Floating stickers */}
                    <div className="absolute top-20 right-20 w-20 h-20 bg-nust-orange rounded-full flex items-center justify-center rotate-12 shadow-lg animate-float">
                        <span className="text-3xl">🎉</span>
                    </div>
                    <div className="absolute bottom-32 left-20 w-16 h-16 bg-white rounded-full flex items-center justify-center -rotate-6 shadow-lg animate-float" style={{ animationDelay: "0.5s" }}>
                        <span className="text-2xl">🔥</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center">Loading...</div>}>
            <AuthForm />
        </Suspense>
    );
}
