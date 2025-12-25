"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Brain } from "lucide-react";

export function Header() {
    const { scrollY } = useScroll();

    // "Materializing Island" Design
    const navBg = useTransform(scrollY, [0, 50], ["rgba(2, 6, 23, 0)", "rgba(2, 6, 23, 0.8)"]);
    const navBorder = useTransform(scrollY, [0, 50], ["rgba(255,255,255,0)", "rgba(255,255,255,0.1)"]);
    const navBackdrop = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);
    const shadow = useTransform(scrollY, [0, 50], ["none", "0 25px 50px -12px rgba(0, 0, 0, 0.25)"]);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <motion.nav
            style={{
                backgroundColor: navBg,
                borderColor: navBorder,
                backdropFilter: navBackdrop,
                boxShadow: shadow,
            }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl h-16 rounded-full border border-transparent flex items-center justify-between px-6 transition-colors will-change-[background,border,backdrop-filter]"
        >
            {/* Logo - Clickable, scrolls to top */}
            <button onClick={scrollToTop} className="flex items-center gap-2 font-bold tracking-tight shrink-0 hover:opacity-80 transition-opacity">
                <Brain className="text-brand-400 w-5 h-5" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                    WellSync AI
                </span>
            </button>

            {/* Links - All page sections in order */}
            <div className="hidden lg:flex gap-4 text-sm font-medium text-slate-400">
                <button onClick={() => scrollToSection("problem")} className="hover:text-white transition-colors">
                    Problem
                </button>
                <button onClick={() => scrollToSection("architecture")} className="hover:text-white transition-colors">
                    How It Works
                </button>
                <button onClick={() => scrollToSection("simulation")} className="hover:text-white transition-colors">
                    Try It
                </button>
                <button onClick={() => scrollToSection("timeline")} className="hover:text-white transition-colors">
                    Workflow
                </button>
                <button onClick={() => scrollToSection("swarm")} className="hover:text-white transition-colors">
                    Agents
                </button>
                <button onClick={() => scrollToSection("outcomes")} className="hover:text-white transition-colors">
                    Adaptations
                </button>
                <button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors">
                    Benefits
                </button>
                <button onClick={() => scrollToSection("memory")} className="hover:text-white transition-colors">
                    Memory
                </button>
            </div>

            {/* CTA */}
            <button
                onClick={() => window.location.href = "/dashboard"}
                className="px-5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-full text-xs font-bold transition-all shadow-[0_0_20px_-5px_rgba(99,102,241,0.5)] hover:scale-105 shrink-0"
            >
                Get Started
            </button>
        </motion.nav>
    );
}
