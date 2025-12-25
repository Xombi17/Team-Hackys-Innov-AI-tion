"use client";

import { useRef } from "react";
import { useGSAP, gsap, ScrollTrigger } from "@/lib/gsap";
import { NetworkBackground } from "@/components/ui/animated/NetworkBackground";
import { AnimatedGradient } from "@/components/ui/animated/AnimatedGradient";

export function Problem() {
    const sectionRef = useRef<HTMLElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const lineRef = useRef<HTMLDivElement>(null);
    const problemsRef = useRef<HTMLDivElement>(null);
    const conclusionRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!sectionRef.current) return;

            const mm = gsap.matchMedia();

            mm.add("(min-width: 768px)", () => {
                // Main timeline
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 60%",
                        end: "bottom 80%",
                        toggleActions: "play none none reverse",
                    },
                });

                // Animate heading lines
                const headingLines = headingRef.current?.querySelectorAll(".heading-line");
                if (headingLines) {
                    gsap.set(headingLines, { y: 50, opacity: 0 });
                    tl.to(headingLines, {
                        y: 0,
                        opacity: 1,
                        duration: 0.7,
                        stagger: 0.2,
                        ease: "power3.out",
                    });
                }

                // Animate the vertical line drawing
                if (lineRef.current) {
                    gsap.set(lineRef.current, { scaleY: 0, transformOrigin: "top" });
                    tl.to(
                        lineRef.current,
                        {
                            scaleY: 1,
                            duration: 1.2,
                            ease: "power2.out",
                        },
                        "-=0.3"
                    );
                }

                // Animate problem items
                const problemItems = problemsRef.current?.querySelectorAll(".problem-item");
                if (problemItems) {
                    gsap.set(problemItems, { x: -40, opacity: 0 });
                    tl.to(
                        problemItems,
                        {
                            x: 0,
                            opacity: 1,
                            duration: 0.6,
                            stagger: 0.3,
                            ease: "power2.out",
                        },
                        "-=0.8"
                    );
                }

                // Animate dots
                const dots = problemsRef.current?.querySelectorAll(".problem-dot");
                if (dots) {
                    gsap.set(dots, { scale: 0 });
                    tl.to(
                        dots,
                        {
                            scale: 1,
                            duration: 0.3,
                            stagger: 0.3,
                            ease: "back.out(2)",
                        },
                        "-=1.5"
                    );
                }

                // Animate conclusion
                if (conclusionRef.current) {
                    const glowLine = conclusionRef.current.querySelector(".glow-line");
                    const conclusionText = conclusionRef.current.querySelectorAll("p");

                    gsap.set(conclusionRef.current, { opacity: 0, y: 20 });
                    tl.to(
                        conclusionRef.current,
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                        },
                        "-=0.2"
                    );

                    if (glowLine) {
                        gsap.set(glowLine, { scaleX: 0 });
                        tl.to(glowLine, {
                            scaleX: 1,
                            duration: 0.8,
                            ease: "power2.out",
                        }, "-=0.4");
                    }
                }
            });

            // Mobile fallback - simpler animations
            mm.add("(max-width: 767px)", () => {
                gsap.from(headingRef.current?.querySelectorAll(".heading-line") || [], {
                    y: 30,
                    opacity: 0,
                    duration: 0.6,
                    stagger: 0.15,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                    },
                });
            });
        },
        { scope: sectionRef }
    );

    return (
        <section
            ref={sectionRef}
            id="problem"
            className="py-12 md:py-16 bg-slate-950 relative overflow-hidden"
        >
            {/* Network Background */}
            <NetworkBackground />
            <AnimatedGradient variant="warm" />
            {/* Animated Background Gradient */}


            <div className="max-w-4xl mx-auto px-6 relative z-10">
                {/* Main Statement - Big and Bold */}
                <div className="mb-16">
                    <h2
                        ref={headingRef}
                        className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-depth-subtle"
                    >
                        <span className="heading-line block">Static plans break</span>
                        <span className="heading-line block text-red-500">when life changes.</span>
                    </h2>
                </div>

                {/* The Problems - Animated Border */}
                <div className="relative">
                    {/* Animated vertical line */}
                    <div
                        ref={lineRef}
                        className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-red-500 via-orange-500 to-yellow-500"
                    />

                    <div ref={problemsRef} className="space-y-12 pl-8">
                        <div className="problem-item relative">
                            <div className="problem-dot absolute -left-8 top-2 w-2 h-2 rounded-full bg-red-500" />
                            <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed">
                                It still tells you to <span className="text-red-400 font-medium">deadlift</span>.
                            </p>
                        </div>

                        <div className="problem-item relative">
                            <div className="problem-dot absolute -left-8 top-2 w-2 h-2 rounded-full bg-orange-500" />
                            <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed">
                                Your nutrition app doesn't know you <span className="text-orange-400 font-medium">skipped lunch</span>.
                                <span className="text-slate-500 block mt-1">It recommends a 300-calorie dinner.</span>
                            </p>
                        </div>

                        <div className="problem-item relative">
                            <div className="problem-dot absolute -left-8 top-2 w-2 h-2 rounded-full bg-yellow-500" />
                            <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed">
                                Your sleep tracker doesn't talk to your <span className="text-yellow-400 font-medium">calendar</span>.
                                <span className="text-slate-500 block mt-1">Nobody knows you're running on fumes before a big meeting.</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* The Conclusion */}
                <div
                    ref={conclusionRef}
                    className="mt-20 pt-12 border-t border-white/5 relative"
                >
                    <div className="glow-line absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent origin-left" />
                    <p className="text-lg text-slate-500 max-w-2xl">
                        These apps don't coordinate. They don't remember. They don't reason.
                    </p>
                    <p className="text-lg text-white font-medium mt-2">
                        They're just databases with pretty interfaces.
                    </p>
                </div>
            </div>
        </section>
    );
}
