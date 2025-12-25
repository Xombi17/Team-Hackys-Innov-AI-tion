"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { NetworkBackground } from "@/components/ui/animated/NetworkBackground";

export function Footer() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubmitted(true);
        }
    };

    return (
        <section className="py-16 md:py-24 relative text-center overflow-hidden">
            <NetworkBackground />
            <div className="max-w-2xl mx-auto px-6 relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-glow-white">
                    Get Your First<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-purple-400">
                        Personalized Plan
                    </span>
                </h2>
                <p className="text-lg text-slate-400 mb-10 max-w-md mx-auto">
                    Join the waitlist. Be first to experience AI that truly adapts to your life.
                </p>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="flex-1 px-5 py-4 rounded-full bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                            required
                        />
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-8 py-4 bg-white text-black rounded-full font-bold transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)] inline-flex items-center justify-center gap-2"
                        >
                            Join Waitlist
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </form>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center justify-center gap-3 px-6 py-4 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 max-w-md mx-auto"
                    >
                        <Check className="w-5 h-5" />
                        <span className="font-medium">You're on the list! We'll be in touch.</span>
                    </motion.div>
                )}
            </div>

            {/* Footer Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-500/20 blur-[150px] rounded-full pointer-events-none" />

            {/* Bottom Bar */}
            <div className="mt-16 border-t border-white/5 pt-8">
                <p className="text-xs text-slate-600 font-mono">
                    WellSync AI © 2024 — Built for the future of wellness.
                </p>
            </div>
        </section>
    );
}
