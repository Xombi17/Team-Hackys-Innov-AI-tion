"use client";

import { useState, useRef } from "react";
import { GiMuscleUp, GiNightSleep, GiMeal } from "react-icons/gi";
import { TbMoon, TbCalendar, TbBattery1, TbBolt, TbLoader } from "react-icons/tb";
import { FiChevronDown } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useGSAP, gsap } from "@/lib/gsap";
import { NetworkBackground } from "@/components/ui/animated/NetworkBackground";
import { AnimatedGradient } from "@/components/ui/animated/AnimatedGradient";
import { runSimulation, Scenario } from "@/lib/api";

const scenarioConfig: Record<Scenario, { label: string; icon: any }> = {
    optimal: { label: "Optimal State", icon: TbBolt },
    sleep_deprived: { label: "Sleep Deprived", icon: TbMoon },
    busy: { label: "Packed Schedule", icon: TbCalendar },
    low_energy: { label: "Low Energy", icon: TbBattery1 },
};

export function LiveSimulation() {
    const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
    const [simulationResult, setSimulationResult] = useState<any>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [showReasoning, setShowReasoning] = useState(true);

    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            if (!sectionRef.current) return;
            // Header animation
            if (headerRef.current) {
                gsap.from(headerRef.current.children, {
                    y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: "power3.out",
                    scrollTrigger: { trigger: headerRef.current, start: "top 80%" },
                });
            }
            // Content panel animation
            if (contentRef.current) {
                gsap.from(contentRef.current, {
                    y: 50, opacity: 0, duration: 0.8, ease: "power3.out",
                    scrollTrigger: { trigger: contentRef.current, start: "top 85%" },
                });
            }
        },
        { scope: sectionRef }
    );

    const handleScenarioChange = async (scenario: Scenario) => {
        if (scenario === activeScenario || isCalculating) return;
        setIsCalculating(true);
        setActiveScenario(scenario);
        setSimulationResult(null); // Clear previous

        try {
            // Animate out (if exists)
            if (resultsRef.current && resultsRef.current.children.length > 0) {
                gsap.to(resultsRef.current.children, { opacity: 0, x: -20, duration: 0.2 });
            }

            // Real API Call
            const result = await runSimulation(scenario);
            setSimulationResult(result);

            // Animate in logic handled by React re-render + GSAP below? 
            // Better to let React render then animate.
            setTimeout(() => {
                if (resultsRef.current) {
                    gsap.fromTo(resultsRef.current.children,
                        { x: 30, opacity: 0 },
                        { x: 0, opacity: 1, duration: 0.4, stagger: 0.1, ease: "power2.out" }
                    );
                }
            }, 100);

        } catch (error) {
            console.error("Simulation failed", error);
        } finally {
            setIsCalculating(false);
        }
    };

    const mapResult = (data: any) => {
        if (!data) return null;
        // Extract inner objects (handle structure variations)
        const f = data.fitness?.workout_plan || data.fitness || {};
        const n = data.nutrition?.meal_plan || data.nutrition || {};
        const s = data.sleep?.sleep_protocol || data.sleep || {};

        return {
            fitness: {
                title: f.type || "Active Recovery",
                detail: `${f.duration || 30} min • ${f.intensity || "Low"} Intensity`
            },
            nutrition: {
                title: n.diet_type || "Balanced",
                detail: `${n.daily_calories || 2000} kcal • ${n.hydration || "Hydrate"}`
            },
            sleep: {
                title: "Sleep Protocol",
                detail: typeof s === 'string' ? s : (s.recommendations || "Prioritize rest").slice(0, 50) + "..."
            },
            reasoning: data.reasoning || data.summary || "Agents coordinated a plan based on your current state."
        };
    };

    const current = mapResult(simulationResult);

    return (
        <section ref={sectionRef} id="simulation" className="py-16 md:py-24 bg-slate-950 relative overflow-hidden">
            <NetworkBackground />
            <AnimatedGradient variant="cool" />
            <div className="absolute inset-0 bg-grid-white/[0.015] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-6">
                <div ref={headerRef} className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 text-depth-subtle">
                        See It React Live
                    </h2>
                    <p className="text-slate-400 max-w-lg mx-auto">
                        Select a scenario. Logic runs on <strong>Real AI Agents</strong>.
                    </p>
                </div>

                <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left: Scenario Selector */}
                    <div className="lg:col-span-4 space-y-3">
                        <p className="text-xs text-slate-500 font-mono mb-4">SELECT INPUT STATE</p>
                        {(Object.keys(scenarioConfig) as Scenario[]).map((key) => {
                            const s = scenarioConfig[key];
                            const isActive = activeScenario === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => handleScenarioChange(key)}
                                    disabled={isCalculating}
                                    className={cn(
                                        "scenario-btn w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all duration-300",
                                        isActive
                                            ? "bg-brand-500/10 border-brand-500/30 text-white scale-[1.02]"
                                            : "bg-slate-900/30 border-white/5 text-slate-400 hover:border-white/10 hover:translate-x-1",
                                        isCalculating && isActive && "animate-pulse"
                                    )}
                                >
                                    <s.icon className={cn("w-5 h-5 transition-colors", isActive && "text-brand-400")} />
                                    <span className="font-medium">{s.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right: Results */}
                    <div className="lg:col-span-8 min-h-[300px]">
                        <p className="text-xs text-slate-500 font-mono mb-4">REAL-TIME AGENT RESPONSE</p>

                        {!activeScenario ? (
                            <div className="flex flex-col items-center justify-center h-full border border-dashed border-slate-800 rounded-xl bg-slate-900/20">
                                <p className="text-slate-500">Select a scenario to trigger the agents.</p>
                            </div>
                        ) : isCalculating ? (
                            <div className="flex flex-col items-center justify-center h-64 gap-4">
                                <div className="relative">
                                    <TbLoader className="w-10 h-10 text-brand-400 animate-spin" />
                                </div>
                                <p className="text-sm text-slate-500 font-mono animate-pulse">
                                    Agents negotiating constraints...
                                </p>
                            </div>
                        ) : current ? (
                            <div ref={resultsRef} className="space-y-4">
                                {[
                                    { icon: GiMuscleUp, color: "blue", data: current.fitness },
                                    { icon: GiMeal, color: "green", data: current.nutrition },
                                    { icon: GiNightSleep, color: "indigo", data: current.sleep },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            "result-card p-4 rounded-xl border flex items-start gap-4 transition-all duration-300 hover:scale-[1.01]",
                                            item.color === "blue" && "bg-blue-500/5 border-blue-500/20",
                                            item.color === "green" && "bg-green-500/5 border-green-500/20",
                                            item.color === "indigo" && "bg-indigo-500/5 border-indigo-500/20",
                                        )}
                                    >
                                        <item.icon className={cn(
                                            "w-6 h-6 mt-0.5 shrink-0",
                                            item.color === "blue" && "text-blue-400",
                                            item.color === "green" && "text-green-400",
                                            item.color === "indigo" && "text-indigo-400",
                                        )} />
                                        <div>
                                            <p className="font-medium text-white">{item.data.title}</p>
                                            <p className="text-sm text-slate-500">{item.data.detail}</p>
                                        </div>
                                    </div>
                                ))}

                                {/* Why This Plan? */}
                                <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/20">
                                    <p className="text-sm text-slate-300 italic">
                                        "{current.reasoning}"
                                    </p>
                                    <p className="text-xs text-brand-400 mt-2 font-mono">— Coordinator Algorithm</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-red-400">Simulation failed. Check API connection.</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
