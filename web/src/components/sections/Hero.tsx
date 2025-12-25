"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AuroraBackground } from "@/components/ui/animated/AuroraBackground";
import { NetworkBackground } from "@/components/ui/animated/NetworkBackground";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";

export function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const subtitleRef = useRef<HTMLParagraphElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!containerRef.current) return;

            const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

            // Animate heading characters
            const headingChars = headingRef.current?.querySelectorAll(".char");
            const gradientText = headingRef.current?.querySelector(".gradient-text");

            if (headingChars) {
                gsap.set(headingChars, { y: 50, opacity: 0, filter: "blur(10px)" });
                tl.to(headingChars, {
                    y: 0,
                    opacity: 1,
                    filter: "blur(0px)",
                    duration: 0.8,
                    stagger: 0.03,
                });
            }

            if (gradientText) {
                gsap.set(gradientText, { y: 30, opacity: 0, filter: "blur(15px)" });
                tl.to(
                    gradientText,
                    {
                        y: 0,
                        opacity: 1,
                        filter: "blur(0px)",
                        duration: 1,
                    },
                    "-=0.4"
                );
            }

            // Animate subtitle
            if (subtitleRef.current) {
                gsap.set(subtitleRef.current, { y: 20, opacity: 0 });
                tl.to(
                    subtitleRef.current,
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.6,
                    },
                    "-=0.3"
                );
            }

            // Animate CTA buttons
            if (ctaRef.current) {
                const buttons = ctaRef.current.querySelectorAll("button");
                gsap.set(buttons, { y: 20, opacity: 0 });
                tl.to(
                    buttons,
                    {
                        y: 0,
                        opacity: 1,
                        duration: 0.5,
                        stagger: 0.1,
                    },
                    "-=0.2"
                );
            }

            // Scroll-triggered scale and fade
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    gsap.set(containerRef.current, {
                        scale: 1 - progress * 0.1,
                        opacity: 1 - progress * 0.5,
                    });
                },
            });
        },
        { scope: containerRef }
    );

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth" });
        }
    };

    // Split "AI That Thinks" into characters
    const titleText = "AI That Thinks";
    const titleChars = titleText.split("");

    return (
        <AuroraBackground className="min-h-screen">
            <NetworkBackground />
            <div
                ref={containerRef}
                className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto pt-20 px-6"
            >
                <div ref={headingRef} className="mb-8 flex flex-col items-center">
                    {/* Character-by-character animation */}
                    <div className="text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-white text-center pb-2">
                        {titleChars.map((char, i) => (
                            <span
                                key={i}
                                className="char inline-block"
                                style={{ display: char === " " ? "inline" : "inline-block" }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                    </div>
                    <span className="gradient-text text-6xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-purple-400 to-brand-400 animate-gradient-x text-center pb-2 text-glow">
                        Like You Do.
                    </span>
                </div>

                <p
                    ref={subtitleRef}
                    className="text-lg md:text-xl text-slate-400 max-w-xl mb-12 leading-relaxed font-medium"
                >
                    Multiple specialized intelligences negotiate your optimal wellness plan. Adapts when life changes. Learns from every decision.
                </p>

                <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                    <Link
                        href="/dashboard"
                        className="group relative px-8 py-4 bg-white text-black rounded-full text-lg font-bold hover:scale-105 transition-transform flex items-center gap-2 justify-center shadow-2xl shadow-brand-500/20 w-full sm:w-auto overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Try Dashboard <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                    <button
                        onClick={() => scrollToSection("simulation")}
                        className="px-8 py-4 border border-white/20 text-white rounded-full text-lg font-medium hover:bg-white/5 transition-all flex items-center gap-2 justify-center w-full sm:w-auto"
                    >
                        See Live Simulation
                    </button>
                </div>
            </div>

            {/* Smooth Fade to Next Section */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none z-20" />
        </AuroraBackground>
    );
}
