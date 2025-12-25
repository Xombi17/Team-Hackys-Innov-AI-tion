"use client";

import { useRef } from "react";
import { GiMuscleUp, GiMeal, GiNightSleep, GiMeditation, GiCircuitry } from "react-icons/gi";
import { cn } from "@/lib/utils";
import { useGSAP, gsap } from "@/lib/gsap";
import { NetworkBackground } from "@/components/ui/animated/NetworkBackground";
import { AnimatedGradient } from "@/components/ui/animated/AnimatedGradient";

const agents = [
    {
        name: "Fitness Agent",
        tagline: "Knows when to push, when to rest",
        description: "Monitors your workout capacity, fatigue levels, and recovery status to optimize training intensity.",
        example: "Skipped sleep? I'm switching your HIIT to yoga.",
        icon: GiMuscleUp,
        color: "#3b82f6",
        bgGradient: "from-blue-500/10 to-cyan-500/5",
        borderColor: "border-blue-500/30",
    },
    {
        name: "Nutrition Agent",
        tagline: "Fuel that fits your reality",
        description: "Tracks your eating patterns, macros, and metabolic needs to craft personalized meal plans.",
        example: "Missed lunch? Dinner just got upgraded.",
        icon: GiMeal,
        color: "#22c55e",
        bgGradient: "from-green-500/10 to-emerald-500/5",
        borderColor: "border-green-500/30",
    },
    {
        name: "Sleep Agent",
        tagline: "Recovery is non-negotiable",
        description: "Analyzes HRV, sleep quality, and circadian rhythm to ensure optimal recovery cycles.",
        example: "HRV tanked. All agents are prioritizing rest.",
        icon: GiNightSleep,
        color: "#8b5cf6",
        bgGradient: "from-violet-500/10 to-purple-500/5",
        borderColor: "border-violet-500/30",
    },
    {
        name: "Mental Agent",
        tagline: "Prevents burnout before it hits",
        description: "Monitors stress levels, cognitive load, and emotional state to protect your mental health.",
        example: "Big meeting tomorrow. Light workout today.",
        icon: GiMeditation,
        color: "#ec4899",
        bgGradient: "from-pink-500/10 to-rose-500/5",
        borderColor: "border-pink-500/30",
    },
];

export function Swarm() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const cardsContainerRef = useRef<HTMLDivElement>(null);
    const coordinatorRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!sectionRef.current) return;

            // Header scroll-triggered reveal
            if (headerRef.current) {
                const headerElements = headerRef.current.querySelectorAll(".header-element");
                gsap.set(headerElements, { y: 40, opacity: 0 });

                gsap.to(headerElements, {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headerRef.current,
                        start: "top 80%",
                        end: "top 50%",
                        scrub: 0.5,
                    },
                });
            }

            // Agent cards with scroll-scrub stagger
            if (cardsContainerRef.current) {
                const cards = cardsContainerRef.current.querySelectorAll(".agent-card");

                gsap.set(cards, {
                    y: 80,
                    opacity: 0,
                    scale: 0.9,
                });

                gsap.to(cards, {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1,
                    stagger: 0.15,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: cardsContainerRef.current,
                        start: "top 80%",
                        end: "top 30%",
                        scrub: 0.8,
                    },
                });

                // Hover effects (non-scrub)
                cards.forEach((card) => {
                    card.addEventListener("mouseenter", () => {
                        gsap.to(card, {
                            scale: 1.03,
                            y: -8,
                            duration: 0.3,
                            ease: "power2.out",
                        });
                    });
                    card.addEventListener("mouseleave", () => {
                        gsap.to(card, {
                            scale: 1,
                            y: 0,
                            duration: 0.3,
                            ease: "power2.out",
                        });
                    });
                });
            }

            // Coordinator with emphasis entrance
            if (coordinatorRef.current) {
                gsap.set(coordinatorRef.current, {
                    y: 60,
                    opacity: 0,
                    scale: 0.95,
                });

                gsap.to(coordinatorRef.current, {
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    ease: "back.out(1.2)",
                    scrollTrigger: {
                        trigger: coordinatorRef.current,
                        start: "top 85%",
                        end: "top 60%",
                        scrub: 0.5,
                    },
                });
            }
        },
        { scope: sectionRef }
    );

    return (
        <section ref={sectionRef} id="swarm" className="py-20 md:py-28 relative overflow-hidden bg-slate-950">
            {/* Background gradient */}
            <NetworkBackground />
            <AnimatedGradient variant="brand" />

            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-500/[0.02] to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-grid-white/[0.015] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-6">
                {/* Header */}
                <div ref={headerRef} className="text-center mb-16">
                    <span className="header-element inline-block px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-mono mb-4">
                        THE SWARM
                    </span>
                    <h2 className="header-element text-4xl md:text-6xl font-bold mb-5 text-depth-subtle">
                        Meet The Agents
                    </h2>
                    <p className="header-element text-slate-400 max-w-xl mx-auto text-lg">
                        Four specialized intelligences. One unified goal: Your optimal state.
                    </p>
                </div>

                {/* Agent Cards - 2x2 Grid */}
                <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {agents.map((agent, i) => (
                        <div
                            key={i}
                            className={cn(
                                "agent-card group relative rounded-2xl border p-6 transition-all duration-300 cursor-pointer",
                                "bg-gradient-to-br backdrop-blur-sm",
                                agent.bgGradient,
                                agent.borderColor,
                                "hover:border-opacity-60"
                            )}
                            style={{
                                boxShadow: `0 0 0 1px ${agent.color}10`,
                            }}
                        >
                            {/* Glow effect on hover */}
                            <div
                                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                    background: `radial-gradient(circle at 50% 0%, ${agent.color}15, transparent 70%)`,
                                }}
                            />

                            <div className="relative z-10">
                                {/* Icon & Name */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center"
                                        style={{
                                            backgroundColor: `${agent.color}15`,
                                            border: `1px solid ${agent.color}40`,
                                        }}
                                    >
                                        <agent.icon className="w-7 h-7" style={{ color: agent.color }} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">{agent.name}</h3>
                                        <p className="text-xs text-slate-500">{agent.tagline}</p>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-sm text-slate-400 mb-4 leading-relaxed">
                                    {agent.description}
                                </p>

                                {/* Example Quote */}
                                <div
                                    className="flex items-start gap-2 p-3 rounded-lg"
                                    style={{ backgroundColor: `${agent.color}08` }}
                                >
                                    <span className="text-xs" style={{ color: agent.color }}>→</span>
                                    <p className="text-sm italic" style={{ color: agent.color }}>
                                        "{agent.example}"
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Coordinator - Full Width */}
                <div
                    ref={coordinatorRef}
                    className="relative rounded-2xl border border-brand-500/30 p-8 bg-gradient-to-br from-brand-500/10 via-purple-500/5 to-transparent backdrop-blur-sm overflow-hidden"
                >
                    {/* Animated gradient background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 via-transparent to-purple-500/5 animate-gradient-x" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-purple-500 flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/20">
                            <GiCircuitry className="w-10 h-10 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-white mb-2">The Coordinator</h3>
                            <p className="text-slate-400 max-w-2xl leading-relaxed">
                                The orchestrator. Receives real-time input from all four agents, weighs trade-offs,
                                resolves conflicts, and outputs one unified plan that balances your goals with your reality.
                                <span className="text-brand-400 font-medium"> No contradictions. Just clarity.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
