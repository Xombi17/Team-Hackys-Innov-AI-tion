"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmail } from "@/lib/supabase";
import { AuroraBackground } from "@/components/ui/animated/AuroraBackground";
import { NetworkBackground } from "@/components/ui/animated/NetworkBackground";
import { Brain, Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await signInWithEmail(email, password);

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <AuroraBackground className="min-h-screen flex items-center justify-center p-4">
            <NetworkBackground />

            <div className="relative z-10 w-full max-w-md bg-slate-950/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="p-3 bg-brand-500/10 rounded-xl mb-4">
                        <Brain className="w-8 h-8 text-brand-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                    <p className="text-slate-400">Sign in to your wellness dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2.5 bg-gradient-to-r from-brand-600 to-cyan-600 hover:from-brand-500 hover:to-cyan-500 text-white font-bold rounded-lg shadow-lg hover:shadow-brand-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-400">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-brand-400 hover:text-brand-300 font-medium">
                        Sign up
                    </Link>
                </div>
            </div>
        </AuroraBackground>
    );
}
