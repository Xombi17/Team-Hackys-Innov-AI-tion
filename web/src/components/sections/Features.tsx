"use client";

import { useRef } from "react";
import { TbRefresh, TbBrain, TbShieldCheck, TbClock, TbSparkles, TbTargetArrow } from "react-icons/tb";
import { cn } from "@/lib/utils";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { useGSAP, gsap } from "@/lib/gsap";
import { NetworkBackground } from "@/components/ui/animated/NetworkBackground";
import { AnimatedGradient } from "@/components/ui/animated/AnimatedGradient";

const features = [
    {
        title: "Adapts in Real-Time",
        description: "Plans adjust the moment your context changes — missed meal, poor sleep, or schedule shift.",
        icon: TbRefresh,
        spotlightColor: "rgba(99, 102, 241, 0.15)" as const,
    },
    {
        title: "Learns Your Patterns",
        description: "Remembers what works for you and refines recommendations based on past outcomes.",
        icon: TbBrain,
        spotlightColor: "rgba(168, 85, 247, 0.15)" as const,
    },
    {
        title: "No Conflicts",
        description: "Agents negotiate so your workout doesn't fight your diet or your sleep schedule.",
        icon: TbShieldCheck,
        spotlightColor: "rgba(34, 197, 94, 0.15)" as const,
    },
    {
        title: "Sub-Minute Decisions",
        description: "From input to personalized plan in under 60 seconds. Always ready when you are.",
        icon: TbClock,
        spotlightColor: "rgba(59, 130, 246, 0.15)" as const,
    },
    {
        title: "Reasons, Not Rules",
        description: "No rigid schedules. The system thinks through trade-offs like a coach would.",
        icon: TbSparkles,
        spotlightColor: "rgba(236, 72, 153, 0.15)" as const,
    },
    {
        title: "One Unified Plan",
        description: "Four agents, one output. No conflicting advice from different apps.",
        icon: TbTargetArrow,
        spotlightColor: "rgba(251, 146, 60, 0.15)" as const,
    },
];

export function Features() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!sectionRef.current) return;

            // Header animation
            if (headerRef.current) {
                gsap.from(headerRef.current.children, {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: headerRef.current,
                        start: "top 85%",
                    },
                });
            }

            // Feature cards with stagger
            if (gridRef.current) {
                const cards = gridRef.current.querySelectorAll(".feature-card");
                const icons = gridRef.current.querySelectorAll(".feature-icon");

                // Cards entrance
                gsap.from(cards, {
                    y: 60,
                    opacity: 0,
                    duration: 0.7,
                    stagger: {
                        each: 0.08,
                        grid: [2, 3],
                        from: "start",
                    },
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: "top 80%",
                    },
                });

                // Icons rotate on scroll
                icons.forEach((icon, i) => {
                    gsap.to(icon, {
                        rotation: 360,
                        duration: 20 + i * 2,
                        repeat: -1,
                        ease: "none",
                    });
                });

                // Hover effects
                cards.forEach((card) => {
                    const icon = card.querySelector(".feature-icon");

                    card.addEventListener("mouseenter", () => {
                        gsap.to(card, {
                            y: -8,
                            scale: 1.02,
                            duration: 0.3,
                            ease: "power2.out",
                        });
                        if (icon) {
                            gsap.to(icon, {
                                scale: 1.2,
                                rotation: "+=15",
                                duration: 0.3,
                                ease: "back.out(2)",
                            });
                        }
                    });

                    card.addEventListener("mouseleave", () => {
                        gsap.to(card, {
                            y: 0,
                            scale: 1,
                            duration: 0.3,
                            ease: "power2.out",
                        });
                        if (icon) {
                            gsap.to(icon, {
                                scale: 1,
                                duration: 0.3,
                                ease: "power2.out",
                            });
                        }
                    });
                });
            }
        },
        { scope: sectionRef }
    );

    return (
        <section ref={sectionRef} id="features" className="py-12 md:py-16 bg-slate-950 relative overflow-hidden">
            <NetworkBackground />
            <AnimatedGradient variant="mixed" />

            <div className="absolute inset-0 bg-grid-white/[0.015] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div ref={headerRef} className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-depth-subtle">
                        Why WellSync?
                    </h2>
                    <p className="text-slate-400 max-w-lg mx-auto">
                        What makes agentic coordination different from static apps.
                    </p>
                </div>

                {/* Feature Grid */}
                <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {features.map((feature, i) => (
                        <div key={i} className="feature-card">
                            <SpotlightCard
                                spotlightColor={feature.spotlightColor}
                                className="h-full"
                            >
                                <div className="relative z-10">
                                    <div className="feature-icon w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                                        <feature.icon className="w-5 h-5 text-white" />
                                    </div>
                                    <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
                                </div>
                            </SpotlightCard>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
