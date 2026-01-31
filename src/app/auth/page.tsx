"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function AuthForm() {
    const searchParams = useSearchParams();
    const isSignup = searchParams.get("mode") === "signup";
    const [mode, setMode] = useState<"login" | "signup">(isSignup ? "signup" : "login");

    return (
        <div className="min-h-screen bg-cream flex">
            {/* Left Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 mb-8">
                        <div className="w-12 h-12 bg-nust-blue rounded-full border-2 border-nust-orange flex items-center justify-center shadow-[2px_2px_0px_var(--nust-orange)]">
                            <span className="font-heading text-2xl text-white">W</span>
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-heading text-2xl text-nust-blue">WHAT&apos;S UP</span>
                            <span className="font-display text-xs font-bold text-nust-orange tracking-widest">NUST</span>
                        </div>
                    </Link>

                    {/* Tabs */}
                    <div className="flex gap-2 mb-8">
                        <button
                            onClick={() => setMode("login")}
                            className={`flex-1 py-3 font-heading text-xl rounded-full border-2 transition-all ${mode === "login"
                                    ? "bg-nust-blue text-white border-nust-blue"
                                    : "bg-white text-nust-blue border-nust-blue hover:bg-nust-blue/5"
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => setMode("signup")}
                            className={`flex-1 py-3 font-heading text-xl rounded-full border-2 transition-all ${mode === "signup"
                                    ? "bg-nust-blue text-white border-nust-blue"
                                    : "bg-white text-nust-blue border-nust-blue hover:bg-nust-blue/5"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* Form */}
                    <form className="space-y-4">
                        {mode === "signup" && (
                            <div>
                                <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase tracking-wide">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ahmed Khan"
                                    className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue placeholder:text-nust-blue/40 focus:outline-none focus:ring-2 focus:ring-nust-orange"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase tracking-wide">
                                NUST Email
                            </label>
                            <input
                                type="email"
                                placeholder="bcsf21m000@nust.edu.pk"
                                className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue placeholder:text-nust-blue/40 focus:outline-none focus:ring-2 focus:ring-nust-orange"
                            />
                        </div>

                        <div>
                            <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase tracking-wide">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue placeholder:text-nust-blue/40 focus:outline-none focus:ring-2 focus:ring-nust-orange"
                            />
                        </div>

                        {mode === "signup" && (
                            <div>
                                <label className="block font-display text-sm font-bold text-nust-blue mb-2 uppercase tracking-wide">
                                    School/Department
                                </label>
                                <select className="w-full px-4 py-3 rounded-lg border-2 border-nust-blue bg-white text-nust-blue focus:outline-none focus:ring-2 focus:ring-nust-orange">
                                    <option value="">Select your school</option>
                                    <option value="seecs">SEECS</option>
                                    <option value="smme">SMME</option>
                                    <option value="scme">SCME</option>
                                    <option value="sada">SADA</option>
                                    <option value="nbs">NBS</option>
                                    <option value="s3h">S3H</option>
                                    <option value="nice">NICE</option>
                                    <option value="rcms">RCMS</option>
                                    <option value="asab">ASAB</option>
                                    <option value="sns">SNS</option>
                                    <option value="other">Other</option>
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
                            className="w-full btn bg-nust-blue text-white text-lg py-4 shadow-[4px_4px_0px_var(--nust-orange)] hover:shadow-[2px_2px_0px_var(--nust-orange)] hover:translate-y-[2px] transition-all"
                        >
                            {mode === "login" ? "Sign In" : "Create Account"}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-0.5 bg-nust-blue/20" />
                        <span className="text-nust-blue/50 text-sm">or continue with</span>
                        <div className="flex-1 h-0.5 bg-nust-blue/20" />
                    </div>

                    {/* Social Logins */}
                    <div className="flex gap-4">
                        <button className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-nust-blue rounded-lg hover:bg-nust-blue/5 transition-colors">
                            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                            <span className="font-medium text-nust-blue">Google</span>
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-nust-blue rounded-lg hover:bg-nust-blue/5 transition-colors">
                            <svg className="w-5 h-5" fill="#000" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                            <span className="font-medium text-nust-blue">GitHub</span>
                        </button>
                    </div>

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
